import React from 'react';
import {useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import {FaStar} from 'react-icons/fa';
import { Button, Container, Modal, Form } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
    const numberOfReviews = 8;

    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem('UserID');
    console.log('UserID: ', userId);
    const username = localStorage.getItem('Username');
    console.log('Username: ', username);

    const handleInputChange = (event) => {
        setReview(event.target.value);
      };
    
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
        setError(null);

        window.location.reload();
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(error.message || "An error occurred while fetching reviews");
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
          setError(null);
        } catch (error) {
          console.error("Error fetching reviews:", error);
          setError(error.message || "An error occurred while fetching reviews");
        }
      };
    
      useEffect(() => {
        fetchReviews();
      }, []); // Re-fetch reviews if reviewData changes

    const renderReviews = () => {
        //console.log(reviews)
        return(
        <Row>
                {reviews ? reviews.map((reviews, index) => (
                <Container key={index-1} id="reviewBoxes" className="my-3 p-3 border" style={{backgroundColor: 'blue', color: 'white', textAlign: 'center'}}> 
                        <h5>{reviews.Username}</h5>
                        <p>{reviews.Comment}</p>

                        <Container id='starBox' className = "my-1 p-1 ms-auto" style={{color: 'black'}}>
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
                                            size={30} 
                                            color = {index<currentRating ? 'yellow' : 'grey' }
                                        /> 
                                    </label>
                                ); 
                            })}
                            </Container>

                </Container>

                )) : null}
        </Row>
        );
    };

    return (

        <>
        
            <Container className="my-3 p-3 border" style={{backgroundColor: 'blue', color: 'white'}}>
                <Row>
                    <Col sm={4}>
                        <Image src= {reviewData.image} thumbnail />
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                            <h1>{reviewData.title}</h1>
                            </Col>
                            <Col sm={3} className ='ml-auto'>
                              <Button variant="primary" onClick={handleShow}>Add Review</Button>
                            </Col>
                        </Row>
                        <Row>
                            <p>{reviewData.description}</p>
                        </Row>
                    </Col>
                </Row>
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
            
            
            <Button variant="primary" onClick={() => PostReview({Podcast:reviewData.title, Rating: rating, Comment: review, Username: username, UserID: userId} )}>
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