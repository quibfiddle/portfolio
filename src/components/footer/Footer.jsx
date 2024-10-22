import React from 'react';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';

const Footer = () => {
  return (
    <div className="bg-dark text-light py-5" id="contact">
      <Container>
        <Row className="justify-content-center">
          {/* <Col md={3}>
            <h4>Find Me On Other Sites</h4>
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-dark border-0">
                <a href="https://github.com/quibfiddle" className="text-light">
                  Github
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark border-0">
                <a href="https://connect.uipath.com/profile/stuart-bingham" className="text-light">
                  UiPath Connect
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark border-0">
                <a href="https://www.linkedin.com/in/stuart-bingham-6267356a" className="text-light">
                  LinkedIn
                </a>
              </ListGroup.Item>
            </ListGroup>
          </Col> */}

          <Col md={6}>
            <h4>More about This Site</h4>
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-dark border-0">
                <a href="/resume" className="text-light">
                  Resume
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark border-0">
                <a href="https://react-bootstrap.netlify.app/" className="text-light">
                  Built using Vite, React and React-Bootstrap
                </a>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={6}>
            <h4>Want to discuss your next automation project?</h4>
            <a href="mailto:bingham.stuart@gmail.com">
              <Button size="lg" block variant="primary">
                <i className="fas fa-envelope"></i> MESSAGE ME
              </Button>
            </a>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
