import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import './main.css';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

/*
 * function mainpage
 * this is the main component of the application. it handles file uploads, parsing pdfs, keyword searches, and generating excel sheets.
 */
function MainPage() {
  // state variables
  const [files, setFiles] = useState([]); // stores the uploaded files
  const [texts, setTexts] = useState({}); // stores the extracted text from the pdfs
  const [keywords, setKeywords] = useState(''); // stores the keywords input by the user
  const [loading, setLoading] = useState(false); // indicates if the files are being processed
  const [go95Definitions, setGO95Definitions] = useState({}); // stores the definitions from go95.txt
  const [go128Definitions, setGO128Definitions] = useState({}); // stores the definitions from go128.txt

  // useEffect to fetch and parse go95 and go128 definitions on component mount
  useEffect(() => {
    fetch('/go95.txt')
      .then(response => response.text())
      .then(text => {
        const definitions = parseGODefinitions(text);
        setGO95Definitions(definitions);
      });

    fetch('/go128.txt')
      .then(response => response.text())
      .then(text => {
        const definitions = parseGODefinitions(text);
        setGO128Definitions(definitions);
      });
  }, []);

  /*
   * function parseGODefinitions
   * params @ text: string - the content of the go definition file
   * returns: object - a dictionary with rule numbers as keys and definitions as values
   * parses the go definitions from a text file
   */
  const parseGODefinitions = (text) => {
    const lines = text.split('\n');
    const definitions = {};

    lines.forEach(line => {
      const ruleMatch = line.match(/(\d+\.\d+): (.+)/);
      if (ruleMatch) {
        const ruleNumber = ruleMatch[1];
        const definition = ruleMatch[2];
        definitions[ruleNumber] = definition;
      }
    });

    return definitions;
  };

  /*
   * function onDrop
   * params @ acceptedFiles: array - the files uploaded by the user
   * handles file uploads and processes the pdfs
   */
  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setLoading(true);

    const promises = acceptedFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const typedArray = new Uint8Array(reader.result);
          const loadingTask = getDocument(typedArray);
          const pdf = await loadingTask.promise;
          const textPositions = [];

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');

            textPositions.push({ page: i, text: pageText, items: textContent.items });
          }
          setTexts((prevTexts) => ({ ...prevTexts, [file.name]: { textPositions } }));
          resolve();
        };
        reader.readAsArrayBuffer(file);
      });
    });

    Promise.all(promises).then(() => setLoading(false));
  };

  /*
   * function findSentences
   * params @ text: string - the text to search within, keyword: string - the keyword to search for
   * returns: array - an array of sentences that contain the keyword
   * splits the text into sentences and filters them by the keyword
   */
  const findSentences = (text, keyword) => {
    const sentences = text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/);
    return sentences.filter(sentence => sentence.toLowerCase().includes(keyword.toLowerCase()));
  };

  // dropzone hook for handling file uploads
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  /*
   * function handleSearch
   * performs a normal keyword search across the uploaded pdfs
   */
  const handleSearch = () => {
    const keywordsArray = keywords.split(',').map(kw => kw.trim());
    const results = [];
    Object.keys(texts).forEach((fileName) => {
      const { textPositions } = texts[fileName];
      keywordsArray.forEach(keyword => {
        textPositions.forEach(({ page, text }, index) => {
          const sentences = findSentences(text, keyword);
          sentences.forEach((sentence, i) => {
            results.push({
              keyword,
              fileName: fileName.replace('.pdf', ''),
              page,
              occurrence: `${i + 1} / ${sentences.length}`,
              title: sentence
            });
          });
        });
      });
    });
    results.sort((a, b) => a.keyword.localeCompare(b.keyword));
    handleDownload(results);
  };

  /*
   * function handleGeneralOrderAnalysis
   * performs a general order analysis (both go 95 and go 128) across the uploaded pdfs
   */
  const handleGeneralOrderAnalysis = () => {
    const keywordsArray = keywords.split(',').map(kw => kw.trim());
    const results = [];
    Object.keys(texts).forEach((fileName) => {
      const { textPositions } = texts[fileName];
      keywordsArray.forEach(keyword => {
        textPositions.forEach(({ page, text }, index) => {
          const sentences = findSentences(text, keyword);
          sentences.forEach((sentence, i) => {
            const go95Results = analyzeGO95(sentence, fileName, page, i + 1, sentences.length);
            const go128Results = analyzeGO128(sentence, fileName, page, i + 1, sentences.length);
            results.push(...go95Results, ...go128Results);
          });
        });
      });
    });
    results.sort((a, b) => a.keyword.localeCompare(b.keyword));
    handleDownload(results);
  };

  /*
   * function analyzeGO95
   * params @ sentence: string - the sentence to analyze, fileName: string - the name of the file, page: number - the page number, occurrence: number - the occurrence number, totalOccurrences: number - the total occurrences
   * returns: array - an array of results for go 95 rules
   * analyzes a sentence for go 95 rules and returns the results
   */
  const analyzeGO95 = (sentence, fileName, page, occurrence, totalOccurrences) => {
    const results = [];
    const go95Match = sentence.match(/GO 95,? Rules? ([\d.]+)/);
    if (go95Match) {
      const ruleNumber = go95Match[1];
      const goInfo = go95Definitions[ruleNumber] || '';
      results.push({
        keyword: 'GO 95',
        fileName,
        page: `Page ${page}`,
        occurrence: `${occurrence} / ${totalOccurrences}`,
        goNumber: '95',
        ruleNumber,
        goInfo,
        title: sentence
      });
    }
    return results;
  };

  /*
   * function analyzeGO128
   * params @ sentence: string - the sentence to analyze, fileName: string - the name of the file, page: number - the page number, occurrence: number - the occurrence number, totalOccurrences: number - the total occurrences
   * returns: array - an array of results for go 128 rules
   * analyzes a sentence for go 128 rules and returns the results
   */
  const analyzeGO128 = (sentence, fileName, page, occurrence, totalOccurrences) => {
    const results = [];
    const go128Match = sentence.match(/GO 128,? Rules? ([\d.]+)/);
    if (go128Match) {
      const ruleNumber = go128Match[1];
      const goInfo = go128Definitions[ruleNumber] || '';
      results.push({
        keyword: 'GO 128',
        fileName,
        page: `Page ${page}`,
        occurrence: `${occurrence} / ${totalOccurrences}`,
        goNumber: '128',
        ruleNumber,
        goInfo,
        title: sentence
      });
    }
    return results;
  };

  /*
   * function handleDownload
   * params @ results: array - the results to download
   * generates an excel file from the results and initiates a download
   */
  const handleDownload = (results) => {
    const worksheet = XLSX.utils.json_to_sheet(results.map(result => ({
      keyword: result.keyword,
      file: result.fileName,
      page: result.page,
      occurrence: result.occurrence,
      'go ?': result.goNumber || '',
      'rule number': result.ruleNumber || '',
      'definition': result.goInfo || '',
      title: result.title
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, 'pdf_keyword_analyzer.xlsx');
  };

  return (
    <div className="data-page">
      <h1>powerFUL searching.</h1>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>drag and drop pdf files here, or click to select</p>
      </div>
      {loading ? (
        <div>Loading and Generating Files.... </div>
      ) : (
        files.length > 0 && (
          <div>
            <h2>Loading Complete! Please type the keyword below and click search to generate your sheets!</h2>
          </div>
        )
      )}
      {Object.keys(texts).length > 0 && (
        <div>
          <h2>enter keywords to search (comma separated):</h2>
          <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} />
          <div>
            <button onClick={handleSearch}>normal search</button>
            <button onClick={handleGeneralOrderAnalysis}>General Order Analysis</button>
          </div>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <Link to="/">Home</Link> |{' '}
        <Link to="/locate">Locate Specifics</Link> |{' '}
        <Link to="/info">Info</Link> |{' '}
        <Link to="/docs">Developer Docs</Link>
      </div>
    </div>
  );
}

export default MainPage;
