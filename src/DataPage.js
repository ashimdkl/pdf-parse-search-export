import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import './data.css';
import * as d3 from 'd3';

function DataPage() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [htmlTable, setHtmlTable] = useState('');

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    if (data.length > 0) {
      const groupedResults = {};
      data.forEach(row => {
        const [keyword, file, page, occurrences, title] = row;
        if (!groupedResults[keyword]) {
          groupedResults[keyword] = [];
        }
        groupedResults[keyword].push({ file, page, occurrences, title });
      });
      setGroupedData(groupedResults);
      createHtmlTable(groupedResults);
      createD3Visualization(groupedResults);
    }
  }, [data]);

  const createHtmlTable = (groupedResults) => {
    let tableHtml = '';
    Object.keys(groupedResults).forEach(keyword => {
      tableHtml += `<h3>Table for keyword: ${keyword}</h3>`;
      tableHtml += `<table><thead><tr><th>Page #</th><th># of Occurrences</th><th>Doc Title</th><th>File Name</th></tr></thead><tbody>`;
      groupedResults[keyword].forEach(result => {
        tableHtml += `<tr><td>${result.page}</td><td>${result.occurrences}</td><td>${result.title}</td><td>${result.file}</td></tr>`;
      });
      tableHtml += `</tbody></table>`;
    });
    setHtmlTable(tableHtml);
  };

  const createD3Visualization = (groupedResults) => {
    d3.select('#d3-container').selectAll('*').remove();

    Object.keys(groupedResults).forEach(keyword => {
      const container = d3.select('#d3-container').append('div').attr('class', 'keyword-container');
      container.append('h3').text(`Visualization for keyword: ${keyword}`);

      const table = container.append('table');
      table.append('thead').append('tr')
        .selectAll('th')
        .data(['Page #', '# of Occurrences', 'Doc Title', 'File Name'])
        .enter()
        .append('th')
        .text(d => d);

      const tbody = table.append('tbody');
      groupedResults[keyword].forEach(result => {
        const row = tbody.append('tr');
        row.append('td').text(result.page);
        row.append('td').text(result.occurrences);
        row.append('td').text(result.title);
        row.append('td').text(result.file);
      });
    });
  };

  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();
    Object.keys(groupedData).forEach(keyword => {
      const sheetData = groupedData[keyword].map(result => [result.page, result.occurrences, result.title, result.file]);
      sheetData.unshift(['Page #', '# of Occurrences', 'Doc Title', 'File Name']);
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, keyword);
    });
    XLSX.writeFile(workbook, 'enhanced_data.xlsx');
  };

  return (
    <div className="data-page">
      <h1>Enhance Data</h1>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag and drop an Excel file here, or click to select a file</p>
      </div>
      {file && (
        <div>
          <h2>Uploaded File: {file.name}</h2>
          <div id="d3-container"></div>
          <div dangerouslySetInnerHTML={{ __html: htmlTable }}></div>
          <button onClick={handleDownload}>Download Updated Excel</button>
        </div>
      )}
    </div>
  );
}

export default DataPage;
