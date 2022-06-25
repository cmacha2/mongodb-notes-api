const { Schema, model } = require("mongoose");



const userShema =  new Schema({
    notes:[{
        type:Schema.Types.ObjectId,
        ref:'Note'
    }],
    username:String,
    name:String,
    passwordHash:String,
})

userShema.set('toJSON',{
    transform:(document, returnedObject)=>{
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.passwordHash
    } 
})

const User = model('User', userShema)

module.exports = User