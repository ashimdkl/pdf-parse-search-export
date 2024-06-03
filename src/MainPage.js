import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDropzone } from 'react-dropzone';
import { getDocument } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import './main.css';

// set the worker source for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function MainPage() {
  const [files, setFiles] = useState([]);
  const [texts, setTexts] = useState({});
  const [keywords, setKeywords] = useState('');
  const [results, setResults] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await getDocument(typedArray).promise;
        let fullText = '';
        const textPositions = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += `Page ${i}: ${pageText}\n\n`;

          textPositions.push({ page: i, text: pageText });
        }
        setTexts((prevTexts) => ({ ...prevTexts, [file.name]: { fullText, textPositions } }));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSearch = () => {
    const keywordsArray = keywords.split(',').map(kw => kw.trim());
    const results = [];
    Object.keys(texts).forEach((fileName) => {
      const { fullText, textPositions } = texts[fileName];
      keywordsArray.forEach(keyword => {
        textPositions.forEach(({ page, text }) => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          const matches = text.match(regex);
          if (matches) {
            results.push({
              keyword,
              fileName: fileName.replace('.pdf', ''),
              page,
              occurrences: matches.length
            });
          }
        });
      });
    });
    results.sort((a, b) => a.keyword.localeCompare(b.keyword));
    setResults(results);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(results.map(result => ({
      Keyword: result.keyword,
      File: result.fileName,
      Page: `Page ${result.page}`,
      Occurrences: result.occurrences
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, 'pdf_keyword_analyzer.xlsx');
  };

  const handleKeywordClick = (fileName, page) => {
    setSelectedFile(files.find(file => file.name === `${fileName}.pdf`));
    setSelectedPage(page);
  };

  return (
    <div>
      <h1>powerFUL searching.</h1>
      <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <p>drag and drop pdf files here, or click to select</p>
      </div>
      {files.length > 0 && (
        <div>
          <h2>uploaded files:</h2>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      {Object.keys(texts).length > 0 && (
        <div>
          <h2>enter keywords to search (comma separated):</h2>
          <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} />
          <button onClick={handleSearch}>search</button>
        </div>
      )}
      {results.length > 0 && (
        <div>
          <h2>search results:</h2>
          <table>
            <thead>
              <tr>
                <th>file</th>
                <th>keyword</th>
                <th>page</th>
                <th>occurrences</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} onClick={() => handleKeywordClick(result.fileName, result.page)}>
                  <td>{result.fileName}</td>
                  <td>{result.keyword}</td>
                  <td>page {result.page}</td>
                  <td>{result.occurrences}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleDownload}>download to excel</button>
        </div>
      )}
      {selectedFile && selectedPage && (
        <div>
          <h2>viewing: {selectedFile.name}</h2>
          <Document file={selectedFile}>
            <Page pageNumber={selectedPage} />
          </Document>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <Link to="/">Home</Link> |{' '}
        <Link to="/locate">Locate Specifics</Link> |{' '}
        <Link to="/info">Info</Link> |{' '}
        <Link to="/docs">Website Docs</Link>
      </div>
    </div>
  );
}

export default MainPage;
