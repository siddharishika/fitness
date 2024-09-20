import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function MyRecipes() {
    // let [vids,setVids]=useState([]);
    let navigate=useNavigate();
    let [data, setData]=useState([]);
    useEffect(function (){
        async function getMyVideos(){
            let res = await axios.get("http://localhost:8080/getmyrecipes" ,{withCredentials: true});
            
                if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){
                    
        
                    navigate('/login');
                    return;
        
                }
            setData(res.data.data)
        }
        getMyVideos();
    } , [])
    
      const handleShowRecipe=(recipe)=>{
        navigate('/showrecipe',{state: recipe})
      }
      const handleDeleteRecipe=async(recipe)=>{
        try{

            let res=await axios.delete(`http://localhost:8080/deleterecipe/${recipe._id}`,  {withCredentials: true});
            fn(res);
            
            if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){
                
    
                navigate('/login');
                return;
            }
            navigate("/");
          }catch(e){
                console.log(e,"Nahi ho payega")
          }
    }
      
  return (
    <div>
        {
            data.map((recipe,idx)=>{
                return(
                    <div key={idx}>
                        <div onClick={(e)=>handleShowRecipe(recipe)}>
                            <img src={recipe.photo} alt="" />

                            <h3>{recipe.name}</h3>
                            <h3>{"Tags: "+ recipe.tags.join(" , ")}</h3>
                            <h5>Ratings:
                            {
                                recipe.rating==0 && <div>No Ratings Yet</div>
                            }
                            {
                                recipe.rating>0 && <div>{recipe.rating}</div>
                            }
                            </h5>
                        </div>
                        <button>Edit This</button>
                        <button onClick={(e)=>handleDeleteRecipe(recipe)}>Delete this</button>
                    </div>
                )
                })
        }
    </div>
  )
}

export default MyRecipes