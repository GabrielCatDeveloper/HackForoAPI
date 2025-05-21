


export class BaseModel{


    public async Check(body:any):Promise<boolean>{
        return true;
    }

    public async Create(body:any){}
    public async GetAllById(id?:string){}
    public async UpdateById(id:string,body:any){}
    public async DeleteById(id:string){}

}