import React from 'react';

const info = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh', // Ensure it stretches to full viewport height
            backgroundColor: '#e9ecef', // Softer background color
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '800px',
                textAlign: 'left', // Better alignment for reading
                backgroundColor: '#ffffff',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Stronger shadow for better elevation
                fontSize: '18px', // Slightly smaller for better readability
                lineHeight: '1.6' // Better line height for readability
            }}>
                <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>Welcome to the PDF Keyword Search App!</h1>
                <p style={{ marginBottom: '20px' }}>
                    This app allows you to analyze any number of PDFs and search for specific keywords or occurrences within them.
                </p>
                <p style={{ marginBottom: '20px' }}>
                    Here's how it works:
                </p>
                <ol style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                    <li>Upload your PDF files using the file upload feature on the home page.</li>
                    <li>Enter the keywords you want to search for in the search bar.</li>
                    <li>Click the "Search" button to start the analysis.</li>
                    <li>Once the analysis is complete, you will see a list of all the occurrences of the keywords in the PDFs.</li>
                    <li>Click on each occurrence to view the specific location of the keyword within the PDF.</li>
                </ol>
                <p style={{ marginBottom: '20px' }}>
                    This app is designed to help you quickly identify and locate specific keywords within your PDF documents.
                </p>
                <p style={{ marginBottom: '0' }}>
                    Start using the app now and make your PDF keyword searches more efficient!
                </p>
            </div>
        </div>
    );
}

export default info;
