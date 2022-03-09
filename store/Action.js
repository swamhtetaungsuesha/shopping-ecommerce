const ACTIONS={
    NOTIFY:'NOTIFY',
    AUTH:'AUTH',
    ADD_CART:'ADD_CART',
    ADD_MODAL: 'ADD_MODAL',
    ADD_ORDERS: 'ADD_ORDERS',
    ADD_USERS: 'ADD_USERS',
    ADD_CATEGORIES: 'ADD_CATEGORIES'
}

export default ACTIONS;


export const addToCart = (product,cart) =>{
    if (product.inStock===0){
        return {type:ACTIONS.NOTIFY,payload:{title:'Error',error:'This product is out of stock'}}
    }

    const check = cart.every(item=>{
      return item._id !== product._id
    })

    if(!check){
        return {type:ACTIONS.NOTIFY,payload:{title:'Error',error:'This product has been added to cart'}}
    }
    const {_id,images,inStock,title,price,sold} = product
    return {type:ACTIONS.ADD_CART,payload:[...cart,{_id,images,inStock,title,price,sold,quantity:1}]}
}

export const decreaseQuantity = (data,id) =>{
    const newdata = [...data]
    newdata.forEach(item => {
        if(item._id===id) return item.quantity-=1
    });
    return {type:ACTIONS.ADD_CART,payload:newdata}
}
export const increaseQuantity = (data,id) =>{
    const newdata = [...data]
    newdata.forEach(item => {
        if(item._id===id)  item.quantity+=1
    });
    return {type:ACTIONS.ADD_CART,payload:newdata}
}

export const deleteItem = (data,id,type) =>{

    const newdata = data.filter(item=>{
        return item._id !== id
    })
    return {type,payload:newdata}
}
export const updateItem = (data,id,post,type) =>{
    
    const newdata = data.map(item=>(item._id===id?post:item))
    return {type,payload:newdata}
}