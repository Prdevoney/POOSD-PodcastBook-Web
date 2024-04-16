import React from 'react';
import {useState } from 'react';
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
    // const { UserID } = location.state || {};

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [show, setShow] = useState(false);
    const [review, setReview] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const numberOfReviews = 8;

    const handleInputChange = (event) => {
        setReview(event.target.value);
      };
    
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
        
            <Container className="my-3 p-3 border" style={{backgroundColor: 'blue', color: 'white'}}>
                <Row>
                    <Col sm={4}>
                        <Image src="holder.js/171x180" thumbnail />
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                            <h1>{reviewData.title}</h1>
                            <p>{reviewData.description}</p>
                            </Col>
                            <Col sm={3} className ='ml-auto'>
                              <Button variant="primary" onClick={handleShow}>Add Review</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Container id='starBox' className = "my-1 p-1 ms-auto" style={{color: 'black'}}>
                            {[...Array(5)].map((star, index) => {
                                const currentRating = index + 1;
                                return (
                                    <label key={index}>
                                        <input type = "radio" 
                                            name = "rating"
                                            value={currentRating}
                                        />
                                        <FaStar id = 'star' 
                                            size={30} 
                                            color = {'yellow'}
                                        /> 
                                    </label>
                                ); 
                            })}
                            </Container>
                        </Row>
                        <Row>
                            <p>Fill in Podcast description...</p>
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
            <Button variant="primary" onClick={handleClose}>
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
