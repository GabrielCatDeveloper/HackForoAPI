// deno-lint-ignore-file no-explicit-any
import { z , ZodTypeAny } from "zod";
import { BaseModel } from "./base";

interface TData{
    name:string;
    userId:string;
    canAdd:boolean;
    deletedAt:Date|null;
    campaignId:number;

}

export class Topic extends BaseModel<number,TData>{
  protected override get SchemaCreate(): ZodTypeAny {
    return z.object({
        name:z.string().min(1),
        userId:z.string(),
    });
  }
  protected override get SchemaUpdate(): ZodTypeAny {
    return z.object({
        canAdd:z.boolean(),
        deletedAt:z.date().optional()
    }).superRefine(this.setDeletedAt.bind(this));
  }
  setDeletedAt(data:any,_:any){
    if(!data.canAdd && !data.deletedAt){
        data.deletedAt=new Date();
    }else if(data.canAdd){
        data.deletedAt=null;
    }
  }

}


export default new Topic();