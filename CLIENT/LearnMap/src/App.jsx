import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Spinner, Container } from 'react-bootstrap';
import axios from 'axios';
import Home from './Home';
import Roadmap from './Roadmap';
import './App.css';

function App() {
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiEndPoint = `http://localhost:3000/api`//import.meta.env.API_BASE_URL; 

  const handleGenerateRoadmap = async (formData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiEndPoint}/generate`, formData);
      setRoadmapData(response.data);
    } catch (error) {
      console.error('Error fetching roadmap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <Container>
        {isLoading && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1050 }}
            className="d-flex justify-content-center align-items-center"
          >
            <div className="text-center bg-white p-4 rounded shadow">
              <Spinner animation="border" variant="primary" />
              <div className="mt-3 fw-semibold">Generating roadmap — this may take 10–30 seconds</div>
              <div className="small text-muted">Please don’t close the tab.</div>
            </div>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={<Home onGenerate={handleGenerateRoadmap} />}
          />
          <Route
            path="/roadmap"
            element={<Roadmap roadmapData={roadmapData} />}
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;