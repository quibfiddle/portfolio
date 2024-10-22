import { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import { useTabContext } from './TabContext'; // Import the custom hook
import "./projects.css"

function Projects() {
    
  const { activeTab, setActiveTab } = useTabContext(); // Access context

  return (
    <Container id="projects">
        <Tabs
        id="project-tabs"
        activeKey={activeTab} // Set the active tab from context
        onSelect={(k) => setActiveTab(k)} // Update context on tab selection
        defaultActiveKey={'rpa'}
        >
        <Tab eventKey="rpa" title="Robotic Process Automation">
            <Container>
                <Row >
                    <Col xs={12} md={4} className="d-flex justify-content-center align-items-center mb-3 mb-md-0"><Image src="images/soundstrue.webp" fluid></Image></Col>
                    <Col xs={12} md={8}><h3>Sounds True Online Course Migration</h3><span>For this project, I worked with stakeholders to understand and develop a RPA tool to extract the entire Course Library from their previous e-learning platform and load it into their current one. With the tool, we were able to perform ETL on over 150 courses, each of which had 10 - 100 pages and videos associated with them. The tool has since been used to perform similar migrations on several other e-learning platforms such as <a href="https://psycharmor.org/">PsychArmor</a>, <a href="https://www.functionalmovement.com">Functional Movement</a> and <a href="https://www.golearn.dk/">GoLearn</a></span></Col>
                </Row>
                <Row >
                    <Col xs={12} md={4} className="d-flex justify-content-center align-items-center mb-3 mb-md-0"><Image src="images/dhs.png" fluid></Image></Col>
                    <Col xs={12} md={8}><h3>Department of Homeland Security Acquisition Program Baseline Cataloging</h3><span>DHS Manages projects through the use of Acquisition Program Baseline (APBs) documents to measure program cost, schedule and performance. The documents themselves however, were often PDFs that had been printed, written on, scanned and saved again. In this project, using UiPath, I demonstrated our ability to iterate through a provided set of such documents, use computer vision to extract the text contents of those documents, and store metadata in a database about each APB, such as name, budget, expected completion ect.</span></Col>
                </Row>
            </Container>
        </Tab>
        <Tab eventKey="webdev" title="Web Development">
            <Container>
                <Row >
                    <Col xs={12} md={4} className="d-flex justify-content-center align-items-center mb-3 mb-md-0"><Image src="images/Market-Deals-HQ-logo.webp" fluid></Image></Col>
                    <Col xs={12} md={8} ><h3>Off Market Deals HQ</h3><span>This is a web app developed on the backend by me, and used by realtors on the East Coast to buy and sell fix and flip properties. The process of creating the site involved understanding stakeholder requirements, testing several real estate listing platforms in wordpress, customizing the look and feel of the site, building custom RPA integrations with several CRM platforms to continuously populate the listings and building robust documentation and test suites for continued client management of the site.</span></Col>
                </Row>
                <Row >
                    <Col xs={12} md={4} className="d-flex justify-content-center align-items-center mb-3 mb-md-0"><Image src="images/wcp.png" fluid></Image></Col>
                    <Col xs={12} md={8}><h3>FISH.tech</h3><span>I worked as a backend Developer for FISH, a tool for purchasing and managing fix and flip, rental and property development loans. I oversaw the creation of the datatypes used for storing application information, as well as developed the property analyzer api microservice used by the property analyzer tool in the application.</span></Col>
                </Row>
            </Container>
        </Tab>
        <Tab eventKey="api" title="API Development">
            <Container>
                <Row >
                    <Col xs={12} md={4} className="d-flex justify-content-center align-items-center mb-3 mb-md-0"><Image src="/images/reminereversegeocodingapi.png" fluid></Image></Col>
                    <Col xs={12} md={8}><h3>Property Analyzer API</h3><span>Here, I built the specification and lead the development an API that accepted a residential street address and a radius or a set of Lat and Longitudes defining a polygon. With those values, it built a grid of points within the provided radius or polygon and preformed reverse geocoding on each of those points. Once the reverse geocoding completed, We were able to look up public record information and about each of those addresses, and build a list of houses that are comparable to the provided residential address.</span></Col>
                </Row>
            </Container>
        </Tab>
        <Tab eventKey="it" title="IT">
            <Container>
                <Row >
                    <Col md={4} className="d-flex justify-content-center align-items-center mb-3 mb-md-0"><Image src="images/AVGtoBitdefender.png" fluid></Image></Col>
                    <Col md={8}><h3>All Covered AVG to Bitdefender managed antivirus migration</h3><span>At Allcovered I was the SME in deploying and maintaining Kaseya Antivirus (managed AVG) and Kaseya Endpoint Security (managed Malwarebytes). Due to the changing nature of IT security at the time, we decided to upgrade our Antivirus Solution for managed endpoints. In this project, I vetted several cloud managed antivirus solutions against our varied criteria as a national MSP. Once we had settled on the best fit, I designed and wrote the scripts to uninstall AVG or other competitive antivirus solutions, Install Bitdefender, and register the endpoint within our management platform. I wrote documentation for managing endpoints in our new platform, led training sessions with over 800 engineers to familiarize them in the new system, and deployed the cut-over script on over 124,000 endpoints.</span></Col>
                </Row>
            </Container>
        </Tab>
        </Tabs>
    </Container>
  );
}

export default Projects;