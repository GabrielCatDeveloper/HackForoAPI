// deno-lint-ignore-file no-explicit-any

import { z, ZodTypeAny } from "zod";
import { BaseModel } from "./base";
import { createHash } from 'crypto';
import { writeFile } from 'fs/promises';
import { UserBD } from "../prisma/.client";

export class User extends BaseModel<string,UserBD>{
  
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
    let filePath;
    const {pictureFileBase64}=data;
    if(pictureFileBase64){
        data.pictureFileId=crypto.randomUUID();
        filePath=`../uploads/pictures/${data.pictureFileId}.webp`;
      try {
        // Decodificar el base64 a un buffer
        const buffer = Buffer.from(data.pictureFileBase64, 'base64');

        // Guardar el archivo
        await writeFile(filePath, buffer);

      } catch (error) {
        console.error('Error saving file:', error);
        throw new Error('Failed to save file');
      }
    }
  }

  encryptPassword(input: string): string {
    return createHash('sha512').update(input).digest('hex');
  }

}


export default new User();