import React,{useState,useEffect} from 'react'
import { filterSearch } from '../utils/filterSearch'


const FilterSort = ({state,router}) => {
    const {categories} = state
    const [category,setCategory] = useState('')
    const [search,setSearch] = useState('')
    const [sort,setSort] = useState('')

    useEffect(()=>{
        if(search){
            filterSearch({router,search:search.toLowerCase()})
        }else{
            filterSearch({router,search:'all'})
        }
    },[search])
    const handleFilterCategory = (e) => {
        setCategory(e.target.value)
        filterSearch({router,category:e.target.value})
    }

    const handleSort = e => {
        setSort(e.target.value)
        filterSearch({router,sort:e.target.value})
    }

  return (
    <div className='row justify-content-center input-group my-2 m-0'>
        <div className=' col-md-2 p-0 mb-1'>
            <select className='form-select text-capitalize' value={category} onChange={handleFilterCategory}>
                <option value='all'>All Products</option>
                {
                    categories.map(category=>{
                      return  <option key={category._id} value={category._id}>{category.name}</option>
                    })
                }
            </select>
        </div>
        <form className='col-md-8 p-0 mb-1'>
            <input autoComplete='off' className='form-control' value={search.toLowerCase()} onChange={(e)=>setSearch(e.target.value)}/>
        </form>
        <div className='col-md-2 p-0 mb-1'>
                <select className='form-select text-capitalize' value={sort} onChange={handleSort}>
                    <option value='-createdAt'>newest</option>
                    <option value='oldest'>oldest</option>
                    <option value='-sold'>best sales</option>
                    <option value='-price'>price: high-low</option>
                    <option value='price'>price: low-high</option>
                </select>
        </div>
    </div>
  )
}

export default FilterSort