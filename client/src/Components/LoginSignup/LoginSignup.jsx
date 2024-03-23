import React, {useState} from 'react'
import './LoginSignupPage.css'

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
        // Send login data to backend
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "Username": username,
            "Password": password
          })
        });
  
        const data = await response.json();
        if (response.ok) {
          console.log(data); // Handle response from the server as needed
          
          // Redirect to Explore Podcasts page upon successful login
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
    <div className = 'container'>
        <div className = "header">
            <div className = "text">{action}</div>
            <div className = "underline"></div>
        </div>
        <div className = "inputs">
            {/* {action==="Login"?<div></div>: <div className = "input">
            <input type = "text" placeholder = "Name" />
            </div>}

            <div className = "input">
                <input type = "text" placeholder = "Username" />
            </div> */}
            
            {action==="Login"? (
                <form>
                    <div className = "input">
                        <input type = "text" value ={username} onChange={e => setUsername(e.target.value)} placeholder = "Username" />
                    </div>
                    <div className = "input">
                        <input type = "password" value ={password} onChange={e => setPassword(e.target.value)} placeholder = "Password" />
                    </div>
                    <div className = "button">
                    <button className ="btn" onClick={handleLoginClick}>Login</button>
                    </div>
                </form>
                ):(
                <form>
                    {/* <div className = "input">
                        <input type = "text" placeholder = "Name" />
                    </div> */}
                    <div className = "input">
                        <input type = "text" value ={username} onChange={e => setUsername(e.target.value)} placeholder = "Username" />
                    </div>
                    <div className = "input">
                        <input type = "email" value ={email} onChange={e => setEmail(e.target.value)} placeholder = "Email" />
                    </div>
                    <div className = "input">
                        <input type = "password" value ={password} onChange={e => setPassword(e.target.value)} placeholder = "Password" />
                    </div>
                    <div className='input'>
                        <input type = "password" value ={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder = "Confirm Password" />
                    </div>
                    <div className = "button">
                    <button className ="btn" onClick={handleSignUpClick}>Sign Up</button>
                    </div>
                </form>)}
        </div>

        {/* {action==="Sign Up"?<div></div>:<div className = "forgotpassword">Lost Password</div>} */}

        <div className = "submit-container">
            {/*             
                <button className={action === "Login" ? "submit gray" : "submit"} onClick={handleSignUpClick}>
                Sign Up
                </button>
                <button className={action === "Sign Up" ? "submit gray" : "submit"} onClick={handleLoginClick}>
                Login
                </button> */}

            <div className = {action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up Here</div>
            
            <div className = {action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}} >Login Here</div>
        </div>
    </div>
  );
};

export default LoginSignup
