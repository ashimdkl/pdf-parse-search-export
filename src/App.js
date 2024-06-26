import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import LocateSpecificsPage from './LocateSpecificsPage';
import DevPage from './developerDocs';
import InfoPage from './info';
import ScrollToTop from './ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/locate" element={<LocateSpecificsPage />} />
          <Route path="/docs" element={<DevPage />} />
          <Route path="/info" element={<InfoPage />} />
        </Routes>
      </ScrollToTop>
    </Router>
  );
}

export default App;
