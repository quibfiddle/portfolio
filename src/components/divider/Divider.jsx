import React from 'react';
import './divider.css'; // Import custom CSS for styling
import Container from 'react-bootstrap/Container'

function Divider({ text }) {
  return (
    <Container>
    <div className="text-display-container" id={text.replace(" ","")+"divider"}>
      <hr className="text-display-line" />
      <span className="text-display-text">{text}</span>
      <hr className="text-display-line" />
    </div>
    </Container>
  );
}

export default Divider;