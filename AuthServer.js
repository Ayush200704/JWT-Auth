import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.json())

const users = []


app.post("/register", async (req, res) => {
    const { username, password } = req.body
    const user = users.find(user => user.username === username)
    if(user) return res.status(409).json({ message: "username already there" })
        
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        users.push({ id: Date.now().toString() , username: username, password: hashedPassword })
        res.status(200).json({message: "registered", data: users});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body
    const user = users.find(user => user.username === username)
    if (!user) {
        res.status(404).json({ message: "username not found" })
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            const payload = user
            const token = generateAccessToken(payload)
            const refreshToken = jwt.sign({payload}, process.env.REFRESH_TOKEN_SECRET)

            users.map(s => {
                if(s.username === user.username){
                    delete users[users.indexOf(s)]
                    return users.push({id: s.id, username: s.username, password: s.password, refreshToken: refreshToken})
                }
            })
            console.log(users)
            res.status(200).json({ accessToken: token, refreshToken: refreshToken })
        }
        else {
            res.status(404).json({ message: "password incorrect" })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})


function generateAccessToken(users){
    return jwt.sign({users}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

app.listen(3000, () => {
    console.log("listening to port 3000")
})