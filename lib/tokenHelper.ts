import { NextRequest } from "next/server";

export  const validityStateUser = async (req: NextRequest, token: String | undefined) => {
    try {        
        let url = process.env.BASE_URL + "/api/auth/me"
        let response = await fetch(url,  {
            headers: {
                'token': `${token}`
            }
        })
        let status = response.status
        if (status != 200) {
            return false
        }        
        return true
    } catch (error) {
        return false
    }
}