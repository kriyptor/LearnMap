import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

function Home({ onGenerate }) {
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'beginner',
    outcome: 'job-ready',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onGenerate(formData);
    navigate('/roadmap');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Form className="shadow p-4 rounded bg-light" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="topicName">
              <Form.Label>Topic Name</Form.Label>
              <Form.Control
                type="text"
                name="topic"
                placeholder="Enter topic"
                className="border-primary"
                value={formData.topic}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="difficulty">
              <Form.Label>Difficulty Level</Form.Label>
              <Form.Select
                name="difficulty"
                className="border-primary"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4" controlId="outcome">
              <Form.Label>Target Outcome</Form.Label>
              <Form.Select
                name="outcome"
                className="border-primary"
                value={formData.outcome}
                onChange={handleChange}
              >
                <option value="job-ready">Become Job-Ready</option>
                <option value="theory">Understand Theory</option>
                <option value="projects">Build Projects</option>
              </Form.Select>
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" className="py-2 fw-bold">
                Generate
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;