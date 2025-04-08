import React , {useState} from 'react'
import { useNavigate } from 'react-router-dom' ;
import './LoginSignup.css'

import user_icon from './Assets/person.png'
import email_icon from './Assets/email.png'
import password_icon from './Assets/password.png'
 
const LoginSignup = () => {
    const [action,setAction] = useState("Sign Up");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // Validation function
        const validateInputs = () => 
        {
            if (action === "Sign Up") 
            {
                if (!name.trim()) {
                    alert("Name is required.");
                    return false;
                }
                if (name.length < 3) {
                    alert("Name must be at least 3 characters.");
                    return false;
                }
            }
        
            if (!email.trim()) {
            alert("Email is required.");
            return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Invalid email format.");
            return false;
            }
        
            if (!password) {
            alert("Password is required.");
            return false;
            }
            if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return false;
            }
            if (!/[0-9]/.test(password)) {
            alert("Password must contain at least one number.");
            return false;
            }
            if (!/[!@#$%^&*]/.test(password)) {
            alert("Password must contain at least one special character (!@#$%^&*).");
            return false;
            }
        
            return true; // If all validations pass
        };

    const handleSubmit = () => {
        if (validateInputs()) {
            navigate('/welcome'); // Only navigate if validation passes
          }
      };

  return (
    <div className='container'>
    <div className='header'>
    <div className='text'>{action}</div>
    <div className='underline'></div>

    </div>
    <div className='inputs'> 
    {action==="Login"?<div></div> : <div className='input'>
    <img src= {user_icon} alt='' />
    <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
    </div>}
    
 
    <div className='input'>
    <img src={email_icon} alt='' />
    <input type='email' placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)}/>
    </div> 


    <div className='input'>
    <img src={password_icon} alt='' />
    <input type='password' placeholder='Password' value={password}
            onChange={(e) => setPassword(e.target.value)} />
    </div>

    
    </div>  
    <div align = "left" className='forgot-password' style={{ display: action === "Sign Up" ? "none" : "block" }}>
    Forgot Password? <span>Click Here!</span>
    </div>
    <div className='submit-container'>
        <div className={action === "Login" ? "submit gray" : "submit"} onClick={()=>{setAction("Sign Up") ; handleSubmit();}}>Sign Up</div> 
        <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={()=>{setAction("Login") ; handleSubmit();}}>Login</div>
    </div>
    </div> 
  ) 
}

export default LoginSignup