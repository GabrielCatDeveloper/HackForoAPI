// deno-lint-ignore-file ban-types
import { default as User } from "../Models/user";
import { HttpStatus } from "../Utils/httpStatusCode";
import { BasicMiddlewares } from "./base";

import {type Request,type Response} from "express";



export class LoginMiddlewares extends BasicMiddlewares{



    public get Get(){
        return [this.GetMethod("LoadUser")];
    }

    public get Post(){
        return [this.GetMethod("CheckLogin")];
    }

    
    public get Delete(){
        return [this.GetMethod("LoadUser")];
    }

    
    async CheckLogin(req:Request,res:Response,next:Function){
        const {nickname,passwordHash,campagneId}=req.body??{};
        let user;
        if(!nickname || passwordHash || campagneId){
            res.status(HttpStatus.BadRequest).send();
        }else{
            user=await User.GetFirst({nickname,passwordHash,campagneId});
            if(user){
                req.user=user;
                next();
            }else{
                res.status(HttpStatus.BadRequest).send();
            }
        }
    }




}

export default new LoginMiddlewares();