import axios from 'axios';
import React from 'react'
import { Nav, Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap/';
import { useNavigate } from 'react-router-dom';


function Navigation() {
   let navigate=useNavigate();
    const handleLogout=async(e)=>{
        e.preventDefault();
        try{
            
            let res=await axios.get("http://localhost:8080/logout",{withCredentials: true} );
            
            navigate("/login");
        }catch(e){
            console.log(e,"Nahi ho payega")
        }
    }
    const handleadd=(e)=>{
        e.preventDefault();
        navigate('/new');
    }
    const handleSignUp=(e)=>{
        e.preventDefault();
        navigate('/signup');
    }
    const handleLogin=(e)=>{
        e.preventDefault();
        navigate('/login');
    }
    const handleAllPrograms=(e)=>{
        e.preventDefault();
        navigate('/allprograms');
    }
  return (
    <Navbar collapseOnSelect expand="lg" data-bs-theme="dark" className="bg-body-tertiary">
      <Container>
      <Navbar.Brand style={{color:'rgb(209, 48, 75)'}} href="#home">Rishika Siddha</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
         
          <Nav>
            <Nav.Link className='main-nav-1' onClick={handleadd}>Add new Video</Nav.Link>
            <Nav.Link className='main-nav-1' onClick={handleSignUp}>Signup</Nav.Link>
            <Nav.Link className='main-nav-1' onClick={handleLogin}>Login</Nav.Link>
            <Nav.Link className='main-nav-1' onClick={handleLogout}>Logout</Nav.Link>
            <Nav.Link className='main-nav-1' onClick={handleAllPrograms}>All Programs</Nav.Link>
            <Nav.Link className='main-nav-1' href="#contact">Say Hello👋</Nav.Link>

            
           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );



  
}

export default Navigation