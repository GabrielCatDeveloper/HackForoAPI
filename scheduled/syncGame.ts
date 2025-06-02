import path from "path";
import { BaseScheduled } from "./base";
import { Get } from "../utils/git";

import * as fs from 'fs';

export class SyncGame extends BaseScheduled{
    
    constructor(){
        super(1000*60*5);
    }


    override async getMethod() {
        const PathCampaigns=path.join(__dirname,'dataGit','campaigns');
        const url=process.env.CampaignUrlGit;     
        
        try{
          fs.mkdirSync(PathCampaigns, { recursive: true });
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