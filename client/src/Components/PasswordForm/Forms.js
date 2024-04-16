import React, { useEffect, useState } from 'react';
import { useLocation, } from "react-router";
import { useNavigate } from 'react-router-dom'
import queryString from 'query-string';
import axios from "axios";
import './Forms.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const baseurl = 'https://podcastd-test.azurewebsites.net/api'

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

            const { data } = await axios(`${baseurl}/verify-token?token=${token}&id=${id}`)

            //console.log(data);

            if (!data.success) return setInvalidUser(data.error);
        } catch (error) {

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
    }, []);

    const handleOnChange = ({ target }) => {
        const { name, value } = target;

        setNewPassword({ ...newpassword, [name]: value })
    }

    const handleSubmit = async(e)  => {
        e.preventDefualt()
        const { password, confirmpassword } = newpassword
        if (password.trim().length < 8 || password.trim().length > 20) {
            return setError('Password must be 8 to 20 characters long!');
        }
        if (password !== confirmpassword) {
            return setError('Password does not match!');
        }

        try {

            const { data } = await axios.post(`${baseurl}/resetPassword?token=${token}&id=${id}`, {password});
            console.log("why");
            //console.log(data);
            
            if (data.success) {
                navigate('/reset-password');
                setSuccess(true);
            }
        } catch (error) {
    
            if (error?.response?.data) {
                const { data } = error.response;
                if (!data.success) return setInvalidUser(data.error);
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

        <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100">
            <h1 className="ResetPass">Reset Password</h1>
            <form onSubmit={handleSubmit} className="shadow w-full rounded-lg p-10">
                {error && (<p className="text-center p-2 mb-3 pg-red-500 text-white">{error}</p>
                )}
                <div className="container-fluid d-flex justify-content-center">
                    <input type="password" placeholder='**********' name='password' onChange={handleOnChange} className="px-3 text-lg h-10 w-full border-gray-500 border-2 rounded" />
                    <input type="password" placeholder='**********' name='confirmpassword' onChange={handleOnChange} className="px-3 text-lg h-10 w-full border-gray-500 border-2 rounded" />
                    <input type="submit" value="Reset password" className="btn btn-primary btn-sm text-black rounded" />
                </div>

            </form>
        </div>

        

        

    )
}