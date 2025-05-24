import { z, ZodTypeAny } from "zod";
import { BaseModel } from "./base.ts";


interface TData{
    userFromId:string;
    userToId:string;
    message:string;
}
export class Message extends BaseModel<number,TData>{
  protected override get Schema(): ZodTypeAny {
    return z.object({
        userFromId:z.string(),
        userToId:z.string(),
        message:z.string(),
    });
  }

}


export default new Message();