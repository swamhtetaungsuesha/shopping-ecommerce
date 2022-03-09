import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { DataContext } from '../store/GlobalState';
import ACTIONS from '../store/Action';
const Navbar = () => {
    const router = useRouter()
    const { state, dispatch } = useContext(DataContext)
    const { auth, cart } = state


    const handleLogOut = () => {
        Cookies.remove('refresh_token', { path: './api/auth/accessToken' })
        localStorage.removeItem('firstLogin')
        dispatch({ type: ACTIONS.AUTH, payload: {} })
        dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Success', success: 'Logged out!' } })
        router.push('/')
    }
    const isActive = (r) => {
        if (r === router.pathname) {
            return 'active'
        } else {
            return ''
        }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
            <div className="container-fluid ">
                <Link href="/">
                    <a className="navbar-brand fs-5" >ZYLEM</a>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/cart">
                                <a className={`nav-link ${isActive('/cart')} `} aria-current="page" >
                                    <i className="fas fa-shopping-cart me-2 position-relative" aria-hidden="true">
                                        <span className='position-absolute bg-danger text-white'
                                            style={{
                                                top: '-10px',
                                                left: '10px',
                                                padding: '1px 4px',
                                                borderRadius: '50%'
                                            }}
                                        >
                                            {cart.length}
                                        </span>
                                    </i>
                                    Cart
                                </a>
                            </Link>
                        </li>
                        {
                            Object.keys(auth).length === 0
                                ? <li className="nav-item">
                                    <Link href="/signin">
                                        <a className={`nav-link ${isActive('/signin')}`} aria-current="page" >
                                            <i className="fas fa-user me-2" aria-hidden="true"></i>
                                            Sign in
                                        </a>
                                    </Link>
                                </li>
                                : <li className="nav-item dropdown ">
                                    <a className="nav-link dropdown-toggle " href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={auth.user.avatar} className='img-fluid'
                                            style={{
                                                borderRadius: '50%', width: '30px', height: '30px',
                                                transform: 'translateY(-3px)', marginRight: '3px'

                                            }}
                                        />
                                        {auth.user.name}
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                        <li>
                                            <Link href="/profile">
                                                <a className="dropdown-item" >Profile</a>

                                            </Link>
                                        </li>
                                        {
                                            auth.user.role === 'admin' &&
                                            <>
                                                <li>
                                                    <Link href="/users">
                                                        <a className="dropdown-item" >Users</a>

                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/create">
                                                        <a className="dropdown-item" >Products</a>

                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/categories">
                                                        <a className="dropdown-item" >Categories</a>

                                                    </Link>
                                                </li>
                                            </>
                                        }
                                        <li><button className="dropdown-item border-top" onClick={handleLogOut}>Log out</button></li>

                                    </ul>
                                </li>
                        }


                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
