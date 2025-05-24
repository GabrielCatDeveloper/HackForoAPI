// deno-lint-ignore-file no-explicit-any

import { z, ZodTypeAny } from "zod";
import { BaseModel } from "./base.ts";


//su creación/ edición se hace con el github
export class Forum extends BaseModel<number,any>{
  protected override get Schema(): ZodTypeAny {
    return z.object({});
  }

}


export default new Forum();