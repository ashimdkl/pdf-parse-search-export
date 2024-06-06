import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDropzone } from 'react-dropzone';
import { getDocument } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import { Link } from 'react-router-dom';
import './second.css';

// Set the worker source for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;



// LocateSpecificsPage component
function LocateSpecificsPage() {
  // State variables
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Function to handle file drop
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);


    // Read the file and extract text
    const reader = new FileReader();
    // Callback function when file is read
    reader.onload = async () => {
      // Convert the array buffer to a typed array
      const typedArray = new Uint8Array(reader.result);
      // Get the PDF document
      const pdf = await getDocument(typedArray).promise;
      setNumPages(pdf.numPages);


      // Extract text from each page
      let fullText = '';
      // Array to store text and page number
      const textPositions = [];
      // Loop through each page
      for (let i = 1; i <= pdf.numPages; i++) {
        // Get the page
        const page = await pdf.getPage(i);
        // Get the text content
        const textContent = await page.getTextContent();
        // Extract the text items from the content and join them into a string.
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `Page ${i}: ${pageText}\n\n`;

        textPositions.push({ page: i, text: pageText });
      }

      // Set the extracted text in the state
      setText(fullText);

      // Prompt user for keywords
      const userKeywords = prompt('Please enter keywords to search, separated by commas:');
      if (userKeywords) {
        const keywordsArray = userKeywords.split(',').map(kw => kw.trim());
        // Search for keywords in the text and then count the occurrences and then set the annotations
        const annotations = [];
        keywordsArray.forEach(keyword => {
          textPositions.forEach(({ page, text }) => {
            // Create a regular expression to match the keyword
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            // Get all matches of the keyword in the text
            const matches = text.match(regex);
            // If there are matches, add the annotation
            if (matches) {
              // Check if the annotation already exists
              const existingAnnotation = annotations.find(a => a.page === page && a.keyword === keyword);
              // If it exists, increment the count, otherwise add a new annotation
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
        // Set the annotations in the state
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

  // Function to handle page navigation
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Function to navigate to the next page and the previous page
  const nextPage = () => setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  const prevPage = () => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));

  // Function to render annotations
  const renderAnnotations = () => {
    // Filter annotations for the current page
    return annotations
      .filter(annotation => annotation.page === pageNumber)
      // Map the annotations to a div element. p much js highglighting.
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
          // Display the keyword and the count of occurrences
          Keyword: {annotation.keyword} occurred {annotation.count} times on this page.
        </div>
      ));
  };

  // Function to render highlighted text
  const renderHighlightedText = () => {
    // Get the text for the current page
    const currentPageText = text.split(`Page ${pageNumber}:`)[1]?.split(`Page ${pageNumber + 1}:`)[0];
    if (!currentPageText) return null;

    // Highlight the keywords in the text
    const userKeywords = annotations.map(annotation => annotation.keyword);
    let highlightedText = currentPageText;
    // Loop through each keyword and highlight it in the text
    userKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, match => `<mark>${match}</mark>`);
    });
    // Return the highlighted text
    return <div dangerouslySetInnerHTML={{ __html: highlightedText }} />;
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
        <>
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
          <div className="text-container">
            <h2>Text Extraction</h2>
            {renderHighlightedText()}
          </div>
        </>
      )}
      {file && (
        <div className="pagination-controls">
          <button onClick={prevPage} disabled={pageNumber <= 1}>Previous</button>
          <span>Page {pageNumber} of {numPages}</span>
          <button onClick={nextPage} disabled={pageNumber >= numPages}>Next</button>
        </div>
      )}
      {file && annotations.filter(annotation => annotation.page === pageNumber).map((annotation, index) => (
        <div key={index} className="keyword-summary">
          Page {annotation.page} has {annotation.count} occurrences of the keyword "{annotation.keyword}".
        </div>
      ))}
    </div>
  );
}

export default LocateSpecificsPage;