import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import ACTIONS, { updateItem } from '../../store/Action'
import { DataContext } from '../../store/GlobalState'
import { patchData } from '../../utils/fetchData'

const Users = () => {
    const {state,dispatch} = useContext(DataContext)
    const {users,auth} = state
    const router = useRouter()
    const {id} = router.query
    const [user,setUser] = useState({})
    const [checkedAdmin,setCheckedAdmin] = useState(false)
    const [num , setNum ] = useState(0)

    useEffect(()=>{
        users.forEach(user => {
            if(user._id===id){
                setUser(user)
                const isAdmin = user.role==='admin'?true:false
                setCheckedAdmin(isAdmin)
            }
            
        });
    },[users])


    const handleAdmin=()=>{
        if(num%2!==0){

            const role = checkedAdmin?'admin':'user'
            dispatch({type:ACTIONS.NOTIFY,payload:{loading:true}})
            patchData(`user/${id}`,{role},auth.token)
            .then(res=>{
            
                if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
                dispatch(updateItem(users,user._id,{
                    ...user,
                    role
                },ACTIONS.ADD_USERS))
                return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})
            })
        }
    }
  return (
    <div className='mt-3'>
        <Head>
            <title>Edit User</title>
        </Head>
        
        <button className='btn btn-dark' onClick={() => router.back()}>
            <i className='fas fa-long-arrow-alt-left' aria-hidden='true'></i> Go Back
        </button>
        <div className='mx-auto mt-3'
            style={{
                maxWidth: '400px'
            }}
        >
            <h2 className='text-uppercase text-secondary'>Edit User</h2>
            <div className='mb-3'>
                <label htmlFor='name' className='d-block'>Name</label>
                <input type='text' disabled defaultValue={user.name}/>
            </div>
            <div className='mb-3' >
                <label htmlFor='email' className='d-block'>Email</label>
                <input type='text' disabled defaultValue={user.email}/>
            </div>
            <div className='mb-3'>
                <input type='checkbox' checked={checkedAdmin} onChange={()=>{
                    setCheckedAdmin(!checkedAdmin)
                    setNum(num+1)
                    }}/>
                <label htmlFor='isAdmin'
                    style={{
                        transform: 'translate(3px,-1px)'
                    }}
                >isAdmin</label>
            </div>
            <button className='btn btn-dark'
                onClick={handleAdmin}
            >Update</button>
        </div>
    </div>
  )
}

export default Users