import React, { useContext, useEffect, useRef } from 'react'
import ACTIONS, { updateItem } from '../store/Action'
import { DataContext } from '../store/GlobalState'
import { patchData } from '../utils/fetchData'

const PaypalBtn = ({order}) => {
    const paypalBtnRef=useRef()
    const {state,dispatch} = useContext(DataContext)
    const {auth,orders} = state
    useEffect(()=>{
      paypal.Buttons({

        // Sets up the transaction when a payment button is clicked
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: order.total // Can reference variables or functions. Example: `value: document.getElementById('...').value`
              }
            }]
          });
        },

        // Finalize the transaction after payer approval
        onApprove: function(data, actions) {
            dispatch({type:ACTIONS.NOTIFY,payload:{loading:true}})
          return actions.order.capture().then(function(orderData) {
                    
                    patchData(`order/payment/${order._id}`,{paymentId:orderData.payer.payer_id},auth.token)
                    .then(res=>{
                      if (res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
                      dispatch(updateItem(orders,order._id,{
                        ...order,
                        payment: true,
                        dateOfPayment: orderData.create_time,
                        method: 'Paypal',
                        paymentId:orderData.payer.payer_id
                      },ACTIONS.ADD_ORDERS))
                      dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})
                    })
          });
        }
      }).render(paypalBtnRef.current);
    },[])
  return (
    <div ref={paypalBtnRef}></div>
  )
}

export default PaypalBtn

// patchData(`order/${order._id}`,null,auth.token)
                    // .then(res=>{
                    //   if (res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
                    //   dispatch(updateItem(orders,order._id,{
                    //     ...order,
                    //     payment: true,
                    //     dateOfPayment: new Date().toISOString()
                    //   }))
                    //   dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})
                    // })