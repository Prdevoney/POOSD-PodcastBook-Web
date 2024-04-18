import React from 'react'
import { Button, Container, Stack, Form, ListGroup, Card} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './FriendsStyle.css'
import {FaStar} from 'react-icons/fa';
// import Icon from '@mdi/react';
// import { mdiAccount } from '@mdi/js';

function MyFriends() {
    const UserID = localStorage.getItem('UserID');
    console.log('hello user: ' + UserID);

    // sets the username of the current user account
    const [username, setUsername] = useState('');
    // const [userReviews, setReviews] = useState([]);

    // const [rating, setRating] = useState(null);

    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    const [friendReviews, setFriendReviews] = useState([]);

    const [currentFollower, setCurrentFollower] = useState([]);
    const [currentFollowing, setCurrentFollowing] = useState([]);

    const [searchedFriendUsername, setSearchedFriendUsername] = useState('');
    const [searchedFriendID, setSearchedFriendID] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const handleSearchChange = (e) => {
      setSearchedFriendUsername(e.target.value);
    };

    useEffect(() => {
      fetch('/podcast/feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserID, page: 1, limit: 1000 }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Friend reviews data');
          console.log(data);
          setFriendReviews(data);
        })
        .catch(error => console.error('Error:', error));
    }, [UserID]);

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
          setFollowers(data.user.Followers)
          console.log('following: ');
          console.log(data.user.Following);
          setFollowing(data.user.Following)
        })
        .catch(error => console.error('Error:', error));
    }, [UserID]);



      // Following _______________________________________________________>
      const listofFollowing = () => {
        return currentFollowing.map((following, index) => (
          <ListGroup.Item key={index}>{following}</ListGroup.Item>


        ));
      };

      useEffect(() => {
        console.log('hopefully this a userid: ');
        console.log(following);
        const fetchFollowing = async () => {
          const followingData = await Promise.all(
            following.map(async (following) => {
              const response = await fetch('/api/getUserInfo', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserID: following }),
              });

              const data = await response.json();
              console.log('following data check: ');
              console.log(data);
              return data.user.Username;
            })
          );

          setCurrentFollowing(followingData);
        };

        fetchFollowing();
      }, [following]);
      // Following _______________________________________________________>

      // Follower List ---------------------------------------------------->
      useEffect(() => {
        console.log('hopefully this a followers now: ');
        console.log(followers);
        const fetchFollowers = async () => {
          const followerData = await Promise.all(
            followers.map(async (follower) => {
              const response = await fetch('/api/getUserInfo', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserID: follower }),
              });

              const data = await response.json();
              return data.user.Username;
            })
          );

          setCurrentFollower(followerData);
        };

        fetchFollowers();
      }, [followers]);


      const listofFollowers = () => {
        return currentFollower.map((follower, index) => (
          <ListGroup.Item key={index}>{follower}</ListGroup.Item>
        ));
      };
      // End of Follower List ---------------------------------------------------->

      const fetchFriendID = async (usage) => {
        console.log('searched friend: ' + searchedFriendID);
        fetch('/api/SearchUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ MyUser: username, Username: searchedFriendUsername}),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Friend ID Data')
            console.log(data);
            if (usage === 1){
              if (data.length === 0){
                console.log('User not found');
                setErrorMessage('User not found!');
                return;
              }
              // For getting id of the person you want reviews
              const friendID = data[0]._id;
              setSearchedFriendID(data[0]._id);
              if (searchedFriendUsername === data[0].Username){
                setErrorMessage('');
                fetchFriendReviews(friendID);
              } else {
                console.log('User not found');
                setErrorMessage('User not found!');
              }
            } else if (usage === 2){
              if (data.length === 0){
                console.log('User not found');
                setFriendingMessage('User not found!');
                return;
              }
              // For gettiing the id of the user you want to follow
              const friendID = data[0]._id;
              setSearchedFriendID(data[0]._id);
              if (searchedFriendUsername === data[0].Username){
                setFriendingMessage('');
                fetchToggleFriend(friendID);
              } else {
                console.log('User not found');
                setFriendingMessage('User not found!');
              }
            }
            
          })
          .catch(error => console.error('Error:', error));
      };

      const fetchFriendReviews = async (friendID) => {
        console.log('searched friendID: ');
        console.log(searchedFriendID);
          fetch('/podcast/userReviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ UserID: friendID, page: 1, limit: 10 }),
          })
            .then(response => response.json())
            .then(data => {
              console.log('FetchReview Data')
              console.log(data);
              setFriendReviews(data.userReviews);
            })
            .catch(error => console.error('Error:', error));
      };

      // const handleFollowSearchChange = (e) => {
      //   setToggleFriendUsername(e.target.value);
      // };

      // const [toggleFriendUsername, setToggleFriendUsername] = useState('');
      const [friendingMessage, setFriendingMessage] = useState('');

      const fetchToggleFriend = async (friendID) => {
        try {
          const response = await fetch('/api/followUnfollowToggle', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              UserID,
              targetUserID: friendID,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error);
          }

          console.log(data.message);
          window.location.reload();
          // setFriendingMessage(data.message)
        } catch (error) {
          setFriendingMessage(error.message);
          console.error('Error:', error);
        }
      };
  



      // start of render reviews ===============================================>
      const renderReviews = () => {
        if (!friendReviews){
          // if there are no reviews
          <p1> No friend reviews yet </p1>
          console.log('no reviews');
          return null;
        }
        return (
        <Row className= "mt-4">
          {friendReviews.map((reviewItem, index) => {
          return (
            // <Container key={index} id="reviewBoxes" className="my-3 p-3 border" style={{backgroundColor: 'white', color: 'black'}}>   
              <Col xs={12} sm={6} md={6} lg={6}   key={index} className="mb-3 d-flex justify-content-center">
                <Card key={index} style={{ border: '1px solid black',width: '100rem' }}className="p-3 mb-3 d-flex flex-column">
                {/* <Image> */}
                  {/* <Icon path={mdiAccount} size={3} color="black" /> */}
                {/* </Image> */}
                <h2>{reviewItem.Username}</h2>
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
                                                size={15} 
                                                color = {'#FFD700'}
                                            /> 
                                        </label>
                                    ); 
                                })}
                                </Container>
                <p>{reviewItem.Comment}</p>
                </Card>
              </Col>
            );
          })}
        </Row>
        );
    };
    // end of renderReviews ===============================================>

  


  return (
    // <Container>
      <Row classNamme ="justify-content-center align-items-center">
        <Col sm={3} className="d-flex justify-content-center" style={{borderColor: 'black' ,borderRight: '2px solid black' }}>
          <Stack gap={3} style={{marginLeft: '1rem'}}className ="text-center">
            <h1 style={{color: 'white'}}>Hello, {username} these are your friends!</h1>
            <div>
            <p style={{marginBottom: '50',color: 'black'}}>Search for a friend by username:</p>
            <Form className="d-flex justify-content-center align-items-center" onSubmit={(e) => e.preventDefault()} >
                <Form.Control
                  type="search"
                  placeholder="Enter a username"
                  className="me-2 justify-content-center align-items-center"
                  aria-label="Search"
                  onChange={handleSearchChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      fetchFriendID(2);
                    }
                  }}
                />
                <Button variant="outline-light" onClick={() => fetchFriendID(2)}>Enter</Button>
              </Form>
              {friendingMessage && <p style={{fontWeight: 'bold' ,color: '#8B0000'}}>{friendingMessage}</p>}
              </div>
            <ListGroup style={{marginLeft: '2rem',width : '10rem' }}className ="justify-content-center ">
              <ListGroup.Item variant="primary">Following: {following.length}</ListGroup.Item>
              {listofFollowing()}
              <ListGroup.Item variant="primary">Followers: {followers.length}</ListGroup.Item>
              {listofFollowers()}
            </ListGroup>
          </Stack>
        </Col>


          <Col sm={8} className="justify-content-center align-items-center border-right">
            <Row>
              <h1 style={{color: 'white'}}> Your Friend Reviews</h1>
            </Row>
            <Row>
              <Form className="d-flex my-4" onSubmit={(e) => e.preventDefault()} >
                <Form.Control
                  type="search"
                  placeholder="Search for a user's reviews by username"
                  className="me-2"
                  aria-label="Search"
                  onChange={handleSearchChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      fetchFriendID(1);
                    }
                  }}
                />
                <Button variant="outline-light" onClick={() => fetchFriendID(1)}>Search</Button>
              </Form>
            </Row>
            <Row>
              <Col className="col-auto">
                   {errorMessage && <p style={{fontWeight: 'bold', color: '#8B0000'}}>{errorMessage}</p>}
                  <Button variant="secondary" onClick={() => window.location.reload()}>Reset all friends' reviews</Button>
              </Col>
            </Row>
            <Row>
                {renderReviews()}
                
            </Row>
          </Col> 
      </Row>
      
    // </Container>
  )
}

export default MyFriends;
