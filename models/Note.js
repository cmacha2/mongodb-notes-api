const { Schema, model } = require("mongoose");

const noteShema = new Schema({
    content:String,
    date:Date,
    important:Boolean,
})

noteShema.set('toJSON',{
    transform:(document, returnedObject)=>{
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    } 
})

const Note = model('Note', noteShema)

module.exports = Note