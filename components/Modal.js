import React, { useContext } from 'react'
import ACTIONS, { deleteItem } from '../store/Action'
import { DataContext } from '../store/GlobalState'
import { deleteData } from '../utils/fetchData'

const Modal = () => {
    const {state,dispatch}=useContext(DataContext)
    const {modal,auth} = state
    const handleSubmit =async () => {
        for (const item of modal) {
            if(item.type===ACTIONS.ADD_CART){
                dispatch(deleteItem(item.data,item.id,item.type))
            }
            if(item.type===ACTIONS.ADD_USERS){
                dispatch({type:ACTIONS.NOTIFY,payload:{loading:true}})
                const res =await deleteData(`user/${item.id}`,auth.token)
                dispatch({type:ACTIONS.NOTIFY,payload:{loading:false}})
                if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
                dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})
                dispatch(deleteItem(item.data,item.id,item.type))
            }
            if(item.type===ACTIONS.ADD_CATEGORIES){
                dispatch({type:ACTIONS.NOTIFY,payload:{loading:true}})
                const res =await deleteData(`category/${item.id}`,auth.token)
                dispatch({type:ACTIONS.NOTIFY,payload:{loading:false}})
                if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
                dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})
                dispatch(deleteItem(item.data,item.id,item.type))
            }
            if(item.type==='DELETE_PRODUCT'){
                dispatch({type:ACTIONS.NOTIFY,payload:{loading:true}})
                const res =await deleteData(`product/${item.id}`,auth.token)
                dispatch({type:ACTIONS.NOTIFY,payload:{loading:false}})
                if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
                dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})
            }
        }
        dispatch({type:ACTIONS.ADD_MODAL,payload:[]})
    }
    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-capitalize" id="exampleModalLabel">
                            {modal.length!==0 && modal[0]?.title}
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Are you sure to delete this item?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                            onClick={handleSubmit}
                        >Yes</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal