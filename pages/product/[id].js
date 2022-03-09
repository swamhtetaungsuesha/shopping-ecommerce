import React, { useContext, useState } from 'react'
import { DataContext } from '../../store/GlobalState';
import { getData } from '../../utils/fetchData'

import ACTIONS,{addToCart} from '../../store/Action';
import Head from 'next/head';

const ProductDetail = (props) => {
    const [product] = useState(props.product)
    const [tab,setTab] = useState(0)
    const { state, dispatch } = useContext(DataContext)
    const { auth,cart } = state

    const isActive=(index)=>{
        if(tab===index){
            return ' active'
        }else{
            return ''
        }
    }
    return (
        <div className='row'>
            <Head>
                <title>Product Details</title>
            </Head>
            <div className="col-md-6">
                <img className='img-thumbnail rounded mt-2' src={product.images[tab].url} alt={product.images[tab].url}
                    style={{
                        height: '300px',
                        width : '100%'
                    }}
                />
                <div className='img-container'>
                    {
                        product.images.map((img,index) => {
                            return (
                                <img key={index} className={`img-thumbnail rounded mt-2 ${isActive(index)}`} src={img.url} alt={img.url}
                                    style={{
                                        height: '70px',
                                        width: '20%',
                                        cursor : 'pointer'
                                    }}
                                    onClick={()=>setTab(index)}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <div className="col-md-6 mt-2 product-details">
                <h2>{product.title}</h2>
                <h3 className='text-danger'>${product.price}</h3>
                <div className='d-flex justify-content-between mx-0'>
                    {
                        product.inStock>0
                        ?<h5 className='text-danger'>In Stock: {product.inStock}</h5>
                        :<h5 className='text-danger'>Out Stock</h5>
                    }
                    <h5 className='text-danger'>Sold: {product.sold}</h5>
                </div>
                <p>{product.decription}</p>
                <p>{product.content}</p>
                <button className='btn btn-dark mb-5'
                    style={{
                        width : '25%'

                    }}
                    onClick={()=>dispatch(addToCart(product,cart))}
                >Buy</button>
            </div>

        </div>
    )
}

export default ProductDetail

export async function getServerSideProps(context) {
    const { params } = context
    const res = await getData(`/product/${params.id}`)

    return {
        props: {

            product: res.product
        }
    }
}