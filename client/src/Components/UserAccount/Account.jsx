import React from 'react'
import { Button, Container, Stack } from 'react-bootstrap';
// import {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './AccountStyle.css'

// import { useLocation } from 'react-router-dom';


function Account() {
    // const location = useLocation();
    // const searchTerm = location.state.searchTerm;
    const numberOfReviews = 5;
    // const [username, setUsername] = useState('');

    const renderReviews = () => {
      return [...Array(numberOfReviews)].map((_, index) => (
          <Container key={index-1} id="reviewBoxes" className="my-3 p-3 border" style={{backgroundColor: 'blue', color: 'white'}}>   
          <h1>Reviews</h1>
          <p>Fill in Podcast reviews... from our database</p>
        </Container>
      ));

    };

    // function getCurrentUserID() {
    //   return localStorage.getItem('UserID'); // or Cookies.get('UserID') if you're using cookies
    // }

    // useEffect(() => {
    //   const UserID = 'bob'; // Replace this with the actual UserID

    //   fetch('/api/getUserInfo', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ UserID }),
    //   })
    //     .then(response => response.json())
    //     .then(data => setUsername(data.user.username))
    //     .catch(error => console.error('Error:', error));
    // }, []);

  return (
    <>
      <Row>
        <Col sm={3} className="d-flex justify-content-center" style={{borderColor: 'black' ,borderRight: '2px solid black' }}>
          <Stack gap={5} className ="text-center">
            {/* <h1>Hello, {username}</h1> */}
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
