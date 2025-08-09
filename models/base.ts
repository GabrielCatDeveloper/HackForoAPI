// deno-lint-ignore-file ban-types no-explicit-any
import { PrismaClient }  from "../prisma/.client";
import {any, z} from "zod";


interface IClient{
    create:Function;
    findMany:Function;
    findFirst:Function;
    delete:Function;
    update:Function;
    count:Function;
    fields:any;

}

interface TAvoid{
    id:string,
    createdAt:Date,
    deletedAt:Date|null,
    updatedAt:Date|null
};



export type ToTIn<T>={
    [key in keyof T as key extends keyof TAvoid ? never : key]: T[key];
};


type ToWhere<T>=Partial<T&Record<string,any>>;

// Carga las variables de entorno desde el archivo .env


const Client=new PrismaClient();

Client.campaignBD

export abstract class BasicModel<TId,TIn,TOut>{

    protected abstract get SchemaCreate():z.ZodTypeAny;
    protected abstract get SchemaUpdate():z.ZodTypeAny;
    protected get Model(){
        let name:string=this.constructor.name;
        name=name[0].toLocaleLowerCase()+name.substring(1)+'BD';
        return Client[name as any] as unknown as IClient;
    }
    public get HasDeletedAt():boolean{
        return 'deletedAt' in this.Model.fields;
    }

    public async Check(body:TOut,isCreate:boolean):Promise<boolean>{
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
    public get ParentIdField():keyof TOut|undefined{
        return undefined;
    }
    public async CanDoIt(id:TId,userId:string){
        const item=await this.Model.findFirst({where:{id}});
        return item[this.UserFieldCanUpdate] === userId;
    }
    public async Create(body:Partial<TIn>){
        const {data}=await this.SchemaCreate.safeParseAsync(body);
        const res=await this.Model.create({data}) as TOut;
        return res;
    }
    public get CanGetDeleteds(){
        return true;
    }
    public async GetFirst(where:ToWhere<TOut>,include?:Record<string,boolean>):Promise<TOut|null>{
        return this.Model.findFirst({where,include}) as TOut;
    }
    public getInclude(userId:string):undefined|any{
        return undefined;
    }
    public async GetAllById(userId:string,parentId?:number){

        const query:any={include:this.getInclude(userId)};
        if(this.HasDeletedAt && !this.CanGetDeleteds){
            query.where={deletedAt:null};
        }
        if(parentId && this.ParentIdField){
            if(!query.where){
                query.where={};
            }
            query.where[this.ParentIdField]=parentId;
        }
        return this.Model.findMany(query);
    }
    public async UpdateById(id:TId,body:Partial<TIn>):Promise<TOut>{
        const {data}=await this.SchemaUpdate.safeParseAsync(body);
        return  this.Model.update({where:{[this.IdField]:id},data});
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

export abstract class BaseModel<TId,TOut> extends BasicModel<TId,ToTIn<TOut>,TOut>{}
