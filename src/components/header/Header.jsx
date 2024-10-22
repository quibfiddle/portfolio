import React from 'react';
import "./header.css";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { useTabContext } from '../home/TabContext'; // Import the custom hook
import { useState } from 'react';

const Header = () => {
    const { setActiveTab } = useTabContext(); // Access context
    const [expanded, setExpanded] = useState(false); // Track the navbar state

    return (
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="w-100">
        <Container fluid>
            <Navbar.Brand href="#home">Stuart Bingham</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
                <Nav.Link href="#about" onClick={() => {setExpanded(false)}}>About Me</Nav.Link>
                <NavDropdown title="Projects" id="basic-nav-dropdown">
                <NavDropdown.Item href="#Projectsdivider" onClick={() => { setActiveTab('rpa'); setExpanded(false); }}>RPA</NavDropdown.Item>
                <NavDropdown.Item href="#Projectsdivider" onClick={() => { setActiveTab('webdev'); setExpanded(false); }}>Web Development</NavDropdown.Item>
                <NavDropdown.Item href="#Projectsdivider" onClick={() => { setActiveTab('api'); setExpanded(false); }}>API Development</NavDropdown.Item>
                <NavDropdown.Item href="#Projectsdivider" onClick={() => { setActiveTab('it'); setExpanded(false); }}>IT</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="#Experiencedivider" onClick={() => setExpanded(false)}>Experience</Nav.Link>
                <Nav.Link href="#Certificationsdivider" onClick={() => setExpanded(false)}>Certifications</Nav.Link>
                <Nav.Link href="#contact" onClick={() => setExpanded(false)}>Contact</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>

    )
}

export default Header