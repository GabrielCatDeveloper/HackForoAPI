import { z,ZodTypeAny } from "zod";
import { BaseModel } from "./base";
import replyView from "./replyView";
import { ReplyBD } from "../prisma/.client";


export class Reply extends BaseModel<number,ReplyBD>{
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

  public override getInclude(userId: string) {
    return {

        views:replyView.getInclude(userId)
      
    }
  }

}


export default new Reply();