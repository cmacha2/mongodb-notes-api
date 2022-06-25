require('dotenv').config()
const { default: mongoose } = require('mongoose')
const app = require('./routes')


const connectionString = process.env.MONGO_DB_URL



mongoose.connect(connectionString).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server running on por ${process.env.PORT}`)
    })
    console.log('Database connected')
}).catch(error => console.log(error))

process.on('uncaughtException', ()=>{
    mongoose.disconnect()
})