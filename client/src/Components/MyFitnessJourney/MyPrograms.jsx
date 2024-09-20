import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function MyPrograms() {
    // let [vids,setVids]=useState([]);
    let navigate=useNavigate();
    let [data, setData]=useState();
    useEffect(function (){
        async function getMyVideos(){
            let res = await axios.get("http://localhost:8080/getmyprograms" ,{withCredentials: true});
            
                if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){
                    
        
                    navigate('/login');
                    return;
        
                }
                // setVids(res.data.data);
            
            // setVideo(res.data.data);
            // setPrograms(res.data.data)
            setData(res.data.data)
        }
        getMyVideos();
    } , [])
    const handleDelete=async(program)=>{
        
        try{

            let res=await axios.delete(`http://localhost:8080/deleteprogram/${program._id}`,  {withCredentials: true});
            fn(res);
           

            // navigate("/");
          }catch(e){
                console.log(e,"Nahi ho payega")
          }
    }
      const handleEdit=(program)=>{
        navigate('/editprogram' , {state: program})
      }
      const handleShowProgram=(program)=>{
        navigate(`/showprogram` , {state:program});
      }
      
  return (
    <div>
        {data && 
           data.map((program,idx)=>{
            return(
                <div key={idx}>
                    <div onClick={(e)=>handleShowProgram(program)}>
                        <h2>{program.name}</h2>
                        <h3>{program.numberOfDays}</h3>
                        <h3>{program.equipment}</h3>
                        <h5>Rating: {
                                program.rating==0 && <div>No Ratings Yet</div>
                                }
                                {
                                    program.rating>0 && <div>{program.rating}</div>
                                }</h5>
                    </div>
                    <button onClick={(e)=>handleEdit(program)}>Edit This</button>
                    <button onClick={(e)=>handleDelete(program)}>Delete This</button>
                </div>
            )

           })
        }
    </div>
  )
}

export default MyPrograms