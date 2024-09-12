import React from 'react';
import "./header.css";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { useTabContext } from '../home/TabContext'; // Import the custom hook


const Header = () => {
    const { setActiveTab } = useTabContext(); // Access context

    return (
        <Navbar bg="dark" variant="dark" fixed="top" className="w-100">
        <Container fluid>
            <Navbar.Brand color='white' href="#home">Stuart Bingham</Navbar.Brand>
                <Nav className='ms-auto'>
                    <Nav.Link href="#about">About Me</Nav.Link>
                    <NavDropdown title="Projects">
                        <NavDropdown.Item href="#Projectsdivider" onClick={() => setActiveTab('rpa')}> RPA </NavDropdown.Item>
                        <NavDropdown.Item href="#Projectsdivider" onClick={() => setActiveTab('webdev')}>Web Development</NavDropdown.Item>
                        <NavDropdown.Item href="#Projectsdivider" onClick={() => setActiveTab('it')}> IT</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="#Experiencedivider">Experience</Nav.Link>
                    <Nav.Link href="#Certificationsdivider">Certifications</Nav.Link>
                    <Nav.Link href="#contact">Contact</Nav.Link>
                </Nav>
        </Container>
        </Navbar>
    )
}

export default Header