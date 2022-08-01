import { NextApiResponse } from "next"
import { Token, User } from "../database"
import { DBToken, NextApiRequestWithUser,  User as UserModel } from "../types"
const jwt = require("jsonwebtoken")

const auth = (handler: any) => {
    return async (req: NextApiRequestWithUser, res: NextApiResponse) => {
        try {
            let token = req.cookies.token
            if (!token) {
                token = `${req.headers["token"]}`
            }
            
            if (!token) {
                return res.status(401).json({ message: "unauthorized" })
            }
            
            const { JWT_SECRET } = process.env
            let tokenData = jwt.verify(token, JWT_SECRET)
            
            if (!tokenData.id) {
                return res.status(401).json({ message: "unauthorized" })
            }

            let dbToken: DBToken = await Token.findOne({where: {uuid:tokenData.id, revoke: false}})
            if (!dbToken) {
                return res.status(401).json({ message: "unauthorized" })
            }

            let userDb: UserModel = await User.findOne({where: {id:dbToken.user_id}})

            if (!userDb) {
                return res.status(401).json({ message: "unauthorized" })
            }

        
            let user: UserModel = {
                id: userDb.id,
                google_id: userDb.google_id,
                name: userDb.name,
                given_name: userDb.given_name,
                family_name: userDb.family_name,
                picture: userDb.picture
            }
            req.user = user
            return handler(req, res)
        } catch (error) {
            return res.status(401).json({ message: "unauthorized" })
        }
    }
}

export default auth