import type {  NextApiResponse } from 'next'
import { Token } from '../../../database'
import wthAuth from "../../../middleware/withAuth"
import {  NextApiRequestWithUser } from '../../../types'
import { deleteCookie } from 'cookies-next';

const jwt = require("jsonwebtoken")

const Index = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    try {
        let token = req.cookies["token"]
        const { JWT_SECRET } = process.env
        let tokenData = jwt.verify(token, JWT_SECRET)

        let dbToken = await Token.findOne({where: {uuid:tokenData.id, revoke: false}})
        
        if (!dbToken) {
            return res.status(401).json({ message: "unauthorized" })
        }
        deleteCookie("token")
        await dbToken.update({revoke: true})
        return res.status(200).json({status: true})
    } catch (error) {
        return res.status(401).json({message: "unauthorized"})
    }
}

export default wthAuth(Index)
