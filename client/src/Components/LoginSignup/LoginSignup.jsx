import React, {useState} from 'react'
import './LoginSignupStyle.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginSignup = () => {

    const [action,setAction] = useState("Login");

    // new info ---> 
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
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
          console.log(data); // Handle response from the server as needed
          alert("Registration Successful");
        } else {
          throw new Error(data.error || "Registration failed");
        }
      } catch (error) {

        console.error("Error during signup:", error.message);
        // Handle error
        alert("Registration failed: " + error.message);
      }
    };


  
    const handleLogin = async () => {
      try {
          // Other login logic...
  
          const response = await fetch('/api/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization' : 'eyJhbGc101JIUZI1N11sIn5cCI6IkpXVCJ9'
              },
              body: JSON.stringify({
                  Username: username,
                  Password: password,
              }),
          });
  
          const data = await response.json();
          console.log(data);
  
          if (response.ok) {
              localStorage.setItem('user1', data.token); // Assuming the token is returned in the response
              window.location.href = '/explore-podcasts';
          } else {
              throw new Error(data.error || 'Login failed');
          }
      } catch (error) {
          console.error('Error during login:', error.message);
          alert('Login failed: ' + error.message);
      }
  };

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
