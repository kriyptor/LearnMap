import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Card,
  Accordion,
  ListGroup,
  Badge,
  Spinner,
  Button,
  Alert,
} from 'react-bootstrap';

export default function ViewRoadmap() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    let cancelled = false;
    const fetchRoadmap = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated. Please login.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${apiBase}/roadmap/get-roadmap/${id}`, {
          headers: { Authorization: token },
        });
        if (!cancelled) setRoadmap(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || err.message || 'Failed to load roadmap');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRoadmap();
    return () => {
      cancelled = true;
    };
  }, [id, apiBase]);

  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center">
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <div className="mt-2 text-muted small">Loading roadmap…</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate('/allroadmaps')}>
          Back to all roadmaps
        </Button>
      </Container>
    );
  }

  if (!roadmap) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Roadmap not found.</Alert>
        <Button variant="secondary" onClick={() => navigate('/allroadmaps')}>
          Back to all roadmaps
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow mb-4 border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Card.Title className="display-6 fw-bold text-primary">{roadmap.topic}</Card.Title>
              <Card.Text className="text-muted mb-2">{roadmap.shortDescription}</Card.Text>
              <Badge bg="primary" className="fs-6">
                Estimated: {roadmap.estimatedTotalHours} Hours
              </Badge>
            </div>
            <div>
              <Button variant="outline-secondary" className="me-2" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button variant="light" onClick={() => navigate('/allroadmaps')}>
                All Roadmaps
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Accordion defaultActiveKey="0" className="shadow">
        {(roadmap.modules || []).map((module) => (
          <Accordion.Item eventKey={String(module.order)} key={module.order}>
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 pe-3 align-items-center">
                <span className="fw-bold">{module.title}</span>
                <Badge bg="secondary">{module.estimatedHours} Hours</Badge>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <p className="text-muted mb-3">{module.summary}</p>
              <ListGroup variant="flush">
                {(module.lessons || []).map((lesson) => (
                  <ListGroup.Item
                    key={lesson.order}
                    className="border-0 py-3 px-4 bg-light rounded mb-2"
                  >
                    <div className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0">{lesson.title}</h5>
                        <Badge bg="info" className="ms-2">
                          {lesson.estimatedHours} Hours
                        </Badge>
                      </div>
                      <p className="text-muted mb-2">{lesson.description}</p>
                      <div className="mb-3">
                        {(lesson.resources || []).map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-block text-primary text-decoration-none mb-1"
                          >
                            {resource.title} ({resource.type})
                          </a>
                        ))}
                      </div>
                      <Button variant="outline-primary" size="sm" className="align-self-start">
                        Start Learning
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}