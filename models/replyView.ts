// deno-lint-ignore-file no-explicit-any

import { z , ZodTypeAny } from "zod";
import { BaseModel } from "./base";

interface TData{
    replyId:number;
    userId:string;
    replyUpdatedAt:Date;
}

export class ReplyView extends BaseModel<number,TData>{
  protected override get SchemaCreate(): ZodTypeAny {
    return z.object({
        replyId:z.number(),
        userId:z.string(),
        replyUpdatedAt:z.date(),
    }).superRefine(this.notExists.bind(this));
  }
  protected override get SchemaUpdate(): ZodTypeAny {
    return z.object({});
  }
  public get ParentIdField():keyof TData|undefined{
      return 'replyId';
  }
  async notExists(data:any,ctx:any){
    const item=await this.Model.findFirst({where:data});
    if(item){
      ctx.addIssue({
        code:z.ZodIssueCode.custom,
        message:`Already viewed!`,
      });
    }
  }
    public override getInclude(userId: string) {
    return {
        where:{userId},
        select:{createdAt:true,replyUpdatedAt:true}
    }
  }

}


export default new ReplyView();