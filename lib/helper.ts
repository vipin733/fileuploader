import {google} from "googleapis"
import { OAuth2Client } from 'google-auth-library';
import AWS from 'aws-sdk';

export const oauth2ClientFun = () : OAuth2Client =>  {
    const { GOOGLE_KEY, GOOGLE_SECRET, BASE_URL } = process.env
    const oauth2Client = new google.auth.OAuth2(
    GOOGLE_KEY,
    GOOGLE_SECRET,
    `${BASE_URL}/api/guest/callback`
    );
    return oauth2Client
}

export const s3util = (): AWS.S3 => {
    const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION} = process.env
    const s3 = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        region: AWS_DEFAULT_REGION
    });

    return s3
}
