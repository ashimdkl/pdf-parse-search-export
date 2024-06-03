import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDropzone } from 'react-dropzone';
import { getDocument } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import { Link } from 'react-router-dom';
import './second.css';

// Set the worker source for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function LocateSpecificsPage() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await getDocument(typedArray).promise;
      setNumPages(pdf.numPages);

      let fullText = '';
      const textPositions = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `Page ${i}: ${pageText}\n\n`;

        textPositions.push({ page: i, text: pageText });
      }
      setText(fullText);

      // Prompt user for keywords
      const userKeywords = prompt('Please enter keywords to search, separated by commas:');
      if (userKeywords) {
        const keywordsArray = userKeywords.split(',').map(kw => kw.trim());
        const annotations = [];
        keywordsArray.forEach(keyword => {
          textPositions.forEach(({ page, text }) => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            const matches = text.match(regex);
            if (matches) {
              const existingAnnotation = annotations.find(a => a.page === page && a.keyword === keyword);
              if (existingAnnotation) {
                existingAnnotation.count += matches.length;
              } else {
                annotations.push({
                  keyword,
                  page,
                  count: matches.length
                });
              }
            }
          });
        });
        setAnnotations(annotations);
      }

      // Remove all elements except PDF and controls
      const dropzoneElement = document.querySelector('.dropzone');
      const headerElement = document.querySelector('h1');
      if (dropzoneElement) dropzoneElement.style.display = 'none';
      if (headerElement) headerElement.style.display = 'none';
    };
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const nextPage = () => setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  const prevPage = () => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));

  const renderAnnotations = () => {
    return annotations
      .filter(annotation => annotation.page === pageNumber)
      .map((annotation, index) => (
        <div
          key={index}
          className="annotation-summary"
          style={{
            backgroundColor: 'yellow',
            padding: '5px',
            margin: '5px 0'
          }}
        >
          Keyword: {annotation.keyword} occurred {annotation.count} times on this page.
        </div>
      ));
  };

  return (
    <div className="pdf-viewer">
      <div className="home-button">
        <Link to="/">
          <button>Home Page</button>
        </Link>
      </div>
      {!file && (
        <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
          <input {...getInputProps()} />
          <p>Drag and drop a PDF file here, or click to select</p>
        </div>
      )}
      {file && (
        <div>
          <div className="pdf-container">
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                console.log(`PDF loaded with ${numPages} pages`);
              }}
            >
              <div style={{ position: 'relative' }}>
                <Page pageNumber={pageNumber} />
                {renderAnnotations()}
              </div>
            </Document>
          </div>
          <div className="pagination-controls">
            <button onClick={prevPage} disabled={pageNumber <= 1}>Previous</button>
            <span>Page {pageNumber} of {numPages}</span>
            <button onClick={nextPage} disabled={pageNumber >= numPages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocateSpecificsPage;
