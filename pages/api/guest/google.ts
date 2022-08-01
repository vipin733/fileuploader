import type { NextApiRequest, NextApiResponse } from 'next'
import { oauth2ClientFun } from '../../../lib/helper';


const Index = (_: NextApiRequest, res: NextApiResponse) => {
  
  const  oauth2Client = oauth2ClientFun()
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile'
  ];
  const authorizationUrl = oauth2Client.generateAuthUrl({
    scope: scopes,
    // include_granted_scopes: true
  });

  res.writeHead(302, { Location: authorizationUrl });
  res.end();

}

export default Index
