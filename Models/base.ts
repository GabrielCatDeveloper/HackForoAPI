// deno-lint-ignore-file ban-types no-explicit-any
import { PrismaClient } from "prisma/client";
import {z} from "zod";

interface IClient{
    create:Function;
    findMany:Function;
    findFirst:Function;
    delete:Function;
    update:Function;

}
const Client=new PrismaClient();

export abstract class BaseModel<TId,TData>{

    protected abstract get SchemaCreate():z.ZodTypeAny;
    protected abstract get SchemaUpdate():z.ZodTypeAny;
    protected get Model(){
        return Client[this.constructor.name.toLocaleLowerCase() as any] as unknown as IClient;
    }

    public async Check(body:TData):Promise<boolean>{
        const {error}=await this.SchemaCreate.safeParseAsync(body);
        return error === undefined;
    }

    public async Create(body:TData){
        const {data}=await this.SchemaCreate.safeParseAsync(body);
        return await this.Model.create({data});
    }
    public async GetAllById(id?:TId){

        const query:any={};
        if(id){
            query.where={id};
        }
        return await this.Model.findMany(query);
    }
    public async UpdateById(id:TId,body:TData){
        const {data}=await this.SchemaUpdate.safeParseAsync(body);
        return await this.Model.update({where:{id},data});
    }
    public async DeleteById(id:TId){
        return await this.Model.delete({where:{id}})
    }

}