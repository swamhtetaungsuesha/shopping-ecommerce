import Head from "next/head"
import Link from "next/link"
import { useState,useContext, useEffect } from "react"
import { DataContext } from "../store/GlobalState"

import ACTIONS from "../store/Action"
import {  postData } from "../utils/fetchData"
import Cookies from "js-cookie"
import { useRouter } from "next/router"

const SignIn = () => {
    
    const {state,dispatch} = useContext(DataContext);
    const {auth} = state
    const router=useRouter()

    const initialState = {email:'',password:'' }
    const [userData,setUserData]=useState(initialState)
    const {email,password} = userData

    const handleChange=(e) =>{
        const {name, value} = e.target
        setUserData({...userData,[name]:value})
    }

    const handleSubmit =async (e) =>{
        e.preventDefault()
        try {
            

            dispatch({type:ACTIONS.NOTIFY,payload:{loading:true}})
            const res =await postData('auth/login',userData)
            dispatch({type:ACTIONS.NOTIFY,payload:{loading:false}})

            if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}});
            

            dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})

            dispatch({type:ACTIONS.AUTH,payload:{token: res.access_token, user: res.user}})
            
            Cookies.set('refresh_token',res.refresh_token,{
                path:'./api/auth/accessToken',
                expires:7        
            })

            localStorage.setItem('firstLogin',true)
           

        } catch (error) {

            dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:error.message}})

        }
        setUserData(initialState)
    }

    useEffect(()=>{
        if(Object.keys(auth).length!==0){
            router.push('/')
        }
    },[auth])

    return (
        <div>
            <Head>
                <title>Sign In</title>
            </Head>
            <form style={{maxWidth:'500px',margin:'30px auto'}} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                        name='email' value={email} onChange={handleChange}
                    />
                        <div id="emailHelp" className="form-text">We&apos;ll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1"
                    name='password' value={password} onChange={handleChange}
                    />
                </div>
                
                <button type="submit" className="btn btn-dark mb-3 w-100">Login</button>
                <p>
                    You don&apos;t have an account? <Link href='/register'><a style={{color:'crimson'}} >Register Now</a></Link>
                </p>
            </form>
        </div>
    )

}

export default SignIn