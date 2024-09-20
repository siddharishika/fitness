import axios from 'axios';
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
    const navigate=useNavigate();
    let nameRef=useRef("");
    let emailRef=useRef("");
    let genderRef=useRef("");
    // let roleRef1=useRef("");
    // let roleRef2=useRef("");
    let passwordRef=useRef("");
    let passwordcRef=useRef("");
    let [role, setRole]=useState("");
    let [profilePicture, setProfilePicture]=useState();
    const onOptionChange = e => {
        setRole(e.target.value);
      }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        let form=document.querySelector("form");
        let formData=new FormData(form);
        let info=Object.fromEntries(formData);
       
        if(info.password!=info.passwordc){
            console.log("please enter same confirm password");
        }else{
            try{

                let res=await axios.post("http://localhost:8080/signup",  formData ,{withCredentials: true});
                navigate("/");
                }catch(e){
                    console.log(e,"Nahi ho payega")
                }
            }
    }
    const handleFileChange=(e)=>{
        e.preventDefault();
        let files=e.target.files;
        setProfilePicture(files.item(0));
    }
    
    
  return (
    <div>
        <form action="submit" onSubmit={handleSubmit} encType="multipart/form-data" method='POST' >
                <label htmlFor="username">
                    Username:
                </label>
                <input type="text" name='username' ref={nameRef} required/>
                <label htmlFor="email">email:</label>
                <input type="email" ref={emailRef} name='email'required/>
                <label htmlFor="gender">Gender:</label>
                <input type="text"  ref={genderRef} name='gender' required/>
                <label htmlFor='role-coach'>
                    Coach
                </label>
                <input type="radio" name="role" checked={role === "coach"} value="coach" onChange={onOptionChange} required  />
                <label htmlFor='role-user'>
                    User
                 </label>
                <input type="radio" name="role" checked={role === "user"}  value="user" onChange={onOptionChange} required   />
                <label htmlFor="password">Password:</label>
                <input type="password" ref={passwordRef} name='password' required/>
                <label htmlFor="passwordc">Password Confirm:</label>
                <input type="password" ref={passwordcRef} name='passwordc' required/>
                <label htmlFor="profilePicture">Profile Picture</label>
                <input name='profilePicture' type="file"  onChange={handleFileChange} accept="image/*" required/>
                <button type='submit' >SignUp</button>
            </form>
            <p>Already have an account? <Link to="http://localhost:5173/login">LogIn</Link></p>
    </div>
  )
}

export default SignUp