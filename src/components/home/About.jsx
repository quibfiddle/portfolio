import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import "./about.css"

function About() {
  return (
    <div id="about" className="py-5 about">
      <Container>
        <Row className="align-items-center">
          <Col md={8}>
            <h3>About Me</h3>
            <div className="description">
              <p>
                I am a tech-savvy engineer, currently living in Phoenix, that has been working in the field of robotic process automation services. I have supported hundreds of companies across the US which has given me the opportunity to learn the ins and outs of countless technologies and how they are used in business environments.
              </p>
              <p>
                You can read more about my experience on my <a href="/resume.html">resume</a> or in the projects section below.
              </p>
              <p>
                What interests me now is drawing from my wide understanding of these different technologies, and building applications, systems, and automation that helps tie it all together, and ultimately enable companies to do business better.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <Image src="images/StuartBingham.jpg" fluid bordered rounded />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default About;