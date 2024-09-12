import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import './experience.css'


function Experience() {
    return (
        <Container id="experience">
            <Row class="fixed-height-row">
                <Col md={3} className="d-flex justify-content-center align-items-center"><Image src="images/Proveo.png" fluid/></Col>
                <Col md={6} className="d-flex justify-content-center align-items-center">     
                    <Row>
                        <h2>Proveo</h2>
                    </Row>
                    <Row>
                     <h3>Robotic Process Automation Consultant</h3>
                    </Row>
                </Col>
                <Col md={3} className="d-flex justify-content-center align-items-center"><h2>2019 - Current</h2></Col>
            </Row>
            <Row class="fixed-height-row"> 
                <Col md={3} className="d-flex justify-content-center align-items-center"><Image src="images/tllogo.png" fluid/></Col>
                <Col md={6} className="d-flex justify-content-center align-items-center">     
                    <Row>
                        <h2>TeamLogic IT</h2>
                    </Row>
                    <Row>
                     <h3>Tier 2 Service and Support Specialist</h3>
                    </Row>
                </Col>
                <Col md={3} className="d-flex justify-content-center align-items-center"><h2>2017 - 2019</h2></Col>
            </Row>
            <Row class="fixed-height-row">
                <Col md={3} className="d-flex justify-content-center align-items-center"><Image src="images/allcoveredlogo.png" fluid/></Col>
                <Col md={6} className="d-flex justify-content-center align-items-center">     
                    <Row>
                        <h2>AllCovered</h2>
                    </Row>
                    <Row>
                     <h3>Service Design &amp; Transition Engineer</h3>
                    </Row>
                </Col>
                <Col md={3} className="d-flex justify-content-center align-items-center"><h2>2014 - 2017</h2></Col>
            </Row>
            <Row class="fixed-height-row">
                <Col md={3} className="d-flex justify-content-center align-items-center"><Image src="images/mcdermitt.png" fluid/></Col>
                <Col md={6} className="d-flex justify-content-center align-items-center">     
                    <Row>
                        <h2>McDermit Consulting</h2>
                    </Row>
                    <Row>
                     <h3>Onsite and Remote Support Engineer</h3>
                    </Row>
                </Col>
                <Col md={3} className="d-flex justify-content-center align-items-center"><h2>2014 - 2014</h2></Col>
            </Row>
            <Row class="fixed-height-row">
                <Col md={3} className="d-flex justify-content-center align-items-center"><Image src="images/myteklogo.png" fluid/></Col>
                <Col md={6} className="d-flex justify-content-center align-items-center">     
                    <Row>
                        <h2>Mytek Network Solutions</h2>
                    </Row>
                    <Row>
                     <h3>Remote Support Analyst &amp; NOC Analyst</h3>
                    </Row>
                </Col>
                <Col md={3} className="d-flex justify-content-center align-items-center"><h2>2019 - Current</h2></Col>
            </Row>
        </Container>
    )
}

export default Experience