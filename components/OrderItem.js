import Link from 'next/link'
import React from 'react'

const OrderItem = ({order}) => {
  return (
    
      <tr>
        <td className='p-2'>
       
            <p className='mb-0'>

              <Link href={`/order/${order._id}`}>
                <a>
                  {order._id}
                </a>
              </Link>
            </p>
          
        </td>
        <td className='p-2'>{new Date(order.createdAt).toLocaleDateString()}</td>
        <td className='p-2'>${order.total}</td>
        <td className='p-2'>
          {
            order.delivered
            ?<i className='fas fa-check text-success' aria-hidden='true'></i>
            :<i className='fas fa-times text-danger' aria-hidden='true'></i>
          }
        </td>
        <td className='p-2'>
          {
              order.payment
              ?<i className='fas fa-check text-success' aria-hidden='true'></i>
              :<i className='fas fa-times text-danger' aria-hidden='true'></i>
          }
        </td>
      </tr>
    
  )
}

export default OrderItem