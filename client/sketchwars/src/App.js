import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import TV from "./TV";
import Home from "./components/Home";
import Tablet from "./components/Tablet";
import Fabric from "./components/Fabric";
import FabricBug from "./components/FabricBug";


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/draw" element={<Fabric />} />
          <Route path="/draw/:gameCode" element={<Fabric />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/tablet" element={<Tablet />} />
        </Routes>
      </Router>
  );
}

export default App;
