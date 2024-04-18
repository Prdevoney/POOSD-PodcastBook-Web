import React from 'react'
import { Button, Container, Stack } from 'react-bootstrap';
import {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './FriendsStyle.css'
import {FaStar} from 'react-icons/fa';

function MyFriends() {
    const UserID = localStorage.getItem('UserID');
    console.log('hello user: ' + UserID);

    const [username, setUsername] = useState('');
    const [userReviews, setReviews] = useState([]);

    const [rating, setRating] = useState(null);
    const [followers, setFollowers] = useState([]);
    
    useEffect(() => {
        fetch('/api/getFollowers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ UserID, page: 1, limit: 10 }),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            setFollowers(data.followers);
          })
          .catch(error => console.error('Error:', error));
      }, []);

    
      const renderReviews = () => {
        if (!followers){
          // if there are no reviews
          <p1> No user reviews yet </p1>
          console.log('no reviews');
          return null;
        }
        return followers.map((reviewItem, index) => (
            <Container key={index} id="reviewBoxes" className="my-3 p-3 border" style={{backgroundColor: '#41a0ff', color: 'white'}}>   
            <Row>
              <Col lg={10}>
                <h2>{reviewItem.Username}</h2>
                <h3>{reviewItem.Podcast}</h3>
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
        })
        .catch(error => console.error('Error:', error));
    }, []);


  return (
    <>
      <Row>
        <Col sm={3} className="d-flex justify-content-center" style={{borderColor: 'black' ,borderRight: '2px solid black' }}>
          <Stack gap={5} className ="text-center">
            <h1>Hello, {username}</h1>
          </Stack>
        </Col>


          <Col className="border-right">
            {renderReviews()}
          </Col> 
      </Row>
      
    </>
  )
}

export default MyFriends;
