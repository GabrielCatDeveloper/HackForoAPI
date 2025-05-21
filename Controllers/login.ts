import { ClearToken, GetToken, SetToken } from "../Utils/commonLogin";
import { HttpStatus } from "../Utils/httpStatusCode";
import { BasicController } from "./base";




export class LoginController extends BasicController{




    public async Get(req:any,res:any){
        let token=GetToken(req);
        res.send(HttpStatus.Success).json({token});
    }

    public async Create(req: any, res: any) {
        const { body } = req;
        const { status, error, data } = await this.create(body);
        if(status === HttpStatus.Success){
            req.user=data;
            await this.Post(req,res);
        }else{
            res.status(status).json(error);
        }
    }

    public async create(dataInput: any) {
        let error, status, data;
        try {
            //creo al usuario del foro
            status = HttpStatus.Success; 

        } catch ({ message }: any) {
            error = { message };
            status = HttpStatus.InternalServerError;
            console.error(`${message} - ${this.constructor.name}.${this.create.name}`);
        }
        return { error, status, data };
    }


    public async Post(req: any, res: any) {
        const {id:userId}=req.user;
        await SetToken(userId,res);
        res.status(HttpStatus.Success).send();
    }


    public async Delete(_: any, res: any) {
        ClearToken(res);
        res.status(HttpStatus.Success).send();
    }





}


export default new LoginController();