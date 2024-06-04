import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import './main.css';

// Set the worker source for pdf.js
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function MainPage() {
  const [files, setFiles] = useState([]);
  const [texts, setTexts] = useState({});
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false); // New loading state

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setLoading(true); // Set loading to true when files are dropped

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

    Promise.all(promises).then(() => setLoading(false)); // Set loading to false when all files are processed
  };

  const findSentences = (text, keyword) => {
    const sentences = text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/);
    return sentences.filter(sentence => sentence.toLowerCase().includes(keyword.toLowerCase()));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
    handleDownload(results); // Trigger download immediately after search
  };

  const handleDownload = (results) => {
    const worksheet = XLSX.utils.json_to_sheet(results.map(result => ({
      Keyword: result.keyword,
      File: result.fileName,
      Page: `Page ${result.page}`,
      Occurrence: result.occurrence,
      Title: result.title
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
      {loading ? ( // Show loading state
        <div>Loading...</div>
      ) : (
        files.length > 0 && (
          <div>
            <h2>Loading complete</h2>
          </div>
        )
      )}
      {Object.keys(texts).length > 0 && (
        <div>
          <h2>enter keywords to search (comma separated):</h2>
          <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} />
          <button onClick={handleSearch}>search</button>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <Link to="/">Home</Link> |{' '}
        <Link to="/locate">Locate Specifics</Link> |{' '}
        <Link to="/info">Info</Link> |{' '}
        <Link to="/docs">Enhance Data</Link>
      </div>
    </div>
  );
}

export default MainPage;
