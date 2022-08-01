import { google } from 'googleapis'
import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'cookies-next';
import { oauth2ClientFun } from '../../../lib/helper'
import { Token, User } from '../../../database';
import {DBToken, User as UserModel} from '../../../types'
const jwt = require("jsonwebtoken")

const Index = async (req: NextApiRequest, res: NextApiResponse) =>  {
 try {
    
    const {JWT_SECRET} = process.env
    let  code = req.query.code ?? ""
    const  oauth2Client = oauth2ClientFun()
    let  {tokens}  = await oauth2Client.getToken(`${code}`);
    oauth2Client.setCredentials(tokens);
    let respose = await google.oauth2("v2").userinfo.v2.me.get({auth: oauth2Client})

    let user = respose.data

    let dbUser: UserModel = await User.findOne({where: {google_id: user.id}})
    if (!dbUser) {
      dbUser = await User.create({ google_id: user.id, name: user.name, given_name: user.given_name, family_name: user.family_name, picture: user.picture });
    }
    
    let expire_at = new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toISOString();
    let dbToken: DBToken = await Token.create({user_id: dbUser.id, expire_at})
    
    let token = await jwt.sign({id:dbToken.uuid }, JWT_SECRET, { expiresIn: '24h' });

    setCookie('token', token, { req, res, maxAge: 60 * 60 * 24  });
    res.writeHead(302, {Location: "/"});
    res.end();
 } catch (error) {
  res.writeHead(302, { Location: "/login" });
  res.end();
 }
}

export default Index
