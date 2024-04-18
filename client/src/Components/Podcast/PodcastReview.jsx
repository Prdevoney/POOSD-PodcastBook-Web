import React from 'react';
import {useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import {FaStar} from 'react-icons/fa';
import { Button, Container, Modal, Form } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import './PodcastReviewStyle.css';

function PodcastReview() {
    
    const location = useLocation();
    const { reviewData } = location.state || {};

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [show, setShow] = useState(false);
    const [review, setReview] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [reviews, setReviews] = useState([]);
    // const [error, setError] = useState(null);

    // const [userEmail, setEmail] = useState('');
    const [username, setUsername] = useState('');

    const UserID = localStorage.getItem('UserID');
    console.log('UserID: ', UserID);
    

    const handleInputChange = (event) => {
        setReview(event.target.value);
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
          console.log("User Info: " + data); 
          setUsername(data.user.Username)
          // setEmail(data.user.Email)
        })
        .catch(error => console.error('Error:', error));
    }, );


    const PostReview = async ({Podcast, Rating, Comment, Username, UserID}) => {
      try {
        const response = await fetch(`/podcast/writeReview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Podcast : Podcast,
            Rating : Rating, 
            Comment : Comment, 
            Username : Username, 
            UserID : UserID,
          }),
        });

        console.log(response);
  
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
  
        const data = await response.json();
        setReviews(data.reviews);
        // setError(null);

        window.location.reload();
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // setError(error.message || "An error occurred while fetching reviews");
      }
    }
    
    const fetchReviews = async () => {
        
        try {
          const response = await fetch(`/podcast/podcastReviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Podcast: reviewData.title, // Check if reviewData exists
              page: 1,
              limit: 100, //Large value just so all show up.
            }),
          });
    
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
    
          const data = await response.json();
          setReviews(data.reviews);
          //console.log(data.reviews);
          // setError(null);
        } catch (error) {
          console.error("Error fetching reviews:", error);
          // setError(error.message || "An error occurred while fetching reviews");
        }
      };
    
      useEffect(() => {
        fetchReviews();
      }, ); // Re-fetch reviews if reviewData changes

    const renderReviews = () => {
        //console.log(reviews)
        return(
        <Container>
            <Row className="justify-content-center">
                {reviews ? reviews.map((reviews, index) => (
                <Col key={index-1} xs={12}  lg={6} className="my-3 p-3 " > 
                  <Card className="p-2">
                    <Row>
                      <Col xs={4} className="d-flex flex-column align-items-center my-3" style={{ borderRight: '1px solid #ccc' }}>
                        <h5 className="text-center">{reviews.Username}</h5>
                        <Container id='starBox' className = "d-flex justify-content-center align-items-center my-1 p-1" style={{color: 'black'}}>
                            {[...Array(5)].map((star, index) => {
                                const currentRating = reviews.Rating;
                                //console.log(currentRating);
                                return (
                                    <label key={index}>
                                        <input type = "radio" 
                                            name = "rating"
                                            value={currentRating}
                                        />
                                        <FaStar id = 'star' 
                                            size={20} 
                                            color = {index<currentRating ? 'yellow' : 'grey' }
                                        /> 
                                    </label>
                                ); 
                            })}
                        </Container>
                      </Col>
                            <Col className="my-3">
                              <p className="text-center">{reviews.Comment}</p>
                            </Col>
                        </Row>
                  </Card>
                </Col>

                )) : null}
            </Row>
        </Container>
        );
    };

    return (

        <>
          <Container>
            <Card className="my-3 p-3 border">
                <Row>
                    <Col sm={4}>
                        <Image src= {reviewData.image} thumbnail />
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                            <h1>{reviewData.title}</h1>
                            </Col>
                        </Row>
                        <Row className="my-4">
                            <p>{reviewData.description}</p>
                        </Row>
                        <Col sm={3} className ='ml-auto'>
                          <Button variant="primary" onClick={handleShow}>Add Review</Button>
                        </Col>
                    </Col>
                </Row>
            </Card>
          </Container>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
            <Modal.Title>Add Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <h6>Rate this podcast:</h6>
                    </Col>
                    <Col sm='true'>
                        <Container id='starBox' className = "my-2 p-2" style={{backgroundColor: 'white', color: 'black'}}>
                            {[...Array(5)].map((star, index) => {
                                const currentRating = index + 1;
                                return (
                                    <label key = {index}>
                                        <input type = "radio" 
                                            name = "rating"
                                            value={currentRating}
                                            onClick={() => setRating(currentRating)}
                                        />

                                        <FaStar id ='star' 
                                            size={50} 
                                            color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"} 
                                            onMouseEnter={() => setHover(currentRating)}
                                            onMouseLeave={() => setHover(null)}
                                        /> 
                                    </label>
                                ); 
                            })}
                        </Container>
                    </Col>
                    <p> Your rating is {rating} </p>

                </Row>
            <Form>
                <Form.Group controlId="review">
                <Form.Control as="textarea" rows={3} placeholder='Input...' value={review} onChange={handleInputChange} />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            
            
            <Button variant="primary" onClick={() => PostReview({Podcast:reviewData.title, Rating: rating, Comment: review, Username: username, UserID: UserID} )}>
                Post Review
            </Button>
            </Modal.Footer>
      </Modal>

            <div>
                {renderReviews()}
            </div>
            
        </>
    );
}

export default PodcastReview;