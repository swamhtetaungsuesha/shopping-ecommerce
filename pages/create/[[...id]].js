import Head from 'next/head'
import React, { useContext, useEffect, useState } from 'react'
import ACTIONS from '../../store/Action'
import { DataContext } from '../../store/GlobalState'
import { getData, postData, putData } from '../../utils/fetchData'
import { imageUpload } from '../../utils/imageUpload'
import { useRouter } from "next/router"

const ProductManager = () => {
    const router = useRouter()
    const {id} = router.query
    const {state,dispatch} = useContext(DataContext)
    const {categories,auth} = state
    const initialState = {
        title: '',
        price :0,
        inStock: 0,
        category: '',
        decription: '',
        content : ''
    }
    const [data,setData] = useState(initialState)
    const { title,price,inStock,category,decription,content } = data
    const [images,setImages] = useState([])
    const [onEdit,setOnEdit] = useState(false)

    useEffect(async()=>{
        if(id){
            const res =await getData(`product/${id}`)
            if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
            setData(res.product)
            setImages(res.product.images)
            setOnEdit(true)
        }else{
            setData(initialState)
            setImages([])
            setOnEdit(false)
        }
    },[id])

    const handleChange = (e) =>{
        const {name,value} = e.target
        setData({...data,[name]:value})
    }
    const handleFiles = (e) =>{
        const files = [...e.target.files]
        let num = 0
        let err = ''
        let newImages = []
        if(!files) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:'Please choose the file!'}})
        files.forEach(file=> {
            if(file.size > 1024 * 1024)
             return  err = 'The maximum size of file must be 1mb'
            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
               return  err = 'This file format is incorrect'
            num+=1
            if(num<=5)
                newImages.push(file)
        })
        if(err)  dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:err}})
        if(images.length+newImages.length>5){
          return  dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:'Select up to 5 images'}})
        }
        setImages([...images,...newImages])
    }  
    const handleDeleteImages = (index) =>{
        const img = [...images]
        img.splice(index,1)
        setImages(img)
    } 
    const handleSubmit =async (e) => {
        e.preventDefault()
        if(auth.user.role!=='admin'){
           return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:'Authentication is not valid.'}})
        }
        if(!title||!price||!inStock||category==='all'||!decription||!content||images.length===0)
            return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:'Please add all fields'}})

        const newImages = images.filter(img => !img.url)
        const oldImages  = images.filter(img=> img.url)
        let media = []
        dispatch({type:ACTIONS.NOTIFY,payload:{loading:true}})

        if(newImages.length>0) media = await imageUpload(newImages)
        if(!onEdit){

            const res = await postData('product',{...data,images:[...oldImages,...media]},auth.token)
            if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
            dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})
        }else{
            const res = await putData(`product/${id}`,{...data,images:[...oldImages,...media]},auth.token)
            if(res.error) return dispatch({type:ACTIONS.NOTIFY,payload:{title:'Error',error:res.error}})
            dispatch({type:ACTIONS.NOTIFY,payload:{title:'Success',success:res.msg}})
        }
    }
  return (
    <div>
        <Head>
            <title>Products Manager</title>
        </Head>
        <form className='row my-4' onSubmit={handleSubmit}>
            <div className='col-md-6'>
                <input type='text' className='form-control mb-2 p-2'
                    placeholder='Title' name='title' value={title} onChange={handleChange}
                />
                <div className='row'>
                    <div className='col-sm-6'>
                        <label  htmlFor="price">Price</label>
                        <input type='number' className='form-control my-2 p-2'
                            placeholder='Price' name='price' value={price} onChange={handleChange}
                        />
                    </div>
                    <div className='col-sm-6'>
                        <label  htmlFor="inStock">In Stock</label>
                        <input type='number' className='form-control my-2 p-2'
                            placeholder='In Stock' name='inStock' value={inStock} onChange={handleChange}
                        />
                    </div>
                    
                </div>
                <textarea className='d-block my-2 w-100 p-2' cols='60' rows='4' placeholder='Decription'
                  name='decription'  value={decription} onChange={handleChange}
                ></textarea>
                <textarea className='d-block my-2 w-100 p-2' cols='60' rows='6' placeholder='Content'
                  name='content'  value={content} onChange={handleChange}
                ></textarea>
                <div className='input-group-prepend px-0 my-3'>
                    
                    <select className='form-select  text-capitalize' aria-label="Default select example"
                     name='category'   value={category} onChange={handleChange}
                    >
                        <option value='all'>all products</option>
                        {
                            categories.map(item=>{
                            return(
                                <option key={item._id} value={item._id}>{item.name}</option>
                            ) 
                            })
                        }
                    </select>
                </div>
            </div>
            <div className='col-md-6'>
                <div className="input-group mb-3 border rounded ">
                    <label className="input-group-text" htmlFor="upload">Upload</label>
                    <input type="file" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                        onChange={handleFiles}
                        style={{
                            opacity:'0'
                        }}
                        multiple accept="image/*"
                    />
                </div>
                <div className='row  img-up mx-0 mb-3'>
                    {
                        images.map((img,index)=>{
                            return(
                                <div key={index} className='file_img my-2'>
                                    <img className='img-thumbnail ' src={img.url?img.url:URL.createObjectURL(img)}/>
                                    <span onClick={()=>handleDeleteImages(index)}>X</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <button className='btn btn-info text-white' type='submit'
                style={{
                    maxWidth: '100px',
                    marginLeft: '12px'
                }}
            >{onEdit?'Update':'Create'}</button>
        </form>
    </div>
  )
}

export default ProductManager