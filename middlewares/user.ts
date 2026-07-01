import User from "../models/user";
import { BaseMiddlewares } from "./base";

export class UserMiddlewares extends BaseMiddlewares{
    constructor(){
        super(User);
    }
    public override get IdChecker(){
        return (id:string)=>id!=undefined && !Number.isInteger(Number(id));
    }
}
export default new UserMiddlewares();
