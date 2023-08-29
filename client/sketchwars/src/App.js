import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TV from "./TV";
import Home from "./components/Home";
import Tablet from "./components/Tablet";

import Fabric from "./components/Fabric";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/draw" element={<Fabric />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tablet" element={<Tablet />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
