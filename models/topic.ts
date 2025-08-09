import { z , ZodTypeAny } from "zod";
import { BaseModel } from "./base";
import reply from "./reply";
import { TopicBD } from "../prisma/.client";


export class Topic extends BaseModel<number,TopicBD>{
  protected override get SchemaCreate(): ZodTypeAny {
    return z.object({
        campaignId:z.number(),
        name:z.string().min(1),
        userId:z.string(),
        canAdd:z.boolean(),
        deletedAt:z.date().nullable().optional()
    });
  }
  protected override get SchemaUpdate(): ZodTypeAny {
    return z.object({
        name:z.string().min(1).optional(),
        canAdd:z.boolean().optional(),
        deletedAt:z.date().optional()
    }).superRefine(this.setDeletedAt.bind(this));
  }
  setDeletedAt(data:any,_:any){
    if(data.canAdd!=undefined){
      if(!data.canAdd && !data.deletedAt){
          data.deletedAt=new Date();
      }else if(data.canAdd){
          data.deletedAt=null;
      }
    }
  }

  public override getInclude(userId:string):undefined|any{
    return {
      replies:{
        include:reply.getInclude(userId)
      }
    };
  }

}


export default new Topic();