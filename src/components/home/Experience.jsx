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
                <Col xs={12} md={3} className="d-flex justify-content-center align-items-center"><Image src="images/Proveo.png" fluid/></Col>
                <Col xs={12} md={6} className="d-flex flex-column justify-content-center align-items-center mb-3 mb-md-0">     
                <h2>Proveo</h2>
                <h3>Lead Robotic Process Automation Developer</h3>
                </Col>
                <Col xs={12} md={3} className="d-flex justify-content-center align-items-center"><h2>2019 - 2024</h2></Col>
            </Row>
            <Row class="fixed-height-row"> 
                <Col xs={12} md={3} className="d-flex justify-content-center align-items-center"><Image src="images/tllogo.png" fluid/></Col>
                <Col xs={12} md={6} className="d-flex flex-column justify-content-center align-items-center mb-3 mb-md-0">    
                     <h2>TeamLogic IT</h2>
                     <h3>Tier 2 Service and Support Specialist</h3>
                </Col>
                <Col xs={12} md={3} className="d-flex justify-content-center align-items-center"><h2>2017 - 2019</h2></Col>
            </Row>
            <Row class="fixed-height-row">
                <Col xs={12} md={3} className="d-flex justify-content-center align-items-center"><Image src="images/allcoveredlogo.png" fluid/></Col>
                <Col xs={12} md={6} className="d-flex flex-column justify-content-center align-items-center mb-3 mb-md-0">    
                     <h2>AllCovered</h2>
                     <h3>Service Design &amp; Transition Engineer</h3>
                </Col>
                <Col xs={12} md={3} className="d-flex justify-content-center align-items-center"><h2>2014 - 2017</h2></Col>
            </Row>
            <Row class="fixed-height-row">
                <Col xs={12} md={3} className="d-flex justify-content-center align-items-center"><Image src="images/mcdermitt.png" fluid/></Col>
                <Col xs={12} md={6} className="d-flex flex-column justify-content-center align-items-center mb-3 mb-md-0">    
                     <h2>McDermit Consulting</h2>
                     <h3>Onsite and Remote Support Engineer</h3>
                </Col>
                <Col xs={12} md={3} className="d-flex justify-content-center align-items-center"><h2>2014</h2></Col>
            </Row>
            <Row class="fixed-height-row">
                <Col xs={12} md={3} className="d-flex justify-content-center align-items-center"><Image src="images/myteklogo.png" fluid/></Col>
                <Col xs={12} md={6} className="d-flex flex-column justify-content-center align-items-center mb-3 mb-md-0">    
                     <h2>Mytek Network Solutions</h2>
                     <h3>Remote Support Analyst &amp; NOC Analyst</h3>
                </Col>
                <Col xs={12} md={3} className="d-flex justify-content-center align-items-center"><h2>2013</h2></Col>
            </Row>
        </Container>
    )
}

export default Experience