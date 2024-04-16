import React from 'react'
import { Button, Container, Modal, Form, Stack } from 'react-bootstrap';
import {useState, useEffect} from 'react';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './AccountStyle.css'
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import Podcast from 'podcast-api'
import {FaStar} from 'react-icons/fa';

// import { useLocation } from 'react-router-dom';


function Account() {
    // const location = useLocation();
    // const searchTerm = location.state.searchTerm;
    // const { UserID } = useContext(UserContext);
    // useEffect(() => {
    //   console.log(UserID);
    // }, [UserID]);

    const UserID = localStorage.getItem('UserID');
    
    console.log('hello user: ' + UserID);
    
    
    const [username, setUsername] = useState('');
    const [userEmail, setEmail] = useState('');
    const [userReviews, setReviews] = useState([]);
    console.log('email: ' + userEmail);

    const deleteReview = (ReviewID) => {
      if (!ReviewID) {
        console.error('Error: ReviewID is undefined');
        return;
      }

      if (window.confirm('Are you sure you want to delete this review?')) {
      fetch('/podcast/deleteReview', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ReviewID }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            console.log(data.message);
            window.location.reload();
          } else {
            console.error(data.error);
          }
        })
        .catch(error => console.error('Error:', error));
      }
    };

    
    useEffect(() => {
      fetch('/podcast/userReviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserID, page: 1, limit: 10 }),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setReviews(data.userReviews);
        })
        .catch(error => console.error('Error:', error));
    }, []);

      const renderReviews = () => {
        if (!userReviews){
          // if there are no reviews
          <p1> No user reviews yet </p1>
          console.log('no reviews');
          return null;
        }
        return userReviews.map((reviewItem, index) => (
            <Container key={index} id="reviewBoxes" className="my-3 p-3 border" style={{backgroundColor: 'blue', color: 'white'}}>   
            <Row>
              <Col lg={10}>
                <h1>{reviewItem.Podcast}</h1>
                <Container id='starBox' className = "my-1 p-1 ms-auto" style={{color: 'black'}}>
                                {[...Array(reviewItem.Rating)].map((star, index) => {
                                    const currentRating = index + 1;
                                    return (
                                        <label key={index}>
                                            <input type = "radio" 
                                                name = "rating"
                                                value={currentRating}
                                            />
                                            <FaStar id = 'star' 
                                                size={10} 
                                                color = {'yellow'}
                                            /> 
                                        </label>
                                    ); 
                                })}
                                </Container>
                <p>{reviewItem.Comment}</p>
              </Col>
              <Col className="mr-3 d-flex justify-content-center flex-column">
                <Row className = "mr-3 mb-3">
                  <Button variant="secondary"style= {{maxWidth: '150px'}}>Edit Review</Button>
                </Row>
                <Row>
                  <Button variant="danger" onClick={() => 
                    {
                      console.log(reviewItem._id);
                      deleteReview(reviewItem._id);
                      }} style= {{maxWidth: '150px'}}>Delete Review</Button>
                </Row>
              </Col>

            </Row>
            
          </Container>
        ));

    };

   

    useEffect(() => {
      fetch('/api/getUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserID }),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data); 
          setUsername(data.user.Username)
          setEmail(data.user.Email)
        })
        .catch(error => console.error('Error:', error));
    }, []);


  return (
    <>
      <Row>
        <Col sm={3} className="d-flex justify-content-center" style={{borderColor: 'black' ,borderRight: '2px solid black' }}>
          <Stack gap={5} className ="text-center">
            <h1>Hello, {username}</h1>
            <h6> Email: {userEmail} </h6>
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
