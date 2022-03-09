import Head from "next/head"
import Link from "next/link"
import { useState,useContext,useEffect } from "react"
import { DataContext } from "../store/GlobalState"
import { valid } from "../utils/valid"
import ACTIONS from "../store/Action"
import {  postData } from "../utils/fetchData"
import { useRouter } from "next/router"

const Register = () => {
    const {state,dispatch} = useContext(DataContext);
    const {auth} = state
    const router=useRouter()

    const initialState = { name:'',email:'',password:'',cf_password:'' }
    const [userData,setUserData]=useState(initialState)
    const {name,email,password,cf_password} = userData

    useEffect(()=>{
        if(Object.keys(auth).length!==0){
            router.push('/')
        }
    },[auth])
    
    const handleChange=(e) =>{
        const {name, value} = e.target
        setUserData({...userData,[name]:value})
    }

    const handleSubmit =async (e) =>{
        e.preventDefault()

            const errmsg = valid(name,email,password,cf_password)
            if(errmsg){
                dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:errmsg}});
                return;
            }

            dispatch({type:ACTIONS.NOTIFY,payload:{loading:true}})
            const res =await postData('auth/register',userData)
            dispatch({type:ACTIONS.NOTIFY,payload:{loading:false}})
           
            if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}});
            
            dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})

        
        setUserData(initialState)
    }
    
    return (
        <div>
            <Head>
                <title>Register</title>
            </Head>
            <form style={{ maxWidth: '500px', margin: '30px auto' }} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" aria-describedby="emailHelp" 
                        name='name' value={name} onChange={handleChange}
                    />
                    
                </div>
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
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword2" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword2" 
                        name='cf_password' value={cf_password} onChange={e=>handleChange(e)}
                    />
                </div>

                <button type="submit" className="btn btn-dark mb-3 w-100">Sign Up</button>
                <p>
                    Already have an account? <Link href='/signin'><a style={{ color: 'crimson' }} >Login Now</a></Link>
                </p>
            </form>
        </div>
    )

}

export default Register