import User from "../Models/user.ts";
import { BaseMiddlewares } from "./base.ts";





export class UserMiddlewares extends BaseMiddlewares{
    constructor(){
        super(User);
    }

    public override get IdChecker(){
        return (id:string)=>id!=undefined && !Number.isInteger(id);
    }
}


export default new UserMiddlewares();