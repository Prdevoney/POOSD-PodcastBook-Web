import React from 'react'
import { Button, Container, Modal, Form, Stack, Card } from 'react-bootstrap';
import {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './AccountStyle.css'
import {FaStar} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



// import { useLocation } from 'react-router-dom';


function Account() {
    // const location = useLocation();
    // const searchTerm = location.state.searchTerm;
    // const { UserID } = useContext(UserContext);
    // useEffect(() => {
    //   console.log(UserID);
    // }, [UserID]);

    const navigate = useNavigate();

    const UserID = localStorage.getItem('UserID');
    
    // console.log('hello user: ' + UserID);
    
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const handleShowChangePasswordModal = () => setShowChangePasswordModal(true);
    const handleCloseChangePasswordModal = () => setShowChangePasswordModal(false);

    const [enterCurrentPasswordModal, setEnterCurrentPasswordModal] = useState(false);

    const handleShowEnterCurrentPasswordModal = () => setEnterCurrentPasswordModal(true);
    const handleCloseEnterCurrentPasswordModal = () => setEnterCurrentPasswordModal(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [username, setUsername] = useState('');
    const [userEmail, setEmail] = useState('');
    const [userReviews, setReviews] = useState([]);
    // console.log('email: ' + userEmail);

    const [popupData, setPopupData] = useState({podcastID: '', podcastTitle: '', rating: '', comment: ''});
    
    const handlePopup = (podcastID, podcastTitle, rating, comment) => {
      setPopupData({podcastID, podcastTitle, rating, comment});
      setNewReview(comment);
      console.log("===== =====> ");
      console.log("===== =====> ");
      console.log("===== this is rating =====> " + rating);
      console.log("===== this is rating =====> " + popupData.rating);
      setShow(true);
    };

    // useEffect(() => {
    //   console.log(popupData.rating);
    // }, [popupData.rating]);
    // I want to to also set rating to null when the modal closes
    const handleEditClose = () => 
    {
      setShow(false);
      setRating(null);
    };

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [show, setShow] = useState(false);
    const [newReview, setNewReview] = useState('');

    const handleInputChange = (event) => {
      setNewReview(event.target.value);
    };


    const handleLogout = () => {
      // Remove the user's token from local storage (or state)
      localStorage.removeItem('token');

      // Redirect the user to the login page
      navigate('/');
    };


    const updateReview = (newRating) => {
      fetch('/podcast/editReview', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ReviewID: popupData.podcastID,
          Rating: newRating,
          Comment: newReview,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            console.log(data.message);
            window.location.reload(); // Handle successful update
            // Handle successful update
          } else {
            console.error(data.error);
          }
        })
        .catch(error => console.error('Error:', error));
    };


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
    }, );

      const renderReviews = () => {
        if (!userReviews){
          // if there are no reviews
          <p1> No user reviews yet </p1>
          console.log('no reviews');
          return null;
        }
        return (
        <Row>
          {userReviews.map((reviewItem, index) => {
            return (
              // xs={12} md={12} lg={6} xxl={4}
            <Col xs={12} sm={6} md={6} lg={6}   key={index} className="mb-3 d-flex justify-content-center">
              <Card key={index} style={{ width: '100rem' }} className="p-3 mb-3 d-flex flex-column">
                {/* <Image src={podcast.image} alt="podcast thumbnail" className="img-thumbnail mb-3"/> */}
                <h5>{reviewItem.Podcast}</h5>
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
                                                  size={20} 
                                                  color = {'#FFD700'}
                                              /> 
                                          </label>
                                      ); 
                                  })}
                </Container>
                <p>{reviewItem.Comment}</p>
                <Row>
                  <Col xs={6} md={6} lg={6} xxl={6}  >
                <Button variant="info" className="w-100" onClick={() => 
                    handlePopup(reviewItem._id, reviewItem.Podcast, reviewItem.Rating, reviewItem.Comment)
                    } style= {{color: 'white'}}>Edit</Button>
                    </Col>
                    <Col xs={6} md={6} lg={6} xxl={6} >
                <Button variant="danger" className="w-100" onClick={() => 
                      {
                        console.log(reviewItem._id);
                        deleteReview(reviewItem._id);
                        }} style= {{color: 'white'}}>Delete</Button>
                    </Col>
                </Row>
                {/* <p dangerouslySetInnerHTML={{ __html: reviewItem.comment.length > 150 ? podcast.description_highlighted.substring(0, 150) + '...' : podcast.description_highlighted }}></p> */}
                {/* <Button variant="outline-primary" className="mt-auto" onClick={() => getEpisode(podcast.id)}>Listen to Latest Episode</Button> */}
                {/* <Button className="mt-2" variant="primary" onClick={() => handleReview(podcast)}>Review Podcast</Button> */}
              </Card>
            </Col>
            );
          })}
       </Row>
       );
         
    };

// ================== end of reviews ==================


    const changePassword = () => {
      // Check if new password and confirm password are the same
      if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match');
        return;
      }

      fetch('/api/updatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: UserID,  // Replace with the actual user ID
          Password: newPassword,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            console.log(data.message);
            handleCloseChangePasswordModal();
            alert('Password updated successfully');
            // Handle successful update
          } else {
            alert(data.error);
            console.error(data.error);
          }
        })
        .catch(error => console.error('Error:', error));
    };

    
    const continueChangePassword = async () => {
        try {
          // Send login data to backend
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "Username": username,
              "Password": currentPassword
            })
          });
    
          const data = await response.json();
  
          if (response.ok) {
            console.log(data); // Handle response from the server as needed
            handleCloseEnterCurrentPasswordModal();
            handleShowChangePasswordModal();
          } else {
            throw new Error(data.error || "Login failed");
          }
        } catch (error) {
          console.error("Error during login:", error.message);
          // Handle error
          alert("Login failed: " + error.message);
        }
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
    }, );


  return (
    <Container>
      <Row>
        <Col sm={3} className="mt-4 d-flex justify-content-center" style={{borderColor: 'black' ,borderRight: '2px solid black' }}>
          <Stack gap={5} className ="text-center">
            <h1 style={{color: 'white'}}>Hello, {username}</h1>
            <h6> Email: {userEmail} </h6>
            <Button className = "d-inline-block align-self-center" onClick={handleShowEnterCurrentPasswordModal} variant="primary">Change Password</Button>
            <Button className = "d-inline-block align-self-center" onClick={handleLogout} variant="secondary">Logout</Button>
          </Stack>

          <Modal show = {enterCurrentPasswordModal} onHide = {handleCloseEnterCurrentPasswordModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Enter Current Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className = 'needs-validation'>
                <Form.Group controlId="formBasicPassword" className = 'form-group was-validated mb-2'>
                  <Form.Label>Current Password:</Form.Label>
                  <Form.Control type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                  <div className = "invalid-feedback">Please confirm your password</div>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEnterCurrentPasswordModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={()=> continueChangePassword()}>
                Enter
              </Button>
            </Modal.Footer>
          </Modal>


          <Modal show={showChangePasswordModal} onHide={handleCloseChangePasswordModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className = 'needs-validation'>
                <Form.Group controlId="formNewPassword" className = 'form-group was-validated mb-2'>
                  <Form.Label>New Password:</Form.Label>
                  <Form.Control type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                  <div className = "invalid-feedback">Please confirm your password</div>
                </Form.Group>
                <Form.Group controlId="formConfirmPassword" className = 'form-group was-validated mb-2'>
                  <Form.Label>Confirm New Password:</Form.Label>
                  <Form.Control type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required/>
                  <div className = "invalid-feedback">Please confirm your password</div>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseChangePasswordModal}> Cancel </Button>
              <Button variant="primary" onClick={()=> changePassword()}> Reset Password </Button>
            </Modal.Footer>
          </Modal>
        </Col>
        

        <Col sm={9} className="mt-4 d justify-content-center">
          {renderReviews()}
              
          <Modal show={show} onHide={handleEditClose} centered>
            <Modal.Header closeButton>
            <Modal.Title>Edit Review for {popupData.podcastTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  <h6>Rating: {popupData.rating}</h6>
                </Col>
                <Col sm='true'>
                  <Container id='starBox' className = "my-2 p-2" style={{backgroundColor: 'white', color: 'black'}}>
                    {[...Array(5)].map((star, index) => {
                      const currentRating = index + 1;
                      return (
                        <label key = {index}>
                          <input type = "radio" 
                              name = "rating"
                              value={popupData.rating}
                              onChange={() => setRating(currentRating)}
                              // checked = {popupData.rating}
                          />

                          <FaStar id ='star' 
                              size={50} 
                              
                              // color={currentRating <= popupData.rating ? "#FFD700" : "#e4e5e9"} 
                              // color={currentRating <= (hover || rating) ? "#FFD700" : "#e4e5e9"} 
                              color={currentRating <= (hover || rating || popupData.rating) ? "#FFD700" : "#e4e5e9"}
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
                    <Form.Control as="textarea" rows={3} value={newReview} onChange={handleInputChange} />
                  </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleEditClose}> Cancel </Button>
              <Button variant="primary" onClick={()=> updateReview(rating)}> Post Review</Button>
            </Modal.Footer>
          </Modal>
        </Col> 
      </Row>
    </Container>
  )
}

export default Account