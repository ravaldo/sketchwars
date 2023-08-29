import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TV from './TV';

import Fabric from './components/Fabric';
import './App.css';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/draw" element={<Fabric />} />
        <Route path="/tv" element={<TV/>}/>
      </Routes>
      </Router>
    </>
  );
}

export default App;
