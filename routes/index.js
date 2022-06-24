const express = require('express')
const Note = require('../models/Note')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req,res)=>{
    const notes = Note.find({})
    .then((result)=>res.json(result))
    .catch(error=>console.log(error))
})

app.post('/api/notes', (req,res)=>{
    const {content,date,important} = req.body

    const note = new Note({
        content,
        date,
        important
    })
    note.save()
    .then(result=> res.json(result))
    .catch(error=> res.status(400).json(error))
})


module.exports = app