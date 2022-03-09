import Head from 'next/head'
import React, { useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import Link from 'next/link'
import ACTIONS from '../store/Action'

const Users = () => {
    const { state, dispatch } = useContext(DataContext)
    const { users,auth } = state
    return (
        <div className='users_page table-responsive'>
            <Head>
                <title>Users</title>
            </Head>
            <table className='table w-100'>
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Action</th>
                    </tr>

                </thead>
                <tbody>

                    {
                        users.map((user, index) => {
                            return (
                                <tr key={user._id}>
                                    <th>{index+1}</th>
                                    <th>{user._id}</th>
                                    <th>
                                        <img src={user.avatar} alt={user.avatar} 
                                        style={{
                                            minWidth: '30px',
                                            width: '30px',
                                            height: '30px'
                                        }}/>
                                    </th>
                                    <th>{user.name}</th>
                                    <th>{user.email}</th>
                                    <th>
                                        {
                                            user.role==='admin'
                                            ?user.root?<i className='fas fa-check text-success' aria-hidden='true'>Root</i>
                                                      :<i className='fas fa-check text-success' aria-hidden='true'></i>
                                            :<i className='fas fa-times text-danger' aria-hidden='true'></i>
                                        }
                                    </th>
                                    <th >
                                        <Link href={auth.user.root&& auth.user.email!== user.email
                                            ? `edit_user/${user._id}`
                                            :'#!'
                                        }>
                                            <a >
                                                <i className='fas fa-edit text-info' title='Edit' aria-hidden='true'
                                                    style={{
                                                        marginRight:'10px'
                                                    }}
                                                ></i>
                                            </a>
                                        </Link>
                                        {
                                            auth.user.root&& auth.user.email!== user.email
                                            ? <i className='fas fa-trash-alt text-danger' title='Remove' aria-hidden='true' data-bs-toggle="modal" data-bs-target="#exampleModal"
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                                onClick={()=>dispatch({type:ACTIONS.ADD_MODAL,payload:[{data: users,title: user.name, id: user._id,type:ACTIONS.ADD_USERS}]})}
                                            ></i>
                                            : <i className='fas fa-trash-alt text-danger ' title='Remove' aria-hidden='true'
                                            style={{
                                                cursor: 'pointer'
                                            }}
                                            ></i>
                                        }
                                    </th>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Users