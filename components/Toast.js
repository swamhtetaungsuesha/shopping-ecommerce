import React, { useEffect, useRef } from 'react';

const ToastDemo = ({title,message,state,bgColor}) => {
   const toastRef= useRef()
    useEffect(()=>{
        const myToast = toastRef.current
        
        const toast = new bootstrap.Toast(myToast, {autohide: false});
            // hide after init
            toast.show()
        
            setTimeout(()=>{
                toast.hide()
            },5000)
      
        
        
    },[state])
    return (
        <div className={`toast position-fixed top-10 end-0 ${bgColor} text-white`}role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}
            style={{
                zIndex:'22'
            }}
        >
            <div className={`toast-header ${bgColor} text-white`}>
                <strong className="me-auto">{title}</strong>
               
                <button type="button" className="btn-close " data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>
    );
};

export default ToastDemo;
