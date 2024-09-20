import React, { useRef } from 'react'

function EditUser() {
    let nameRef=useRef();
    let emailRef=useRef();
    let genderRef=useRef();
  const handleSubmit=(e)=>{

  }  
  return (
    <div>
        <form action="submit" onSubmit={handleSubmit} >
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
                <button type='submit' >SignUp</button>
            </form>
            <p>Already have an account? <Link to="http://localhost:5173/login">LogIn</Link></p>
    </div>
  )
}

export default EditUser