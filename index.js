
const { default: mongoose } = require('mongoose')
const app = require('./routes')
const PORT = 3001


const connectionString = 'mongodb+srv://machado:1Q7pDygxXkNQufCd@cluster0.xeyhm.mongodb.net/machadodb?retryWrites=true&w=majority'



mongoose.connect(connectionString).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on por ${PORT}`)
    })
    console.log('Database connected')
}).catch(error => console.log(error))

