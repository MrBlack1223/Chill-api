import jwt from "jsonwebtoken"

export const authJWT = async(req,res,next)=>{
    const token = req.cookies.jwt
    if(!token) return res.status(400).send("No token")
    
    jwt.verify(token,process.env.TOKEN_SECRET, async (e,decoded)=>{
        if(e){
            if(e.message === 'jwt expired'){
                return res.status(401).send("Jwt token expired")
            }
            return res.status(403).send("Wrong token")
        }
        
        req.user = decoded.user
        next()
    })
}
