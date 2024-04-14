import React from 'react'
import { Button, Container, Modal, Form, Stack } from 'react-bootstrap';
import {useState} from 'react';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './AccountStyle.css'

// import { useLocation } from 'react-router-dom';


function Account() {
    // const location = useLocation();
    // const searchTerm = location.state.searchTerm;
    const numberOfReviews = 5;


    const renderReviews = () => {
      return [...Array(numberOfReviews)].map((_, index) => (
          <Container key={index-1} id="reviewBoxes" className="my-3 p-3 border" style={{backgroundColor: 'blue', color: 'white'}}>   
          <h1>Reviews</h1>
          <p>Fill in Podcast reviews... from our database</p>
        </Container>
      ));
  };

  return (
    <>
      <Row>
        <Col sm={3} className="d-flex justify-content-center" style={{borderColor: 'black' ,borderRight: '2px solid black' }}>
          <Stack gap={5} className ="text-center">
            <h1>Hello, user</h1>
            <h6> email</h6>
            <h6> username</h6>
            <Button className = "d-inline-block align-self-center" variant="primary">Update Account Settings</Button>
          </Stack>
        </Col>


          <Col className="border-right">
            {renderReviews()}
          </Col> 
      </Row>
    </>
  )
}

export default Account
