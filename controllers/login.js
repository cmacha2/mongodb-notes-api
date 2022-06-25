const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const loginRouter = require('express').Router()
const {SECRET} = process.env

loginRouter.post('/', async(req,res)=>{
    const {username,password} = req.body
    
    const user = await User.findOne({username})
    const passwordCorrect = user === null 
     ? false 
     : await bcrypt.compare(password, user.passwordHash)

     if(!(passwordCorrect && user)){
        return res.status(401).json({error:'invalid user or password'})
     }
    
    const userForToken = {
        id:user._id,
        username:user.username
    }
    const token = jwt.sign(userForToken, SECRET)


    res.send({
        name:user.name,
        username:user.username,
        token
     })
})


module.exports = loginRouter