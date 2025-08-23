

import * as jwt from 'jsonwebtoken';





const LoginCookie='token';

export type TokenData={nickname:string,isAdmin:boolean,campaignId:number};
const JWT_ALGORITHM = "HS256";

export async function GenToken(data:TokenData){
    
    const expiresInHours=24*365;

    const payload = {
        ...data,
        exp: new Date(Date.now() + 1000 * 60 * expiresInHours), 
    };
    const token= jwt.sign({ alg: JWT_ALGORITHM, typ: "JWT" },process.env.JwtSecret, payload);
    return token;

}


export async function SetToken(data:TokenData,res:any){
    const expiresInHours=24*365;
    const options= {
            sameSite:'None',
            httpOnly:true,
            maxAge:1000*60*60*expiresInHours,
            secure:true
    };
    res.cookie(LoginCookie,await GetToken(data), options);

}

export function ClearToken(res:any){
    const options={httpOnly:true,secure:true};

    res.clearCookie(LoginCookie,options);
}

export async function GetToken(req:any):Promise<TokenData|undefined>{
    const token= req.cookies[LoginCookie];
    return  new Promise((resolve, reject) => {
        
        jwt.verify(token,process.env.JwtSecret, (err:any, decoded:any) => { 

            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}