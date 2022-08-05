import type {  NextApiResponse } from 'next'
import { FileModel } from '../../../database'
import { s3util } from '../../../lib/helper';
import wthAuth from "../../../middleware/withAuth"
import {  FileType, NextApiRequestWithUser } from '../../../types'

const s3 = s3util();

const Index = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    try {
        let uuid = req.query.file
        if (!uuid) {
            return res.status(422).json({message: "file id required"})
        }

        let user_id = req.user.id

        let fileModel: FileType = await FileModel.findOne({where: {uuid, user_id}})
        if (!fileModel) {
            return res.status(422).json({message: "invalid file"})
        }

        let fileurl = fileModel.url.toString()
        const { AWS_BUCKET} = process.env
    

        const signedUrlExpireSeconds = 60 * 5

        const url = s3.getSignedUrl('getObject', {
            Bucket: `${AWS_BUCKET}`,
            Key: fileurl,
            Expires: signedUrlExpireSeconds
        });

        // res.setHeader("")
        res.writeHead(302, {Location: url});
        res.end();
    } catch (error) {
        return res.status(422).json({message: "invalid file"})
    }
}

export default wthAuth(Index)
