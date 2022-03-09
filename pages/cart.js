import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import CartItem from "../components/CartItem"
import ACTIONS from "../store/Action"
import { DataContext } from "../store/GlobalState"
import { getData, postData } from "../utils/fetchData"

const Cart = () => {
    const { state, dispatch } = useContext(DataContext)
    const { cart, auth,orders } = state
    const [total, setTotal] = useState(0)
    const [address, setAddress] = useState('')
    const [mobile, setMobile] = useState('')
    const [callback,setCallback] = useState(false)
    const router = useRouter()
    useEffect(() => {
        const getTotal = () => {
            const totalCost = cart.reduce((prev, current) => {
                return prev + (current.quantity * current.price)
            }, 0)
            setTotal(totalCost)
        }
        getTotal()
    }, [cart])
    useEffect(() => {
        const cartLocal = JSON.parse(localStorage.getItem('cart'))

        if (cartLocal && cartLocal.length > 0) {
            let newArr = []
            const updateCard = async () => {
                for (const item of cartLocal) {
                    const res = await getData(`product/${item._id}`)
                    const { _id, images, title, price, inStock, sold } = res.product
                    if (inStock > 0) {
                        newArr.push({
                            _id, images, title, price, inStock, sold,
                            quantity: item.quantity > inStock ? 1 : item.quantity
                        })
                    }
                }
                dispatch({ type: ACTIONS.ADD_CART, payload: newArr })
            }
            updateCard()
        }
    }, [callback])
    const handleOrder = async() => {
        if (!address || !mobile) {
            return dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Error', error: 'Please add your address and mobile!' } });
        }
        let newCart = [];
        for(const item of cart){
            const res = await getData(`product/${item._id}`)
            if(res.product.inStock-item.quantity>=0){
                newCart.push(item)
            }
        }
        if(newCart.length<cart.length){
            setCallback(!callback)
            return dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Error', error:'The product is out of stock or the quantity is insufficient'} });
        }
        dispatch({ type: ACTIONS.NOTIFY, payload:{loading: true} });
        postData('order', { address, mobile, cart, total }, auth.token)
            .then(res => {
                if (res.error) return dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Error', error: res.error } });
                dispatch({ type: ACTIONS.NOTIFY, payload: { loading:false } });
                dispatch({ type: ACTIONS.NOTIFY, payload: { title: 'Success', success: res.msg } })
                dispatch({ type : ACTIONS.ADD_ORDERS, payload: [...orders, res.newOrder]})
                dispatch({ type: ACTIONS.ADD_CART, payload: [] })
                return router.push(`/order/${res.newOrder._id}`)
            })
    }
    return (
        <div>
            <Head>
                <title>Cart</title>
            </Head>
            <div>
                {
                    cart.length === 0
                        ? <img src="https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg?size=626&ext=jpg&ga=GA1.2.1483443714.1641254400"
                            className="img-responsive w-100" alt='cart_img'
                        />
                        : (
                            <div className="row justify-content-between mx-0 mt-2 text-secondary">
                                <div className="col-md-8 table-responsive">
                                    <h2 className="text-uppercase">shopping cart</h2>
                                    <table className="table">
                                        <tbody>
                                            {
                                                cart.map(item => {
                                                    return (
                                                        <CartItem key={item._id} item={item} state={state} dispatch={dispatch} />
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4 text-end">
                                    <h2 className="text-uppercase">shipping</h2>
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">ADDRESS</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                                value={address} onChange={e => setAddress(e.target.value)}
                                            />

                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">MOBILE</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                                value={mobile} onChange={e => setMobile(e.target.value)}
                                            />

                                        </div>
                                    </form>
                                    <h2 className="text-uppercase mb-3">total: <span className="text-danger">${total}</span></h2>
                                    
                                            <Link href={!auth.user ? '/signin' : '#'}>
                                                <a className="text-uppercase btn btn-dark mb-3" onClick={handleOrder}>Process with payment</a>
                                            </Link>
                                
                                </div>
                            </div>
                        )

                }
            </div>
        </div>
    )

}

export default Cart