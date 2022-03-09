import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useContext, useState,useEffect } from 'react'
import FilterSort from '../components/FilterSort'

import ProductItem from '../components/ProductItem'
import ACTIONS from '../store/Action'
import { DataContext } from '../store/GlobalState'
import styles from '../styles/Home.module.css'
import { getData } from '../utils/fetchData'
import { filterSearch } from '../utils/filterSearch'

const Home=(props)=> {
  const router = useRouter()
  const [products,setProducts] = useState(props.products)
  const [isChecked , setIsChecked] = useState(false)
  const {state,dispatch} = useContext(DataContext)
  const [page, setPage] = useState(1)
  const {auth} = state
  const handleChecked = (id) => {
    products.forEach(product=>{
      if(product._id===id) product.checked = !product.checked
    })
    setProducts([...products])
  }
  const handleAllChecked = () => {
    
    products.forEach(product=> product.checked = !isChecked)
    setIsChecked(!isChecked)
    setProducts([...products])
  }

  const handleLoadMore = () => {
    setPage(page+1)
    filterSearch({router,page:page+1})
  }

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach(product=>{
      if(product.checked) {
        deleteArr.push({data: '',title: 'Delete all checked products?', id: product._id,type:'DELETE_PRODUCT'})
      }
    })
    console.log(deleteArr)
    dispatch({type:ACTIONS.ADD_MODAL,payload:deleteArr})
  }
  useEffect(()=>{
    setProducts(props.products)
  },[props.products])

  useEffect(() => {
    if(Object.keys(router.query).length === 0) setPage(1)
  },[router.query])
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        { auth.user?.role==='admin'&&
          <div className='btn btn-danger mt-3'>
          <input type='checkbox' checked={isChecked} onChange={handleAllChecked}
            style={{
              width: '20px',
              height: '20px',
              transform: 'translateY(6px)'
            }}
          />
          <button className='btn btn-danger' 
            data-bs-toggle="modal" data-bs-target="#exampleModal"
            onClick={handleDeleteAll}
          >Delete All</button>
        </div>}
        <FilterSort state={state} router={router}/>
      <div className='products'>
        {
          products.map(product=>{
            return(
              <ProductItem key={product._id} product={product} handleChecked={handleChecked}/>
            )
          })
        }
      </div>
      {
        props.result < page * 3 ? ''
        :
        <button className='btn btn-outline-info d-block mx-auto mb-4'
          onClick={handleLoadMore}
        >
          Load more
        </button>
      }
    </div>
  )
}

export default Home

export async function getServerSideProps({query}){
  const page = query.page || 1
  const sort = query.sort || ''
  const category = query.category || 'all'
  const search = query.search || 'all'

  const res = await getData(`/product?limit=${page*3}&sort=${sort}&title=${search}&category=${category}`)


  return{
    props:{
      result: res.result,
      products : res.products
    }
  }
}