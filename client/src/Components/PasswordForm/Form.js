import React, { useEffect, useState } from 'react';
import { useLocation, } from "react-router";
import { useNavigate } from 'react-router-dom'
import queryString from 'query-string';
import axios from "axios";
import './Form.css'
import 'bootstrap/dist/css/bootstrap.min.css';


/* WHEN WE DEPLOY SWITCH TO THIS BASEURL */
// const baseurl = 'https://mypodcastbook.com/api'

/* THIS IS FOR LOCAL TESTING */
const baseurl = 'http://localhost:5000/api'


export default function Form() {

    const location = useLocation();
    const navigate = useNavigate();
    const [invalidUser, setInvalidUser] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [newpassword, setNewPassword] = useState({
        password: '',
        confirmpassword: ''
    })
    const { token, id } = queryString.parse(location.search)

    const verifyToken = async () => {
        try {
            console.log('token: ' + token + ' id: ' + id);
            const response = await axios(`${baseurl}/verify-token?token=${token}&id=${id}`)
            const data = response.data;
            console.log('response: ' + data);

            if (!data.success) return setInvalidUser(data.error);
        } catch (error) {
            console.log("hello");
            console.error('Error verifying token', error.data)
            if (error?.response?.data) {
                const { data } = error.response;
                if (!data.success) return setInvalidUser(data.error);
                return console.log(error.response.data);
            }
            console.log(error.response.data);
        }
    };



    useEffect(() => {
        verifyToken();
    }, );

    const handleOnChange = ({ target }) => {
        const { name, value } = target;

        setNewPassword({ ...newpassword, [name]: value })
    }

    const handleSubmit = async(e)  => {
        e.preventDefault()
        const { password, confirmpassword } = newpassword
        if (password.trim().length < 8 || password.trim().length > 20) {
            return setError('Password must be 8 to 20 characters long!');
        }
        if (password !== confirmpassword) {
            return setError('Password does not match!');
        }

        try {
            console.log("this is my password:");
            console.log(password);
            const { data } = await axios.post(`${baseurl}/resetPassword?token=${token}&id=${id}`,{Password:  password });
            console.log("why");
            //console.log(data);

            if (data.success) {
                alert('Password reset successful! Will redirect to login page.');
                navigate('/');
                setSuccess(true);
            }
        } catch (error) {

            if (error?.response?.data) {
                const { data } = error.response;
                if (!data.success) return setError(data.error);
                return console.log(error.response.data);
            }
            console.log(error.response.data);
        }
    }

    if (success) return <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3xl text-gray-500 mb-3">Password Reset Successful</h1>
    </div>


    if (invalidUser) return <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3xl text-gray-500 mb-3">{invalidUser}</h1>
    </div>

    return (

        <div className="container-fluid col-md-6 mx-auto mt-3 'text-center mb-3 ">
            <h1 className='text-center mb-3'>Reset Password</h1>
            <form onSubmit={handleSubmit} className="shadow w-full rounded-lg p-10">
                {error && (<p className="text-center p-2 mb-3 pg-red-500 text-white">{error}</p>
                )}

                <div className='form-group was-validated mb-2'>
                    <label className='form-label'></label>
                    <input type="password" placeholder="Password" name='password' onChange={handleOnChange} className='form-control' required></input>
                    <div className="invalid-feedback">Please enter your password</div>
                </div>

                <div className='form-group was-validated mb-2'>
                    <label className='form-label'></label>
                    <input type="password" placeholder="Confirm Password" name='confirmpassword' onChange={handleOnChange} className='form-control' required></input>
                    <div className="invalid-feedback">Please confirm your password</div>
                </div>

                <div className = 'd-grid'>
              <input type = 'submit' value='Reset password'  className = 'btn btn-primary'/>
            </div>
            </form>
        </div>

    )
}