import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';

const LearmapNavbar = ({ onLogout, token }) => {

  const navigate = useNavigate();  


  //const [token, setToken] = useState(null);
  

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/'); // Redirect to login page
    }
  };


  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky='top'>
      <Container>
        <Navbar.Brand>LearnMap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {token && (
              <>
                <Button variant="light" className="me-2" onClick={() => navigate('/generate')}>
                  Generate
                </Button>
                <Button variant="light" className="me-2" onClick={() => navigate('/allroadmaps')}>
                  All Roadmaps
                </Button>
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LearmapNavbar;