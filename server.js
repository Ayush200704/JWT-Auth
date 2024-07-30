import express from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const app = express()

app.use(express.json())


app.get("/", authenticateToken, (req, res) => {
    const user = req.user
    res.status(200).json(user)
})


function authenticateToken(req, res, next) {
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(' ')[1]
    
    if(token == null) return res.status(401).json({message: "token not found"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) return res.status(401).json({message: "Forbidden"})
        req.user = user
        next()
    })
}


app.listen(process.env.PORT, () => {
    console.log("listening to port 5555")
})