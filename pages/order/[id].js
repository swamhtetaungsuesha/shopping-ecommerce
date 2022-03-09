import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import BtnPayPal from '../../components/BtnPaypal'
import { DataContext } from '../../store/GlobalState'
import Link from 'next/link'
import Loading from '../../components/Loading'
import { patchData } from '../../utils/fetchData'
import ACTIONS, { updateItem } from '../../store/Action'

const OrderDetail = () => {
    const router = useRouter()
    const { id } = router.query
    const { state, dispatch } = useContext(DataContext)
    const { orders, auth } = state
    const [detail, setDetail] = useState({})
    useEffect(() => {
        const selectedOrder = orders.filter(order => {
            return order._id === id
        })
       
        setDetail(selectedOrder[0])
    }, [orders])
    const handleDelivered = async()=>{
        dispatch({type:ACTIONS.NOTIFY,payload:{loading:true}})
        patchData(`order/delivered/${detail?._id}`,null,auth.token)
        .then(res=>{
            if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
            dispatch(updateItem(orders,detail._id,{
                ...detail,
                payment: true,
                delivered:true,
                dateOfPayment: new Date().toISOString(),
                method: res.result.method
              },ACTIONS.ADD_ORDERS))
            dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})
        })
    }
    return (
        <div>
            <Head>
                <title>Details Order</title>
            </Head>
            {
                detail && auth
                    ? <div>
                        <button className='btn btn-dark mt-3' onClick={() => router.back()}>
                            <i className='fas fa-long-arrow-alt-left' aria-hidden='true'></i> Go Back
                        </button>
                        <div className='d-flex justify-content-around mt-4 text-uppercase flex-wrap'>
                            <div style={{
                                maxWidth: '600px'
                            }}>
                                <h2>order {detail._id}</h2>
                                <div className='text-secondary my-4'>
                                    <h3>shipping</h3>
                                    <div className='mb-3'>Name: {auth.user?.role!=='admin'?auth.user?.name:detail.user?detail.user.name:'unknown'}</div>
                                    <div className='mb-3'>Email: {auth.user?.role!=='admin'?auth.user?.email:detail.user?detail.user.email:'unknown'}</div>
                                    <div className='mb-3'>Address: {detail.address}</div>
                                    <div className='mb-3'>Mobile: {detail.mobile}</div>

                                    {
                                        detail.delivered
                                            ? <div className="alert alert-success" role="alert">
                                                delivered on {detail.updatedAt}
                                            </div>
                                            : <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
                                                not delivered 
                                                {auth.user?.role==='admin'&&<button className='btn btn-dark text-uppercase' onClick={handleDelivered}>Mark as delivered</button>}
                                            </div>
                                    }
                                    <h3>payment</h3>
                                    {detail.method&&<p>method: {detail.method}</p>}
                                    {detail.paymentId&&<p>paymentid: {detail.paymentId}</p>}
                                    {
                                        detail.payment
                                            ? <div className="alert alert-success" role="alert">
                                                paid on {detail.dateOfPayment} 
                                            </div>
                                            : <div className="alert alert-danger" role="alert">
                                                not paid
                                            </div>
                                    }
                                    <div className="table-responsive">
                                        <h3 className="text-uppercase">Order items</h3>
                                        <div className='w-100'>

                                            {
                                                detail.cart?.map(item => {
                                                    return (
                                                        <div className='d-flex justify-content-between align-items-center w-100 border-bottom p-3' key={item._id}>
                                                            <div className='d-flex justify-content-center align-items-center'>
                                                                <div style={{
                                                                    width: '60px',
                                                                    paddingRight: '10px'
                                                                }}>
                                                                    <img src={item.images[0].url} alt={item.images[0].url}
                                                                        style={{
                                                                            height: '50px',
                                                                            width: '100%'
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className='align-middle'
                                                                    style={{
                                                                        minWidth: '200px'
                                                                    }}
                                                                >
                                                                    <h5 className='text-secondary mb-0'>
                                                                        <Link href={`/product/${item._id}`}>
                                                                            <a>{item.title}</a>
                                                                        </Link>
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                            <div className='align-middle'>
                                                                <p className='text-info mb-0'>{`${item.quantity} X $${item.price} = $${item.quantity * item.price}`}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>
                                </div>

                            </div>
                            {
                                !detail.payment && auth.user?.role!=='admin' && <div className='text-center'>
                                    <h2>total: ${detail.total}</h2>
                                    <div className=' mt-4 text-center'
                                        style={{
                                            maxWidth: '250px'
                                        }}
                                    >
                                        <BtnPayPal
                                            order={detail}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    : <Loading/>
            }
        </div>
    )
}

export default OrderDetail