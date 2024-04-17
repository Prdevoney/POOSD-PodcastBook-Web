import React, {useState} from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import './LoginSignupStyle.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginSignup = () => {


    const [action,setAction] = useState("Login");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [otp, setOtp] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleOtpChange = (e) => {
      setOtp(e.target.value);
    }


    const handleSignup = async () => {
      try {
        // Check if passwords match
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
  
        const user = {email, username, password};

        console.log(user);

        // Send signup data to backend
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "Email": email,
            "Username": username,
            "Password": password
          })
        });
        
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          console.log(data);
          setUserInfo(data);
          setShowModal(true);
        } else {
          throw new Error(data.error || "Registration failed");
        }
      } catch (error) {

        console.error("Error during signup:", error.message);
        // Handle error
        alert("Registration failed: " + error.message);
      }
    };
  
    // 1) This is the function that handles the login
    const handleLogin = async () => {
      try {
        // Send login data to backend
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // 2) I send the username and password to the server
            "Username": username,
            "Password": password
          })
        });
        
        // 3) I get the response from the server and set it in the 'data' variable
        //    Within this response is the UserID that you may need to pass through to use on other pages. 
        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('UserID', data.UserID);
          // 4) Redirect to Explore Podcasts page upon successful login and log the data
          console.log(data); 
          window.location.href = '/explore-podcasts';
        } else {
          throw new Error(data.error || "Login failed");
        }
      } catch (error) {
        console.error("Error during login:", error.message);
        // Handle error
        alert("Login failed: " + error.message);
      }
    };

    // 1) Once type in the verification code that was sent to your email
    const verifyCode = async () => {
      try {
        const response = await fetch('/api/verifyEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // 2) the I got the UserID from the response of the signup API in the function handleSignup
            "UserID": userInfo.UserID,
            "otp": otp,
          })
        });
        
        // 3) I get the response from the server and set it in the 'data' variable
        const data = await response.json();

        if (response.ok) {
          // 4) If the response is ok, I log the data and redirect to the Explore Podcasts page
          console.log(data);
          window.location.href = '/explore-podcasts';
        } else {
          throw new Error(data.error || "Verification failed");
        }
      } catch (error) {
        console.error("Error during verification:", error.message);
        // Handle error
        alert("Verification failed: " + error.message);
      }
    }

    // end of new info

function handleSignUpClick(event) {
    event.preventDefault();
    handleSignup();
}

function handleLoginClick(event) {
    event.preventDefault();
    handleLogin();
}


  return (

    <div className = 'wrapper bg-dark d-flex align-items-center justify-content-center vh-100 bg-primary'>

      <Modal 
        show={showModal} 
        onHide={() => {setShowModal(false) }} 
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="justify-content-center" closeButton>
          <Modal.Title>Verify Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="justify-content-center">
          <p>Enter the code sent to your email at: {email}</p>
          <Form.Control 
            type="text" 
            placeholder="Enter Code"
            value={otp}
            onChange={handleOtpChange}
          />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={() => {verifyCode()}}>
            Verify
          </Button>
        </Modal.Footer>
      </Modal>


      {action==="Login"? (
        //Login Form ----------------------------------------------------------------
      <div className = 'form_container p-5 rounded bg-white'>
        <h2 className = 'text-center mb-3'>Login</h2>
        <div className = "underline"></div>
        <form className = 'needs-validation'>
          <div className = 'form-group was-validated mb-2'>
              <label htmlFor = 'user' className = 'form-label'>User</label>
              <input type = "userName" value ={username} onChange={e => setUsername(e.target.value)} placeholder = 'Enter Username' className = 'form-control' required></input>
              <div className = "invalid-feedback">Please enter a valid username</div>
          </div>
          <div className = 'form-group was-validated mb-2'>
              <label htmlFor = 'password' className = 'form-label'>Password</label>
              <input type = "password" value ={password} onChange={e => setPassword(e.target.value)} placeholder = 'Enter Password' className = 'form-control' required></input>
              <div className = "invalid-feedback">Please enter your password</div>
          </div>
          <div className = 'd-grid'>
            <button type = 'submit' onClick={handleLoginClick} className = 'btn btn-primary'>Login</button>
          </div>
          < p className = 'text-right mt-2'>
            Don't have an account? <a href = 'Register' onClick={(event)=>{
              event.preventDefault();
              setAction("Register")
              }}>Sign Up</a>
          </p>
          
        </form>
      </div>
      ):(
        //Register Form ----------------------------------------------------------------
        <div className = 'form_container p-5 rounded bg-white'>
          <h2 className = 'text-center mb-3'>Register</h2>
          <div className = "underline"></div>
          <form className = 'needs-validation'>
            <div className = 'form-group was-validated mb-2'>
                <label htmlFor = 'user' className = 'form-label'>User</label>
                <input type = "userName" value ={username} onChange={e => setUsername(e.target.value)} placeholder = 'Enter Username' className = 'form-control' required></input>
                <div className = "invalid-feedback">Please enter a username</div>
            </div>
            <div className = 'form-group was-validated mb-2'>
                <label htmlFor = 'email' className = 'form-label'>Email</label>
                <input type = "email" value ={email} onChange={e => setEmail(e.target.value)} placeholder = 'Enter Email' className = 'form-control' required></input>
                <div className = "invalid-feedback">Please enter your email</div>
            </div>
            <div className = 'form-group was-validated mb-2'>
                <label htmlFor = 'password' className = 'form-label'>Password</label>
                <input type = "password" value ={password} onChange={e => setPassword(e.target.value)} placeholder = 'Enter Password' className = 'form-control' required></input>
                <div className = "invalid-feedback">Please enter your password</div>
            </div>
            <div className = 'form-group was-validated mb-2'>
                <label htmlFor = 'password' className = 'form-label'>Confirm Password</label>
                <input type = "password"  value ={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder = 'Confirm Password' className = 'form-control' required></input>
                <div className = "invalid-feedback">Please confirm your password</div>
            </div>
            <div className = 'd-grid'>
              <button type = 'submit' onClick={handleSignUpClick} className = 'btn btn-primary'>Register</button>
            </div>
            < p className = 'text-right mt-2'>
              Already have an account? <a href = 'Login' onClick={(event)=>{
                event.preventDefault();
                setAction("Login")
                }} >Login</a>
            </p>
            
          </form>
        </div>
        // ----------------------------------------------------------------
      )}
    </div>
  );
};

export default LoginSignup