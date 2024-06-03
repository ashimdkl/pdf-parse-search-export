import React from 'react';
import './docs.css';

const MainPageInfo = () => {
    return (
        <div className="container">
            <h2>MainPage Component</h2>
            <p><strong>Overview:</strong></p>
            <p>The MainPage component allows users to upload PDF files, search for keywords within the PDF text, and download the search results to an Excel file. It provides an intuitive interface for document analysis and keyword search, facilitating easy access to specific content within large PDF files.</p>
            <p><strong>Functions:</strong></p>
            <ul>
                <li><strong>useState Hooks:</strong></li>
                <ul>
                    <li><strong>files:</strong> Stores the uploaded files.</li>
                    <li><strong>texts:</strong> Stores the extracted text from the uploaded PDF files.</li>
                    <li><strong>keywords:</strong> Stores the keywords entered by the user for searching.</li>
                    <li><strong>results:</strong> Stores the search results.</li>
                    <li><strong>selectedFile:</strong> Stores the selected file for viewing.</li>
                    <li><strong>selectedPage:</strong> Stores the selected page number for viewing.</li>
                </ul>
                <li><strong>onDrop Function:</strong></li>
                <ul>
                    <li>Triggered when files are dropped into the dropzone.</li>
                    <li>Uses FileReader to read the files as an array buffer.</li>
                    <li>Extracts text from each page of the PDF and stores it in the texts state.</li>
                </ul>
                <li><strong>handleSearch Function:</strong></li>
                <ul>
                    <li>Splits the keywords entered by the user.</li>
                    <li>Searches for each keyword in the extracted text of the uploaded PDF files.</li>
                    <li>Stores the search results in the results state.</li>
                </ul>
                <li><strong>handleDownload Function:</strong></li>
                <ul>
                    <li>Converts the search results to a worksheet.</li>
                    <li>Creates a new workbook and appends the worksheet.</li>
                    <li>Downloads the workbook as an Excel file.</li>
                </ul>
                <li><strong>handleKeywordClick Function:</strong></li>
                <ul>
                    <li>Sets the selected file and page number for viewing.</li>
                </ul>
            </ul>
            <p><strong>Components:</strong></p>
            <ul>
                <li><strong>Dropzone:</strong> Allows users to drag and drop PDF files for uploading.</li>
                <li><strong>Search Input:</strong> Allows users to enter keywords for searching.</li>
                <li><strong>Results Table:</strong> Displays the search results with columns for file name, keyword, page number, and occurrences.</li>
                <li><strong>PDF Viewer:</strong> Displays the selected PDF file and page.</li>
            </ul>
        </div>
    );
};

const LocateSpecificPageInfo = () => {
    return (
        <div className="container">
            <h2>LocateSpecificPage Component</h2>
            <p><strong>Overview:</strong></p>
            <p>The LocateSpecificPage component allows users to search for specific keywords within a PDF file and view the occurrences of those keywords. It provides functionality to highlight the keywords and navigate through the pages of the PDF.</p>
            <p><strong>Functions:</strong></p>
            <ul>
                <li><strong>useState Hooks:</strong></li>
                <ul>
                    <li><strong>file:</strong> Stores the uploaded PDF file.</li>
                    <li><strong>text:</strong> Stores the extracted text from the PDF file.</li>
                    <li><strong>annotations:</strong> Stores the keyword annotations with their occurrences and page numbers.</li>
                    <li><strong>numPages:</strong> Stores the total number of pages in the PDF file.</li>
                    <li><strong>pageNumber:</strong> Stores the current page number being viewed.</li>
                </ul>
                <li><strong>onDrop Function:</strong></li>
                <ul>
                    <li>Triggered when a file is dropped into the dropzone.</li>
                    <li>Uses FileReader to read the file as an array buffer.</li>
                    <li>Extracts text from each page of the PDF and stores it in the text state.</li>
                    <li>Prompts the user for keywords to search within the PDF.</li>
                    <li>Finds occurrences of the keywords and stores them in the annotations state.</li>
                </ul>
                <li><strong>nextPage Function:</strong></li>
                <ul>
                    <li>Advances to the next page of the PDF.</li>
                </ul>
                <li><strong>prevPage Function:</strong></li>
                <ul>
                    <li>Returns to the previous page of the PDF.</li>
                </ul>
                <li><strong>renderAnnotations Function:</strong></li>
                <ul>
                    <li>Renders the annotations for the current page.</li>
                </ul>
                <li><strong>renderHighlightedText Function:</strong></li>
                <ul>
                    <li>Renders the text of the current page with keywords highlighted.</li>
                </ul>
            </ul>
            <p><strong>Components:</strong></p>
            <ul>
                <li><strong>Dropzone:</strong> Allows users to drag and drop a PDF file for uploading.</li>
                <li><strong>PDF Viewer:</strong> Displays the uploaded PDF file and allows navigation through pages.</li>
                <li><strong>Keyword Highlights:</strong> Highlights the keywords in the text of the current page.</li>
            </ul>
        </div>
    );
};

const Docs = () => {
    return (
        <div className="flex-container">
            <MainPageInfo />
            <LocateSpecificPageInfo />
        </div>
    );
};

export default Docs;
