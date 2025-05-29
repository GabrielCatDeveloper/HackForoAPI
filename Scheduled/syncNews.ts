import { join } from "node:path";
import { BaseScheduled } from "./base.ts";
import { Get } from "../Utils/git.ts";



export const PathNews=join(__dirname,'dataGit','news');
export class SyncNews extends BaseScheduled{
    constructor(){
        super(1000*60*5);
    }

    override async getMethod() {
       const url=Deno.env.get("NewsUrlGit")!;     
       
       try{
          await Deno.mkdir(PathNews,{recursive:true});
          await Get(PathNews,url);
       }catch{
          console.error('Intentando solucionar el problema con la sync de las news');
          await Deno.remove(PathNews,{recursive:true});
       }
    }
}

export default new SyncNews();