import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import LocateSpecificsPage from './LocateSpecificsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/locate" element={<LocateSpecificsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
