import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import TV from "./components/TV";
import Tablet from "./components/Tablet";
import Results from './components/Results';


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/draw/:gameCode" element={<Tablet />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Router>
  );
}

export default App;
