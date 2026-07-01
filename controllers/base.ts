import { type BaseModel } from "../models/base";
import { HttpStatus } from "../utils/httpStatusCode";

export class BasicController{
    public get AsAny(){
        return this as any;
    }
    public GetMethod<T extends this>(methodName:keyof T){
        return this.AsAny[methodName].bind(this);
    }
    public HasMethod<T extends this>(methodName:keyof T){
        return methodName in this.AsAny;
    }
}
export class BaseController extends BasicController{
    constructor(public readonly Model:BaseModel<any,any>){super();}
    public async GetAll(req:any,res:any){
        let { status, error, data } = await this.getAllById(req.user?.nickname);
        res.status(status).json(error ?? data);
    }
public async GetAllById(req: any, res: any) {
    let { id } = req.params;
    let { status, error, data } = await this.getAllById(req.user?.nickname, id);
    res.status(status).json(error ?? data);
}
public async getAllById(userId?: string, parentId?: any) {
    let error, status, data;
    try {
        data = await this.Model.GetAllById(userId, parentId);
        status = HttpStatus.Success;
    } catch ({ message }: any) {
        error = { message };
        status = HttpStatus.InternalServerError;
        console.error(`${message} - ${this.constructor.name}.${this.getAllById.name}`);
    }
    return { error, status, data };
}
public async Post(req: any, res: any) {
    let { body } = req;
    let { status, error, data } = await this.post(body);
    res.status(status).json(error ?? data);
}
public async post(body: any) {
    let error, status, data;
    try {
        data = await this.Model.Create(body);
        status = HttpStatus.Success;
    } catch ({ message }: any) {
        error = { message };
        status = HttpStatus.InternalServerError;
        console.error(`${message} - ${this.constructor.name}.${this.post.name}`);
    }
    return { error, status, data };
}
public async PutById(req: any, res: any) {
    let { id } = req.params;
    let { body } = req;
    let { status, error, data } = await this.putById(id, body);
    res.status(status).json(error ?? data);
}
public async putById(id: string, body: any) {
    let error, status, data;
    try {
        data = await this.Model.UpdateById(id, body);
        status = HttpStatus.Success;
    } catch ({ message }: any) {
        error = { message };
        status = HttpStatus.InternalServerError;
        console.error(`${message} - ${this.constructor.name}.${this.putById.name}`);
    }
    return { error, status, data };
}
public async DeleteById(req: any, res: any) {
    let { id } = req.params;
    let { status, error, data } = await this.deleteById(id);
    res.status(status).json(error ?? data);
}
public async deleteById(id: string) {
    let error, status, data;
    try {
        data = await this.Model.DeleteById(id);
        status = HttpStatus.Success;
    } catch ({ message }: any) {
        error = { message };
        status = HttpStatus.InternalServerError;
        console.error(`${message} - ${this.constructor.name}.${this.deleteById.name}`);
    }
    return { error, status, data };
}
}
