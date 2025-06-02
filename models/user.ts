// deno-lint-ignore-file no-explicit-any

import { z, ZodTypeAny } from "zod";
import { BaseModel } from "./base";


interface TData{
    nickname:string;
    name:string;
    pictureFileId:string|null;
    passwordHash:string|null;
}
export class User extends BaseModel<string,TData>{
  
  protected override get SchemaCreate(): ZodTypeAny {
    return z.object({});
  }
  protected override get SchemaUpdate(): ZodTypeAny {
    return z.object({
        nickname:z.string().min(1),
        name:z.string(),
        pictureFileBase64:z.string().base64(),
        passwordHash:z.string()
    }).superRefine(this.saveFile.bind(this));
  }
  public override get IdField(){
        return 'nickname';
  }
  public override CanDoIt(id:string,userId:string){
        return Promise.resolve(id === userId);
  }
  
  public async saveFile(data:any,_:any){
    let binaryData;
    let byteArray;
    const {pictureFileBase64}=data;
    if(pictureFileBase64){
        data.pictureFileId=crypto.randomUUID();
        // Decodificar base64 a bytes
        binaryData = atob(pictureFileBase64);

        // Convertir a Uint8Array
        byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
        }
        await Deno.writeFile(`../Uploads/Pictures/${data.pictureFileId}.webp`,byteArray,{createNew:true});
    }
  }

}


export default new User();