import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import LocateSpecificsPage from './LocateSpecificsPage';
import DocsPage from './docs';
import InfoPage from './info';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/locate" element={<LocateSpecificsPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/info" element={<InfoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
