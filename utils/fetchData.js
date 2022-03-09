const base_url= process.env.BASE_URL

export const getData= async(url,token) =>{
    const res = await fetch(`${base_url}/api/${url}`,{
        method: 'GET',
        headers:{
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    
    return(data)
}

export const postData= async(url,post,token) =>{

        const res = await fetch(`${base_url}/api/${url}`,{
        
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body:JSON.stringify(post)
        })
        const data = await res.json()
        
        return data
    

}

export const putData= async(url,post,token) =>{
    const res = await fetch(`${base_url}/api/${url}`,{
        method: 'PUT',
        headers:{
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body:JSON.stringify(post)
    })
    const data = await res.json()
   
    return(data)
}

export const patchData= async(url,post,token) =>{
    const res = await fetch(`${base_url}/api/${url}`,{
        method: 'PATCH',
        headers:{
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body:JSON.stringify(post)
    })
    const data = await res.json()
   
    return(data)
}

export const deleteData= async(url,token) =>{
    const res = await fetch(`${base_url}/api/${url}`,{
        method: 'DELETE',
        headers:{
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
   
    return(data)
}