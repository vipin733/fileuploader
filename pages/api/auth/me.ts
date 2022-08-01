import type {  NextApiResponse } from 'next'
import wthAuth from "../../../middleware/withAuth"
import { NextApiRequestWithUser, User } from '../../../types'

const Index = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        return res.status(401).json({message: "unauthorized"})
    }
}

export default wthAuth(Index)
