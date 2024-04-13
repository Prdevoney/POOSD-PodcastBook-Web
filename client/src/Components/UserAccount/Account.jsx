import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Stack } from 'react-bootstrap';
import './AccountStyle.css';

function Account() {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const token = localStorage.getItem('user1'); // Assuming token is stored in localStorage
                console.log('Token:', token); // Check if the token value is correct
                const response = await fetch('/api/getUserInfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Include the token in the headers
                    },
                    body: JSON.stringify({ UserID: 'user' }), // Replace 'your_user_id_here' with the actual user ID
                });

                const data = await response.json();
                if (response.ok) {
                    setUserInfo(data.user);
                } else {
                    throw new Error(data.error || 'Failed to fetch user info');
                }
            } catch (error) {
                console.error('Error fetching user info:', error.message);
            }
        };

        getUserInfo();
    }, []);

    const numberOfReviews = 5;

    const renderReviews = () => {
        return [...Array(numberOfReviews)].map((_, index) => (
            <Container key={index-1} id="reviewBoxes" className="my-3 p-3 border" style={{ backgroundColor: 'blue', color: 'white' }}>
                <h1>Reviews</h1>
                <p>Fill in Podcast reviews... from our database</p>
            </Container>
        ));
    };

    return (
        <>
            <Row>
                <Col sm={3} className="d-flex justify-content-center" style={{ borderColor: 'black', borderRight: '2px solid black' }}>
                    <Stack gap={5} className="text-center">
                        <h1>Hello, {userInfo ? userInfo.name : 'username'}</h1>
                        <h6>{userInfo ? userInfo.email : 'email'}</h6>
                        <h6>{userInfo ? userInfo.username : 'username'}</h6>
                        <Button className="d-inline-block align-self-center" variant="primary">Update Account Settings</Button>
                    </Stack>
                </Col>


                <Col className="border-right">
                    {renderReviews()}
                </Col>
            </Row>
        </>
    );
}

export default Account;
