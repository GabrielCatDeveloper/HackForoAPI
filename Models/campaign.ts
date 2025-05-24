// deno-lint-ignore-file no-explicit-any

import { z, ZodTypeAny } from "zod";
import { BaseModel } from "./base.ts";


//su creación/ edición se hace con el github
export class Campaign extends BaseModel<number,any>{
  protected override get SchemaCreate(): ZodTypeAny {
    return z.object({});
  }
  protected override get SchemaUpdate(): ZodTypeAny {
    return z.object({});
  }
}


export default new Campaign();