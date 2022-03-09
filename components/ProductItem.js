import React, { useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import ACTIONS,{addToCart} from '../store/Action'

const ProductItem = ({ product,handleChecked }) => {
  const {state,dispatch}=useContext(DataContext)
  const {cart,auth} = state

  return (
    <div className="card" style={{ width: '18rem' }}>
      {
        auth.user?.role==='admin'
        &&<input type='checkbox' className='position-absolute' checked={product.checked}
             onChange={()=>handleChecked(product._id)}
            style={{
              width:'20px',
              height:'20px'
            }}
        />
      }
      <img src={product.images[0].url} className="card-img-top" alt={product.images[0].url} />
      <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <div className='d-flex justify-content-between mx-0'>
          <h6 className='text-danger'>{`$${product.price}`}</h6>
          <h6 className='text-danger'>
            {
              product.inStock===0
              ?'Out Stock'
              :`In Stock: ${product.inStock}`
            }
          </h6>
        </div>
        <p className="card-text">{product.decription}</p>
      {  auth.user?.role!=='admin' 
        ? <div className='row justify-content-between m-1'>
            <a href={`/product/${product._id}`} className="btn btn-info text-white "
              style={{
                marginRight: '5px',
                flex: 1
              }}
            >View</a>
            <button href="#" className="btn btn-success"
              style={{
                marginLeft: '5px',
                flex: 1
              }}
              disabled={product.inStock===0?true:false}
              onClick={()=>dispatch(addToCart(product,cart))}
            >Buy</button>
          </div>
        : <div className='row justify-content-between m-1'>
          <a href={`create/${product._id}`} className="btn btn-info text-white "
            style={{
              marginRight: '5px',
              flex: 1
            }}
          >Edit</a>
          <button  className="btn btn-danger"
            data-bs-toggle="modal" data-bs-target="#exampleModal"
            onClick={()=>dispatch({type:ACTIONS.ADD_MODAL,payload:[{data: '',title: product.title, id: product._id,type:'DELETE_PRODUCT'}]})}
            style={{
              marginLeft: '5px',
              flex: 1
            }}
          
          >Delete</button>
        </div>  
      }
      </div>
    </div>
  )
}

export default ProductItem