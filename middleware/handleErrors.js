module.exports = (error,req,res,next)=>{
    if(error.name==='CastError')return res.status(400).send({error:"id used is malformed"})
    res.status(500).end()
}