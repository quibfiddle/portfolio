import React from 'react';
import Container from 'react-bootstrap/Container';
import './masthead.css'

function Masthead() {
  return (
    <div className="bg-dark text-light text-center py-5 masthead" id="top">
      <Container>
        <h1>Hello!</h1>
        <h2>I'm a technologist with a knack for analyzing workflows and designing automation to make things simpler.</h2>
      </Container>
    </div>
  );
}

export default Masthead;