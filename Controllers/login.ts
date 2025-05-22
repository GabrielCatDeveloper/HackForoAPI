import { ClearToken, GetToken, SetToken } from "../Utils/commonLogin";
import { HttpStatus } from "../Utils/httpStatusCode";
import { BasicController } from "./base";




export class LoginController extends BasicController{




    public async Get(req:any,res:any){
        let token=GetToken(req);
        res.send(HttpStatus.Success).json({token});
    }

    public async Post(req: any, res: any) {
        const {nickname,isAdmin}=req.user;
        await SetToken({nickname,isAdmin},res);
        res.status(HttpStatus.Success).send();
    }


    public async Delete(_: any, res: any) {
        ClearToken(res);
        res.status(HttpStatus.Success).send();
    }





}


export default new LoginController();