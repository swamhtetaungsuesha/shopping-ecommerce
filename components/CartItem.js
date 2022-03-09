import Link from 'next/link'
import React from 'react'
import ACTIONS, { decreaseQuantity,increaseQuantity } from '../store/Action'

const CartItem = ({item,state,dispatch}) => {
    const {cart,modal} = state
  return (
    <tr className='text-secondary'>
        <td className='align-middle'
            style={{
                minWidth: '100px'
            }}
        >
            <img src={item.images[0].url} className='img-thumbnail rounded'
                style={{
                    height: '80px',
                    width : '100px'
                }}
            />
        </td>
        <td className='align-middle'
            style={{
                minWidth: '150px'
            }}
        >
            <h4 className='text-capitalize'>
                <Link href={`/product/${item._id}`}>
                    <a>{item.title}</a>
                </Link>
            </h4>
            <h6 className='text-danger'>
                ${item.price*item.quantity}
            </h6>
            <p className='text-danger'>
                In Stock: {item.inStock}
            </p>
        </td>
        <td className='align-middle'
            style={{
                minWidth: '120px'
            }}
        >
            <button className='btn btn-outline-secondary '
                disabled={item.quantity===1?true:false}
             onClick={()=>dispatch(decreaseQuantity(cart,item._id))}
            >-</button>
            <span className='mx-2'>{item.quantity}</span>
            <button className='btn btn-outline-secondary '
                disabled={item.quantity===item.inStock?true:false}
                onClick={()=>dispatch(increaseQuantity(cart,item._id))}
            >+</button>
        </td>
        <td className='align-middle text-danger'
            style={{
                minWidth: '20px'
            }}
        >

            <i className='far fa-trash-alt text-danger fs-5'
                data-bs-toggle="modal" data-bs-target="#exampleModal"
                style={{
                    cursor: 'pointer'
                }}
                onClick={()=>dispatch({type:ACTIONS.ADD_MODAL,payload:[{data: cart,title: item.title, id: item._id,type:ACTIONS.ADD_CART}]})}
            ></i>
        </td>
    </tr>
  )
}

export default CartItem