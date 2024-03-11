import React, {useState} from 'react'
import './LoginSignupPage.css'

const LoginSignup = () => {

    const [action,setAction] = useState("Login");

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
                <>
                    <div className = "input">
                        <input type = "text" placeholder = "Username" />
                    </div>
                    <div className = "input">
                        <input type = "password" placeholder = "Password" />
                    </div>
                </>
                ):(
                <>
                    <div className = "input">
                        <input type = "text" placeholder = "Name" />
                    </div>
                    <div className = "input">
                        <input type = "text" placeholder = "Username" />
                    </div>
                    <div className = "input">
                        <input type = "email" placeholder = "Email" />
                    </div>
                    <div className = "input">
                        <input type = "password" placeholder = "Password" />
                    </div>
                    <div className='input'>
                        <input type = "password" placeholder = "Confirm Password" />
                    </div>
                </>)}
        </div>

        {/* {action==="Sign Up"?<div></div>:<div className = "forgotpassword">Lost Password</div>} */}

        <div className = "submit-container">
            <div className = {action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
            <div className = {action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}} >Login</div>
        </div>
    </div>
  );
};

export default LoginSignup
