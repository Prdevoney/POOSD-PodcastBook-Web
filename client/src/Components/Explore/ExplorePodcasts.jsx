import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './ExplorePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const username = sessionStorage.getItem('username');
console.log('Username:', username); // Output the retrieved username

const ReviewBox = ({ podcast, reviewText, rating }) => {
    return (
      <div className="review-box bg-light p-3 mb-3">
        <h5 className="card-title">Podcast: {podcast}</h5>
        <p className="card-text">{reviewText.length > 100 ? reviewText.substring(0, 100) + '...' : reviewText}</p>
        <p className="card-text">Rating: {rating}</p>
      </div>
    );
  };

const ExplorePodcasts =() =>{
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('Podcast');
  const [searchInput, setSearchInput] = useState('');
  const handleSearch = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/getReview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UserID: sessionStorage.getItem('username'),
                SearchType: searchType,
                SearchInput: searchInput
            })
        });

        if (response.ok) {
            const data = await response.json();
            setReviews(data);
            setError(null);
        } else {
            setError('Error fetching reviews');
            setReviews([]);
        }
    } catch (error) {
        console.error('Error searching reviews:', error);
        setError('Error searching reviews');
        setReviews([]);
    }
};
  useEffect(() => {
    const fetchReviews = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/feed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserID: sessionStorage.getItem('username')
                })
            });

            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                setError('Error fetching reviews');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('Error fetching reviews');
        }
    };

    fetchReviews();
  }, []);
  
  

  return (
  <Navbar expand="sm" className="navbar-container" /*bg="primary" data-bs-theme="dark"*/  >
      <Container fluid >
        <Navbar.Brand href="#">Podcast Book</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" style={{ height: '50px' }}/>
        <Navbar.Collapse id="navbarScroll" >
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link href="#action1">Explore</Nav.Link>
            <Nav.Link href="#action2">Account</Nav.Link>
          </Nav>
          <Form.Select 
            className = "me-3" 
            style={{width: '110px'}} 
            aria-label="Default select example"
            onChange={(e) => setSearchType(e.target.value)}>
            <option value="1">Podcast</option>
            <option value="2">Episode</option>
          </Form.Select>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button variant="outline-light" onClick={handleSearch}>Search</Button>
          </Form>
          <div className="review-container">
                    {error ? (
                        <div>Error: {error}</div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review) => (
                            <ReviewBox
                                key={review._id}
                                podcast={review.Podcast}
                                reviewText={review.Comment}
                                rating={review.Rating}
                            />
                        ))
                    ) : (
                        <div>No reviews found</div>
                    )}
                </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ExplorePodcasts;



// //import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import React from 'react';
// import { Navbar, Container, Nav, NavDropdown, Form, Button } from 'react-bootstrap';
// import './ExplorePage.css'
// const ExplorePodcasts = () => {
//   // For later:
//   // const [username, setUsername] = useState('');

//   // useEffect(() => {
//   //   // Replace '/api/user' with the correct endpoint to get the user's data
//   //   // Replace 'userId' with the actual user ID
//   //   fetch(`/api/user/${userId}`)
//   //     .then(response => response.json())
//   //     .then(data => setUsername(data.username))
//   //     .catch(error => console.error('Error:', error));
//   // }, []); // The empty array means this effect runs once when the component mounts

//   return (
//     <Navbar expand="lg" className="bg-body-tertiary">
//       <Container fluid>
//         <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbarScroll" />
//         <Navbar.Collapse id="navbarScroll">
//           <Nav
//             className="me-auto my-2 my-lg-0"
//             style={{ maxHeight: '100px' }}
//             navbarScroll
//           >
//             <Nav.Link href="#action1">Home</Nav.Link>
//             <Nav.Link href="#action2">Link</Nav.Link>
//             <NavDropdown title="Link" id="navbarScrollingDropdown">
//               <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
//               <NavDropdown.Item href="#action4">
//                 Another action
//               </NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item href="#action5">
//                 Something else here
//               </NavDropdown.Item>
//             </NavDropdown>
//             <Nav.Link href="#" disabled>
//               Link
//             </Nav.Link>
//           </Nav>
//           <Form className="d-flex">
//             <Form.Control
//               type="search"
//               placeholder="Search"
//               className="me-2"
//               aria-label="Search"
//             />
//             <Button variant="outline-success">Search</Button>
//           </Form>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default ExplorePodcasts;


// // import Button from 'react-bootstrap/Button';
// // import Container from 'react-bootstrap/Container';
// // import Form from 'react-bootstrap/Form';
// // import Nav from 'react-bootstrap/Nav';
// // import Navbar from 'react-bootstrap/Navbar';
// // import NavDropdown from 'react-bootstrap/NavDropdown';

// // function NavScrollExample() {
// //   return (
// //     <Navbar expand="lg" className="bg-body-tertiary">
// //       <Container fluid>
// //         <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
// //         <Navbar.Toggle aria-controls="navbarScroll" />
// //         <Navbar.Collapse id="navbarScroll">
// //           <Nav
// //             className="me-auto my-2 my-lg-0"
// //             style={{ maxHeight: '100px' }}
// //             navbarScroll
// //           >
// //             <Nav.Link href="#action1">Home</Nav.Link>
// //             <Nav.Link href="#action2">Link</Nav.Link>
// //             <NavDropdown title="Link" id="navbarScrollingDropdown">
// //               <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
// //               <NavDropdown.Item href="#action4">
// //                 Another action
// //               </NavDropdown.Item>
// //               <NavDropdown.Divider />
// //               <NavDropdown.Item href="#action5">
// //                 Something else here
// //               </NavDropdown.Item>
// //             </NavDropdown>
// //             <Nav.Link href="#" disabled>
// //               Link
// //             </Nav.Link>
// //           </Nav>
// //           <Form className="d-flex">
// //             <Form.Control
// //               type="search"
// //               placeholder="Search"
// //               className="me-2"
// //               aria-label="Search"
// //             />
// //             <Button variant="outline-success">Search</Button>
// //           </Form>
// //         </Navbar.Collapse>
// //       </Container>
// //     </Navbar>
// //   );
// // }

// // export default NavScrollExample;
