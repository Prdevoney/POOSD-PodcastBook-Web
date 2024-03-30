import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

/*getting username from login:
const username = sessionStorage.getItem('username');
console.log('Username:', username); Output the retrieved username*/


const ExplorePodcasts = () => {
  return (
    <Navbar expand="lg" bg="light" variant="light">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <div className="d-flex align-items-center">
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                Select Type
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/podcast">Podcast Title</Dropdown.Item>
                <Dropdown.Item href="#/episode">Episode Title</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <form className="d-flex mx-3">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
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
