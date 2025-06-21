// deno-lint-ignore-file no-explicit-any
import { z, ZodTypeAny } from "zod";
import { BaseModel } from "./base";
import { MessageBD } from "../prisma/.client";


export class Message extends BaseModel<number,MessageBD>{

  protected override get SchemaCreate(): ZodTypeAny {
    return z.object({
        userFromId:z.string(),
        userToId:z.string(),
        message:z.string(),
    });
  }

  protected override get SchemaUpdate(): ZodTypeAny {
    return z.object({
        viewedAt:z.date().optional(),
    }).superRefine(this.setViewedAt.bind(this));
  }

  public override get CanGetDeleteds(){
      return false;
  }
  public override get UserFieldCanUpdate(){
        return 'userToId';
  }
  setViewedAt(data:any,_:any){
    delete data.viewedAt;
    data.viewedAt=new Date();
  }

}


export default new Message();