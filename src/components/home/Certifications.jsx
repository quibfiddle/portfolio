
import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import './certifications.css'

function Certifications(){
    
    return (
        <Container>
            <Row>
                <Col className="d-flex justify-content-center align-items-center">
                    <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="images/airwatch.png" />
                    <Card.Body>
                        {/* <Card.Title>Card Title</Card.Title> */}
                        <Card.Text>
                        VMWare Airwatch Expert Accreditation: Enterprise Mobility (2016)
                        </Card.Text>
                    </Card.Body>
                    </Card>
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="images/mta.png" />
                    <Card.Body>
                        {/* <Card.Title>Card Title</Card.Title> */}
                        <Card.Text>
                        MCP, Microsoft Technology Associate: Windows Operating System (2014)
                        </Card.Text>
                    </Card.Body>
                    </Card>
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                    <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="images/UiPath_2019.png" />
                    <Card.Body>
                        {/* <Card.Title>Card Title</Card.Title> */}
                        <Card.Text>
                        UiPath Developer Advanced Certification (2019)
                        </Card.Text>
                    </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Certifications