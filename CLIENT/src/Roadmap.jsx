import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Card,
  Accordion,
  Button,
  ListGroup,
  Badge,
  Alert,
  Spinner,
} from 'react-bootstrap';

function Roadmap({ roadmapData }) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saveError, setSaveError] = useState(null);

  if (!roadmapData) {
    return <Container className="py-5">No roadmap data available.</Container>;
  }

  const handleRecreate = () => {
    // Clear any transient messages and navigate home for a fresh generation
    setSaveError(null);
    setSaveSuccess(null);
    navigate('/generate');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const res = await axios.post(import.meta.env.VITE_API_BASE_URL + '/roadmap/save', roadmapData,
        { headers: { "Authorization" : localStorage.getItem('token') } });
      setSaveSuccess('Roadmap saved successfully');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Unknown error';
      setSaveError(`Failed to save roadmap: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="shadow mb-4 border-0">
        <Card.Body>
          <div className="d-flex align-items-start justify-content-between">
            <div>
              <Card.Title className="display-6 fw-bold text-primary">
                {roadmapData.topic}
              </Card.Title>
              <Card.Text className="text-muted mb-3">
                {roadmapData.shortDescription}
              </Card.Text>
              <Badge bg="primary" className="fs-6">
                Estimated: {roadmapData.estimatedTotalHours} Hours
              </Badge>
            </div>

            <div className="ms-3 d-flex flex-column align-items-end">
              <div className="d-flex gap-2 mb-2">
                <Button
                  variant={saveSuccess ? 'success' : 'primary'}
                  onClick={handleSave}
                  disabled={isSaving || !!saveSuccess}
                >
                  {isSaving ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    'Saved'
                  ) : (
                    'Save Roadmap'
                  )}
                </Button>

                <Button variant="outline-secondary" onClick={handleRecreate}>
                  Create New Roadmap
                </Button>
              </div>
              <small className="text-muted">You can save this roadmap to your account.</small>
            </div>
          </div>
        </Card.Body>
      </Card>

      {saveSuccess && <Alert variant="success">{saveSuccess}</Alert>}
      {saveError && <Alert variant="danger">{saveError}</Alert>}

      <Accordion defaultActiveKey="0" className="shadow">
        {roadmapData.modules.map((module) => (
          <Accordion.Item eventKey={module.order.toString()} key={module.order}>
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 pe-3 align-items-center">
                <span className="fw-bold">{module.title}</span>
                <Badge bg="secondary">{module.estimatedHours} Hours</Badge>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <p className="text-muted mb-4">{module.summary}</p>
              <ListGroup variant="flush">
                {module.lessons.map((lesson) => (
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
                        {lesson.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-block text-primary text-decoration-none mb-1"
                          >
                            {resource.title} ({resource.type})
                          </a>
                        ))}
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="align-self-start"
                      >
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

export default Roadmap;