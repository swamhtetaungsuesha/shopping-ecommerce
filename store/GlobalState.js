import { createContext,useEffect,useReducer, useState } from "react";
import { getData } from "../utils/fetchData";
import { reducers } from "./Reducer";
import ACTIONS from "../store/Action"
export const DataContext = createContext()



const DataProvider = ({children}) => {
    const initialState = {
        notify:{},auth:{},cart:[],modal:{},orders:[],users:[],categories:[]
    }
    const [state, dispatch] = useReducer(reducers,initialState);
    const {cart,auth,orders} = state;
   
    useEffect(async()=>{
        const firstLogin=localStorage.getItem('firstLogin')
        if(firstLogin){
            getData('auth/accessToken')
            .then(res=>{

                if(res.error){
                    localStorage.removeItem('firstLogin')
                    return;
                }
                
                dispatch({type:ACTIONS.AUTH,payload:{token: res.access_token, user: res.user}})
            })
            
        }
        getData('category')
        .then(res=>{
            if(res.error){
                return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
            }
            dispatch({type:ACTIONS.ADD_CATEGORIES,payload:[...res.categories]})
        })
        
    },[])
    useEffect(()=>{

        const next_storage_cart = JSON.parse(localStorage.getItem('cart'))

        if(next_storage_cart) return dispatch({type:ACTIONS.ADD_CART,payload:next_storage_cart})
    },[])
    useEffect(()=>{
        localStorage.setItem('cart',JSON.stringify(cart))
    },[cart])

    useEffect(async()=>{
        if(auth.token){
            getData('order',auth.token)
            .then(res=>{

                if (res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
                
                dispatch({type:ACTIONS.ADD_ORDERS,payload:[...res.orders]})
            })
            if(auth.user.role==='admin'){
                getData(`user`,auth.token)
                .then(res=>{

                    if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
                    dispatch({type:ACTIONS.ADD_USERS,payload:[...res.users]})
                })
            }
        }else{
            dispatch({type:ACTIONS.ADD_ORDERS,payload:[]})
            dispatch({type:ACTIONS.ADD_USERS,payload:[]})
        }
    },[auth.token])
  return (
      <DataContext.Provider value={{state,dispatch}}>
          {children}
      </DataContext.Provider>
  );
};

export default DataProvider;
