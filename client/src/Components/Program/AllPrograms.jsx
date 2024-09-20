import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ShowProgram from './ShowProgram';
import { useNavigate } from 'react-router-dom';

function AllPrograms() {
    
    let navigate=useNavigate();
    let [programs, setPrograms]=useState([]);
    function fn(res){
        if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){

            navigate('/login');

        }
    }
    useEffect(function (){
        async function getProgram(){
            let res = await axios.get("http://localhost:8080/allprograms" ,{withCredentials: true});
            // setVideo(res.data.data);
            setPrograms(res.data.data)
            
        }
        getProgram();
    } , [])
    const showProgram=(program)=>{
       
        navigate(`/showprogram` , {state:program});
      }
    
  return (
    <div>
        {
            programs.map((program,idx)=>{
               return(
                <div  key={idx}  >
                    <div onClick={()=>showProgram(program)}>
                        <h1>{program.name}</h1>
                        <h2>{program.description}</h2>
                        <img  src="https://plus.unsplash.com/premium_photo-1670505060574-b08479270d1b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" 
                        height="150" width="150"/>
                        {
                            program.equipment.map((equip,i)=>{
                                return(
                                    <h3 key={i}>{equip}</h3>
                                )
                            })
                        }
                        {
                            program.typeOfProgram.map((typ,i)=>{
                                return(
                                    <h3 key={i}>{typ}</h3>
                                )
                            })
                        }
                        <h3>{program.numberOfDays}</h3>
                        <h3>{program.timePerDay}</h3>
                        <h5>Rating: {
                            program.rating==0 && <div>No Ratings Yet</div>
                            }
                            {
                                program.rating>0 && <div>{program.rating}</div>
                            }</h5>
                    </div>

                </div>
               )

            })
        }
    </div>
  )
}

export default AllPrograms