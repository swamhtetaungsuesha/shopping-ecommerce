import mongoose from 'mongoose'

const connectdb=()=>{
    if(mongoose.connections[0].readyState){
        console.log('Database is aleady connected')
        return;
    }else{
        mongoose.connect(process.env.MONGODB_URL,{},(err)=>{
            if(err) throw err
            console.log('connected to database')
        })
    }
}

export default connectdb;
