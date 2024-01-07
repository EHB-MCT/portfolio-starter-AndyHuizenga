import React from 'react';
import { Container, Card, Col, Row } from 'react-bootstrap';
import './Welcome.css';
import { Link } from 'react-router-dom';

const Welcome = () => (
  <Container>
    <h2 className="mt-4 text-center">Welcome to OSC ART</h2>
    <p className="lead text-center">
      Dive into the world of art with OSC ART! Follow the steps below to unleash your creativity.
    </p>

    {/* Requirements Card */}
    <Col md={6} className="mx-auto my-4">
      <Card className="requirements-card">
        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
          <h5>Requirements</h5>
          <p className="text-muted text-center">Ensure you have a phone and a laptop connected to the same internet.</p>
        </Card.Body>
      </Card>
    </Col>

    {/* Steps Cards */}
    <Row className="mb-2 mt-4">
      {[...Array(6).keys()].map((stepNumber) => (
        <Col key={stepNumber} md={4}>
          <Card className="step-card mb-4">
            <Card.Body>
              <h5>Step {stepNumber + 1}</h5>
              <StepContent stepNumber={stepNumber} />
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>

    <div className="text-center mt-4">
      <Link to="/login" className="btn btn-purple">
       Get started
      </Link>
    </div>
  </Container>

  
);

const StepContent = ({ stepNumber }) => {
  const smallTextStyle = { fontSize: '0.8rem' };

  switch (stepNumber) {
    case 0:
      return (
        <p style={smallTextStyle} className="text-muted">Navigate to the README file of the project. Check if everything is running correctly</p>
      );
    case 1:
      return (
        <p style={smallTextStyle} className="text-muted">Navigate to the login page and create an account to begin your artistic journey.</p>
      );
    case 2:
      return (
        <p style={smallTextStyle} className="text-muted">Enhance our functionality by adding your phone to the phone catalog.</p>
      );
    case 3:
      return (
        <p style={smallTextStyle} className="text-muted">Download Unipad for iPhone and OSC Data for Android.</p>
      );
    case 4:
      return (
        <p style={smallTextStyle} className="text-muted">New unipad OSC data stream with the required information (Host: see PC settings, Port: 6001, Protocol: OSC).</p>
      );
    case 5:
      return (
        <p style={smallTextStyle} className="text-muted">Commence your artistic journey by starting the art creation process!</p>
      );
    default:
      return null;
  }


};

export default Welcome;
