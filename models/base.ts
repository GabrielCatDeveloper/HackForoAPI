// deno-lint-ignore-file ban-types no-explicit-any
import { PrismaClient }  from "../prisma/.client";
import {z} from "zod";


interface IClient{
    create:Function;
    findMany:Function;
    findFirst:Function;
    delete:Function;
    update:Function;
    count:Function;
    fields:any;

}


// Carga las variables de entorno desde el archivo .env


const Client=new PrismaClient();

export abstract class BaseModel<TId,TData>{

    protected abstract get SchemaCreate():z.ZodTypeAny;
    protected abstract get SchemaUpdate():z.ZodTypeAny;
    protected get Model(){
        return Client[this.constructor.name.toLocaleLowerCase() as any] as unknown as IClient;
    }
    public get HasDeletedAt():boolean{
        return 'deletedAt' in this.Model.fields;
    }

    public async Check(body:TData,isCreate:boolean):Promise<boolean>{
        const {error}=await (isCreate?this.SchemaCreate:this.SchemaUpdate).safeParseAsync(body);
        return error === undefined;
    }
    public async Exists(id:TId){
        const total=await this.Model.count({where:{[this.IdField]:id}});
        return total>0;
    }
    public get UserFieldCanUpdate(){
        return 'userId';
    }
    public get IdField(){
        return 'id';
    }
    public async CanDoIt(id:TId,userId:string){
        const item=await this.Model.findFirst({where:{id}});
        return item[this.UserFieldCanUpdate] === userId;
    }
    public async Create(body:Partial<TData>){
        const {data}=await this.SchemaCreate.safeParseAsync(body);
        return await this.Model.create({data}) as TData;
    }
    public get CanGetDeleteds(){
        return true;
    }
    public async GetFirst(where:any){
        return await this.Model.findFirst({where}) as TData;
    }
    public getInclude(userId:string):undefined|any{
        return undefined;
    }
    public async GetAllById(userId:string,id?:TId){

        const query:any={include:this.getInclude(userId)};
        if(this.HasDeletedAt && !this.CanGetDeleteds){
            query.where={deletedAt:null};
        }
        if(id){
            if(!query.where){
                query.where={};
            }
            query.where[this.IdField]=id;
        }
        return await this.Model.findMany(query);
    }
    public async UpdateById(id:TId,body:TData){
        const {data}=await this.SchemaUpdate.safeParseAsync(body);
        return await this.Model.update({where:{[this.IdField]:id},data});
    }
    public async DeleteById(id:TId){
        let res:any;
        if(this.HasDeletedAt){
            res= await this.Model.update({where:{[this.IdField]:id},data:{deletedAt:new Date()}});
        }else{
            res= await this.Model.delete({where:{[this.IdField]:id}});
        }
        return res;
    }

}