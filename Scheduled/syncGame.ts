import { join } from "node:path";
import { BaseScheduled } from "./base.ts";
import { Get } from "../Utils/git.ts";




export class SyncGame extends BaseScheduled{
    
    constructor(){
        super(1000*60*5);
    }


    override async getMethod() {
        const PathCampaigns=join(__dirname,'dataGit','campaigns');
        const url=Deno.env.get("CampaignUrlGit")!;     
        
        try{
          await Deno.mkdir(PathCampaigns,{recursive:true});
          await Get(PathCampaigns,url);


          //trato cada archivo y actualizo los datos de la BD
          //si no existe la campaña la creo







        }catch{
          console.error('Intentando solucionar el problema con la sync de las campaings');
          await Deno.remove(PathCampaigns,{recursive:true});
        }
    }

    
}

export default new SyncGame();