export const imageUpload= async(images)=>{
    let imgArr=[]
    for (const item of images) {
        const formdata = new FormData()
        formdata.append('file',item)
        formdata.append('upload_preset',process.env.CLOUD_UPLOAD_PRESET)
        formdata.append('cloud_name',process.env.CLOUD_NAME)
        const res = await fetch(process.env.CLOUD_API,{
            method:'POST',
            body:formdata
        })
        const data = await res.json()
    
        imgArr.push({public_id:data.public_id,url:data.secure_url})
    }
    return imgArr
}