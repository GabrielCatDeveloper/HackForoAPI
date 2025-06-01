import { create, verify, getNumericDate } from "djwt";
import {type Request,type Response} from "express";
import { load } from "@std/dotenv";


const env = await load();


const LoginCookie='token';

type TokenData={nickname:string,isAdmin:boolean,campaignId:number};
const JWT_ALGORITHM = "HS256";

export async function SetToken(data:TokenData,res:Response){
    
    const expiresInHours=24*365;
    const options= {
            sameSite:'None',
            httpOnly:true,
            maxAge:1000*60*60*expiresInHours,
            secure:true
    };
    const payload = {
        ...data,
        exp: getNumericDate(new Date(Date.now() + 1000 * 60 * expiresInHours)), 
    };
    const token= await create({ alg: JWT_ALGORITHM, typ: "JWT" }, payload, env.JwtSecret);
    res.cookie(LoginCookie, token, options);

}

export function ClearToken(res:Response){
    const options={httpOnly:true,secure:true};

    res.clearCookie(LoginCookie,options);
}

export async function GetToken(req:Request):Promise<TokenData|undefined>{
    const token= req.cookies[LoginCookie];
    return await verify(token, env.JwtSecret, JWT_ALGORITHM)
                                        .catch(()=>undefined);
}