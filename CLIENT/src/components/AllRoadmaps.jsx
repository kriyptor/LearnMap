import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';

export default function AllRoadmaps() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBase = import.meta.env.VITE_API_BASE_URL ;

  useEffect(() => {
    const fetchRoadmaps = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated. Please login.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(apiBase + '/roadmap/allroadmap', {
          headers: { Authorization: token }
        });
        setRoadmaps(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load roadmaps');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}

      {!error && roadmaps.length === 0 && (
        <Alert variant="info">No saved roadmaps found.</Alert>
      )}

      <Row className="g-3">
        {roadmaps.map((r) => (
          <Col key={r._id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{r.topic}</Card.Title>
                <Card.Text className="text-muted small mb-3" style={{ flex: '1 1 auto' }}>
                  {r.shortDescription}
                </Card.Text>

                <div className="mb-3">
                  <Badge bg="secondary" className="me-2">
                    Modules: {r.modules}
                  </Badge>
                  <Badge bg="primary">Est: {r.estimatedTotalHours} hrs</Badge>
                </div>

                <div className="mt-auto d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/roadmap/${r._id}`)}
                  >
                    View
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}