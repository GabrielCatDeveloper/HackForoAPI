// deno-lint-ignore-file no-explicit-any

import { z, ZodTypeAny } from "zod";
import { BaseModel } from "./base";
import { default as Topic } from "./topic";
import { CampaignBD } from "../prisma/.client";


//su creación/ edición se hace con el github
export class Campaign extends BaseModel<number,CampaignBD>{
  protected override get SchemaCreate(): ZodTypeAny {
    return z.object({accessToken:z.string().nullable()});
  }
  protected override get SchemaUpdate(): ZodTypeAny {
    return this.SchemaCreate;
  }
  public async CanDoIt(_1:number,_2:string){
      return false;
  }
  public override getInclude(userId: string) {
    return {
      topics:{
        include:Topic.getInclude(userId)
      }
    }
  }
}


export default new Campaign();