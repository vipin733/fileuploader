import type { NextApiResponse } from 'next'
import { FileType, NextApiRequestWithUser } from '../../../types'
import wthAuth from "../../../middleware/withAuth"
import{ AWSError } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { FileModel } from '../../../database';
import { s3util } from '../../../lib/helper';
const Busboy = require("busboy")

const { AWS_BUCKET} = process.env

const s3 = s3util();

// const Index = async (req: NextApiRequestWithUser & { [key: string]: any }, res: NextApiResponse) => {

const uploadFile = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    return new Promise<{reqFileName: String; urlData: String, mime_type : String}>( async (response, reject) => {
        let busboy =  Busboy({headers: req.headers});
        let reqFileName: String = ""
        let s3UploadFileName: String = ""
        let mime_type : String = ""

        busboy.on('file', function (fieldname: String, file: File, info: any) {
            const { filename, encoding, mimeType } = info;
            reqFileName = filename
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimeType);
            let s3UpFileName = `${+new Date()}-${filename}`
            s3UploadFileName = `${s3UpFileName}`
            mime_type = mimeType

            s3.upload({
                Bucket: `${AWS_BUCKET}`,
                Key: s3UpFileName,
                Body: file
            }).on("httpUploadProgress", progress => {
                console.log(progress.loaded);
            }).send( async (err: AWSError, data: ManagedUpload.SendData) =>  {
                console.log(err);
                
                if (err) {
                    return reject(err)
                }
                return response({reqFileName, urlData: s3UploadFileName, mime_type })
                
            })
        })

        busboy.on('finish', async () => {
            console.log('Done parsing form!');
        });
        req.pipe(busboy);
    })
}

const Index = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    try {
        let file = await uploadFile(req, res)
        let fileObj = {
            user_id: req.user.id,
            name: `${file.reqFileName}`,
            url: file.urlData,
            mime_type: file.mime_type
        }
        let dbFile: FileType = await FileModel.create(fileObj)
        return res.status(200).json(dbFile);
    } catch (error) {
        return res.status(500).json({status: false})
    }
}

export const config = {
    api: {
        bodyParser: false
    }
};

export default wthAuth(Index)
