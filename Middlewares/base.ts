// deno-lint-ignore-file no-explicit-any ban-types
import { type BaseModel } from "../Models/base.ts";
import { GetToken } from "../Utils/commonLogin.ts";
import { HttpStatus } from "../Utils/httpStatusCode.ts";
import {type Request,type Response} from "express";

export class BasicMiddlewares{
        public get AsAny() {
        return this as any;
    }
    public HasMethod<T extends this>(methodName:keyof T) {
        return methodName in this.AsAny;
    }
    public GetMethod<T extends this>(methodName:keyof T) {
        return this.AsAny[methodName].bind(this);
    }


    public GetValue<T extends this, K extends keyof T>(methodName: K,...params: T[K] extends (...args: any[]) => any ? Parameters<T[K]> : never[]): T[K] extends (...args: any[]) => any ? ReturnType<T[K]> : T[K] {
        const value = (this as any)[methodName];
        if (typeof value === "function") {
            return value(...params);
        }
        return value;
    }
    public async LoadUser(req:Request,res:Response,next:Function){
        const token=await GetToken(req);
        if(token){
            req.user=token;//como es toda la info que necesito la pongo como si fuese el obj user
            next();
        }else{
            res.status(HttpStatus.Unautoritzed).send();
        }
        
    }
}


export class BaseMiddlewares extends BasicMiddlewares {



    constructor(public readonly Model:BaseModel<any,any>){super();}

    public get GetAll(){
        return [this.GetMethod("LoadUser")];
    }
    public get GetAllById(){
        return [
            ...this.GetAll,
            this.GetMethod("CheckId")
        ];
    }
    public get Post(){
        return [
            this.GetMethod("LoadUser"),
            this.CheckBody(true)
        ];
    }
    public get PutById(){
        return [
            this.GetMethod("LoadUser"),
            this.GetMethod("CheckId"),
            this.CheckBody(false),
            this.GetMethod("CanDoIt"),
        ];
    }
    public get DeleteById(){
        return [
            this.GetMethod("LoadUser"),
            this.GetMethod("CheckId"),
            this.GetMethod("CanDoIt"),
        ];
    }

    public async CanDoIt(req:Request,res:Response,next:Function){
        const {userId,isAdmin}=req.user;
        const {id}=req.params;
        
        if(isAdmin || await this.Model.CanDoIt(id,userId)){
            next()
        }else{
            res.status(HttpStatus.Unautoritzed).send();
        }
    }


    public get IdChecker():(id:any)=>boolean{
        return (id:number)=>id!=undefined && Number.isInteger(id);
    }

    public async CheckId(req:Request,res:Response,next:Function){
        const {id}=req.params;
        if(this.IdChecker(id)){
            if(await this.Model.Exists(id)){
                next();
            }else{
                res.status(HttpStatus.BadRequest).json({error:'not exists'});
            }
        }else{
            res.status(HttpStatus.BadRequest).json({error:'invalid ID'});
        }
    }
    public CheckBody(isCreate:boolean){
        const Model=this.Model;
        return async function(req:Request,res:Response,next:Function){

            if(await Model.Check(req.body,isCreate)){
                next();
            }else{
                res.status(HttpStatus.BadRequest).json({error:'invalid BODY'});
            }
        }
    }


}