import Head from 'next/head'
import React, { useContext,useState } from 'react'
import ACTIONS, { updateItem } from '../store/Action'
import { DataContext } from '../store/GlobalState'
import {postData, putData} from '../utils/fetchData'

const Categories = () => {
    const { state,dispatch }=useContext(DataContext)
    const [id , setId] = useState('')
    const {categories,auth} = state
    const [ name,setName ] = useState('')

    const handleClick = () =>{
        dispatch({type:ACTIONS.NOTIFY,payload:{loading:true}})
        if(!id){
            postData('category',{name},auth.token)
            .then(res=>{
                if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
                dispatch({type:ACTIONS.ADD_CATEGORIES,payload:[...categories,res.newCategory]})
                return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})
            })
        }else{
            putData(`category/${id}`,{name},auth.token)
            .then(res => {
                if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
                dispatch(updateItem(categories,id,{
                    ...res.category,
                    name
                },ACTIONS.ADD_CATEGORIES))
                return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})
            })
        }
        setName('')
        setId('')
    }
    const handleEdit = (editName,editId) =>{
        setName(editName)
        setId(editId)
    }
  return (
    <div>
        <Head>
            <title>Categories</title>
        </Head>
        <div className='col-md-6 mx-auto mt-3 '>
            <div className='input-group d-flex my-3'>
                <input className='form-control mr-3' value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
                <button className='btn btn-secondary' onClick={handleClick}>
                    {id?'Update':'Create'}
                </button>
            </div>
            {
                categories.map(category=>{
                   return(
                    <div key={category._id} className='card my-2 '>
                        <div className='card-body d-flex justify-content-between text-capitalize'>
                            {category.name}
                            <div>
                                <i className='fas fa-edit text-info' title='Edit' aria-hidden='true'
                                                        style={{
                                                            marginRight:'10px',
                                                            cursor: 'pointer'
                                                        }}
                                    onClick={()=>handleEdit(category.name,category._id)}
                                ></i>
                                <i className='fas fa-trash-alt text-danger ' title='Remove' aria-hidden='true' data-bs-toggle="modal" data-bs-target="#exampleModal"
                                            style={{
                                                cursor: 'pointer'
                                            }}
                                    onClick={()=>dispatch({type:ACTIONS.ADD_MODAL,payload:[{data: categories,title: category.name, id:category._id,type:ACTIONS.ADD_CATEGORIES}]})}
                                ></i>
                            </div>
                        </div>
                    </div>
                   )
                })
            }
        </div>
    </div>
  )
}

export default Categories