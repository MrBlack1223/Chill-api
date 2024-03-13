import jwt from "jsonwebtoken"

export const authJWT = async(req,res,next)=>{
    const token = req.cookies.jwt
    if(!token) return res.sendStatus(401)
    
    jwt.verify(token,process.env.TOKEN_SECRET, async (e,decoded)=>{
        if(e) return res.sendStatus(403)
        
        req.user = decoded.user
        next()
    })
}