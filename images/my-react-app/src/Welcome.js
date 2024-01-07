// Welcome.js
import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const Welcome = () => (
  <Container>
    <h2 className="mt-4">Welcome to OSC ART</h2>
    <p>
      Explore the world of art with OSC ART! Follow the steps below to get started:
    </p>

    <Row>
      {[...Array(7).keys()].map((stepNumber) => (
        <Col key={stepNumber} md={6} className="mb-2 mt-4">
          <Card style={{ minHeight: '100px' }}>
            <Card.Body>
              <h5>Step {stepNumber + 1}</h5>
              <StepContent stepNumber={stepNumber} />
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

const StepContent = ({ stepNumber }) => {
  const smallTextStyle = { fontSize: '0.8rem' };

  switch (stepNumber) {
    case 0:
      return (
        <p style={smallTextStyle}>You will need a phone and a laptop connected to the same internet.</p>
      );
    case 1:
      return (
        <p style={smallTextStyle}>Navigate to the READ.ME file of the project.</p>
      );
    case 2:
      return (
        <p style={smallTextStyle}>Create an account.</p>
      );
    case 3:
      return (
        <p style={smallTextStyle}>To further improve our function, please add your phone to the phone catalog.</p>
      );
    case 4:
      return (
        <p style={smallTextStyle}>Download Unipad for iPhone and OSC Data for Android.</p>
      );
    case 5:
      return (
        <p style={smallTextStyle}>Open Unipad and create a new OSC data stream with required information (Host: see settings PC, Port: 6001, Protocol: OSC).</p>
      );
    case 6:
      return (
        <p style={smallTextStyle}>Start the art creation!</p>
      );
    default:
      return null;
  }
};

export default Welcome;
