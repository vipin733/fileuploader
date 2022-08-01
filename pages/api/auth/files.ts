import type { NextApiResponse } from 'next'
import { FileModel } from '../../../database'
import { FileType, NextApiRequestWithUser } from '../../../types'
import wthAuth from "../../../middleware/withAuth"

const Index = async (req: NextApiRequestWithUser, res: NextApiResponse<FileType[]>) => {
    let files: FileType[] = []
    try {
        let user = req.user        
        files = await FileModel.findAll({where: {user_id:user.id}})
        return res.status(200).json(files)
    } catch (error) {
       return res.status(200).json(files)
    }
}


export default wthAuth(Index)
