import { z,ZodTypeAny } from "zod";
import { BaseModel } from "./base.ts";


interface TData{
    id:number;
}
export class Reply extends BaseModel<number,TData>{
  protected override get SchemaCreate(): ZodTypeAny {
    return z.object({
        topicId:z.number(),
        userId:z.string(),
        title:z.string().optional(),
        message:z.string(),
        parentId:z.number().optional(),
    });
  }
  protected override get SchemaUpdate(): ZodTypeAny {
    return z.object({
        title:z.string().optional(),
        message:z.string().optional(),
    });
  }

}


export default new Reply();