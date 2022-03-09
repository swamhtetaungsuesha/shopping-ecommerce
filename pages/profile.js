import Head from "next/head"
import React,{ useContext, useEffect, useState,createRef } from "react"
import OrderItem from "../components/OrderItem"
import ACTIONS from "../store/Action"
import { DataContext } from "../store/GlobalState"
import { patchData } from "../utils/fetchData"
import { imageUpload } from "../utils/imageUpload"
import { valid } from "../utils/valid"

const Profile = () => {
    const { state, dispatch } = useContext(DataContext)
    const { auth,orders } = state
    const initialState = {
        name: '',
        avatar: '',
        password: '',
        cf_password: ''
    }
    const [data, setData] = useState(initialState)
    const { name, avatar, password, cf_password } = data
    useEffect(() => {
        if(auth.user) setData({ ...data, name: auth.user?.name })
    }, [auth.user])
    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }
    const handleUpdate = async () => {
        if (password) {
            const errmsg = valid(name, auth.user?.email, password, cf_password)
            if (errmsg) return dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Error', error: errmsg } })
            const res = await patchData('user/resetPassword', { password }, auth.token)
            if (res.error) return dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Error', error: res.error } })
            dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Success', success: res.msg } })
        }
        if (name !== auth.user?.name || avatar) {
            await updateAvatar()
        }
    }
    const handleFiles = async (e) => {

        const file = e.target.files[0]
        
        if (!file) {
            return dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Error', error: 'Please choose the file!' } })
        }
        if (file.size > 1024 * 1024) {
            return dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Error', error: 'The maximum size of file must be 1mb' } })

        }
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            return dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Error', error: 'This file format is incorrect' } })
        }
        setData({ ...data, avatar: file })
    }
    const updateAvatar = async () => {
        let media = []
        dispatch({type:ACTIONS.NOTIFY,payload:{loading:true}})
        if (avatar) media = await imageUpload([avatar])
        const res = await patchData('user',{name,avatar:avatar?media[0].url:auth.user.avatar},auth.token)
        dispatch({type:ACTIONS.NOTIFY,payload:{loading:false}})
        if (res.error) return  dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Error', error: res.error } })
        dispatch({type:ACTIONS.AUTH,payload:{token:auth.token,user:res.user}})
        dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Success', success: res.msg } })
    }
    return (
        <div className="profile_page">
            <Head>
                <title>Profile</title>
            </Head>
            {
                !auth.user ? null
                    : <div className="row justify-content-center text-secondary  mt-3">
                        <div className="col-md-4 text-center">
                            <h3 className="text-uppercase">{auth.user.role==='user'?'User Profile':'Admin Profile'}</h3>
                            <div className="mt-3">
                                <div className="user_img_container">
                                    <img src={avatar ? URL.createObjectURL(avatar) : auth.user?.avatar} alt='avatar' className='img-thumbnail ' />
                                    <div className="img_change_container">
                                        <i className="fas fa-camera mb-1" aria-hidden='true'></i>
                                        <span>Change</span>
                                        <input type='file' id='file_up'  name='file' accept="image/*" onChange={handleFiles} />
                                    </div>

                                </div>
                                <div className=" text-start">

                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input type="text" className="form-control" placeholder="Your name"
                                            name='name' value={name} onChange={handleChange}
                                        />

                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" disabled={true} placeholder="Your email" defaultValue={auth.user?.email}/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">New Password</label>
                                        <input type="password" className="form-control" placeholder="Your new password"
                                            name='password' value={password} onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="cf_password" className="form-label">Comfirm New Password</label>
                                        <input type="password" className="form-control" placeholder="Comfirm new password"
                                            name='cf_password' value={cf_password} onChange={handleChange}
                                        />
                                    </div>
                                    <button className="btn btn-info text-white mb-4"
                                        onClick={handleUpdate}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <h3 className="text-uppercase">Orders</h3>
                            <div className="my-3 table-responsive">
                                <table className="table table-bordered table-hover w-100 text-uppercase text-secondary mt-2"
                                    style={{minWidth: '600px', cursor: 'pointer'}}
                                >
                                    <thead className="bg-light fw-bold">
                                        <tr>

                                            <td  className="p-2">id</td>
                                            <td  className="p-2">date</td>
                                            <td  className="p-2">total</td>
                                            <td  className="p-2">delivered</td>
                                            <td  className="p-2">paid</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            orders.map(order => {
                                                return (
                                                    <OrderItem order={order} key={order._id}/>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )

}

export default Profile