import axios from 'axios';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


function ShowRecipe() {
    let location=useLocation();
    let recipe=location.state;
    let navigate=useNavigate();
    function fn(res){
        if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){

            navigate('/login');

        }
    }
    
    const handleLikeRecipe=async(e)=>{
        try{
            let res=await axios.post("http://localhost:8080/changerecipelike", recipe ,{withCredentials: true})

                if(res.data.success==false && res.data.message=="You need to be authenticated to access this page!"){
                    
                    navigate('/login');
                    return;
                }
                navigate('/')
            
            
        }catch(e){
            console.log(e,"Nahi ho payega")
        } 
    }
  return (
    <div>
        
        <img src={recipe.photo} alt="" />
        <div>{recipe.name}</div>
        <h3>Time Required</h3>
        <div>{recipe.timeRequired + "minutes"} </div>
        <h3>Description</h3>
        <div>{recipe.description}</div>
                        
        <h3>Tags</h3>
        <ul>{
                recipe.tags.map((tag,i)=>{
                    return(
                            <li key={i}>
                                {tag}
                            </li>
                        )
                        })
        }</ul>
        <h3>Ingredients</h3>
        <ul>
        {
            recipe.ingredients.map((ingr,i)=>{
                return(
                    <li key={i}>
                        {ingr.ingredient +  "          "+ingr.amount}
                            </li>
                    )
            })
        }
        </ul>
        <h3>How to cook?</h3>
        <ul>
        {
            recipe.process.map((step,i)=>{
                return(
                    <li key={i}>
                         {step}
                    </li>
                )
            })
        }
        </ul>
        <h5>Ratings:
                            {
                                recipe.rating==0 && <div>No Ratings Yet</div>
                            }
                            {
                                recipe.rating>0 && <div>{recipe.rating}</div>
                            }
        </h5>
        <button onClick={handleLikeRecipe}>Like this</button>
        {/* <button onClick={handleDeleteRecipe}>Delete This</button> */}
    </div>
  )
}

export default ShowRecipe