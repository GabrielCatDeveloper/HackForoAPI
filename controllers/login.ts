import { ClearToken, GetToken, SetToken } from "../Utils/commonLogin";
import { HttpStatus } from "../Utils/httpStatusCode";
import { BasicController } from "./base";
import {type Request,type Response} from "express";



export class LoginController extends BasicController{




    public async Get(req: Request, res: Response){
        const token=await GetToken(req);
        res.send(HttpStatus.Success).json({token});
    }

    public async Post(req: Request, res: Response) {
        const {nickname,isAdmin,campaignId}=req.user;
        await SetToken({nickname,isAdmin,campaignId},res);
        res.status(HttpStatus.Success).send();
    }


    public async Delete(_: Request, res: Response) {
        await ClearToken(res);
        res.status(HttpStatus.Success).send();
    }





}


export default new LoginController();