import { BaseModel } from "../Models/base";
import { HttpStatus } from "../Utils/httpStatusCode";


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
}


export class BaseMiddlewares extends BasicMiddlewares {



    constructor(public readonly Model:BaseModel){super();}

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
            this.GetMethod("CheckBody")
        ];
    }
    public get PutById(){
        return [
            this.GetMethod("LoadUser"),
            this.GetMethod("CheckId"),
            this.GetMethod("CheckBody")
        ];
    }
    public get DeleteById(){
        return [
            this.GetMethod("LoadUser"),
            this.GetMethod("CheckId")
        ];
    }

    public async LoadUser(req:any,res:any,next:any){
        next();
    }

    public async CheckId(req:any,res:any,next:any){
        let {id}=req.params;
        if(id && Number.isInteger(id) && id.trim() !== ''){
            next();
        }else{
            res.status(HttpStatus.BadRequest).json({error:'invalid ID'});
        }
    }

    public async CheckBody(req:any,res:any,next:any){

        if(await this.Model.Check(req.body)){
            next();
        }else{
            res.status(HttpStatus.BadRequest).json({error:'invalid BODY'});
        }
    }


}