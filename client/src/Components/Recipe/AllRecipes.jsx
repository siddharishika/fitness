import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AllRecipes() {
    let [recipes, setRecipes]=useState([]);
    let navigate=useNavigate();
    useEffect(function (){
        async function getRecipe(){
            let res = await axios.get("http://localhost:8080/allrecipes" ,{withCredentials: true});
            // setVideo(res.data.data);
            setRecipes(res.data.data);
            
        }
        getRecipe();
    } , [])
    const showRecipe=(recipe)=>{
        navigate('/showrecipe',{state: recipe})
    }
    
  return (
    <div >
        {recipes && 
            recipes.map((recipe,idx)=>{
                return(
                    <div key={idx} onClick={(e)=>showRecipe(recipe)}>
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
                    </div>
                )
            })
        }
        
    </div>
  )
}

export default AllRecipes