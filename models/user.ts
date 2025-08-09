// deno-lint-ignore-file no-explicit-any

import { z, ZodTypeAny } from "zod";
import { BasicModel, ToTIn } from "./base";
import { createHash } from 'crypto';
import { writeFile } from 'fs/promises';
import { UserBD } from "../prisma/.client";
import path from "path";


type TIn=ToTIn<Omit<UserBD,'pictureFileId'>&{pictureFileBase64:string}>;
export class User extends BasicModel<string,TIn,UserBD>{
  
  protected override get SchemaCreate(): ZodTypeAny {
    return z.object({
        campaignId:z.number(),
        nickname:z.string().min(1),
        name:z.string(),
        pictureFileBase64:z.string().base64().optional(),
        passwordHash:z.string()
    }).superRefine(this.saveFile.bind(this));
  }
  protected override get SchemaUpdate(): ZodTypeAny {
    return z.object({
        nickname:z.string().min(1).optional(),
        name:z.string().optional(),
        pictureFileBase64:z.string().base64().optional(),
        passwordHash:z.string().optional()
    }).superRefine(this.saveFile.bind(this));
  }
  public override get IdField(){
        return 'nickname';
  }
  public get ParentIdField():keyof UserBD|undefined{
      return 'campaignId';
  }
  public override CanDoIt(id:string,userId:string){
        return Promise.resolve(id === userId);
  }
  
  public async saveFile(data:any,ctx:any){
    let filePath;
    let buffer;
    let cleanBase64;
    const {pictureFileBase64}=data as TIn;

    if(pictureFileBase64){
        data.pictureFileId=crypto.randomUUID();
        delete data.pictureFileBase64;
        filePath=path.join(__dirname,`../uploads/pictures/${data.pictureFileId}.webp`);
      try {
        cleanBase64 = pictureFileBase64.replace(/^data:[^;]+;base64,/, '');
        // Decodificar el base64 a un buffer
        buffer = Buffer.from(cleanBase64, 'base64');

        // Guardar el archivo
        await writeFile(filePath, buffer);

      } catch (error) {
        console.error('Error saving file:', error);
        ctx.addIssue({
            code:z.ZodIssueCode.custom,
            path:['User','pictureFileBase64'],
            message:`Error saving file`,
        });
      }
    }
  }

  encryptPassword(input: string): string {
    return createHash('sha512').update(input).digest('hex');
  }

}


export default new User();