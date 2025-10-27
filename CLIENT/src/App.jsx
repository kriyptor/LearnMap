import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Spinner, Container } from 'react-bootstrap';
import axios from 'axios';
import Home from './Home';
import Roadmap from './Roadmap';
import AuthComponent from './components/Auth';
import LearmapNavbar from './components/Navbar';
import AllRoadmaps from './components/AllRoadmaps';
import ViewRoadmap from './components/ViewRoadmap';

function App() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiEndPoint = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserStatus();
  }, []);

  const handleGenerateRoadmap = async (formData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiEndPoint}/roadmap/generate`,  formData,
        { headers: { "Authorization" : token } }
      );
      setRoadmapData(response.data);
    } catch (error) {
      console.error('Error fetching roadmap:', error);
    } finally {
      setIsLoading(false);
    }
  };

   // Login handler
  const handleLogin = async (token) => {
    try {
      setToken(token);
      setIsAuthenticated(true);
      localStorage.setItem('token', token); 
    } catch (error) {
      console.error("Login error:", error);
      // Add proper error handling here
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
       <LearmapNavbar onLogout={handleLogout} isAuthenticated={isAuthenticated} token={token}/>
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
            element={<AuthComponent handleLogin={handleLogin} />}
          />

          <Route
            path="/generate"
            element={
              isAuthenticated ? (
                <Home onGenerate={handleGenerateRoadmap} token={token} />
              ) : (
                <AuthComponent handleLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/view-roadmap"
            element={
              isAuthenticated ? (
                <Roadmap roadmapData={roadmapData} token={token} />
              ) : (
                <AuthComponent handleLogin={handleLogin} />
              )
            }
          />

        <Route
            path="/allroadmaps"
            element={
              isAuthenticated ? (
                <AllRoadmaps token={token} />
              ) : (
                <AuthComponent handleLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/roadmap/:id"
            element={
              isAuthenticated ? (
                <ViewRoadmap token={token} />
              ) : (
                <AuthComponent handleLogin={handleLogin} />
              )
            }
          />

        </Routes>
      </Container>
    </Router>
  );
}

export default App;