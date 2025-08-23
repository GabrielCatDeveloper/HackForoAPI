import { TokenData } from "./commonLogin";
import {  Middleware, Response, ResponseMiddlewares } from "./middleware";


type ControllerMethod=(req:any,res:any)=>Promise<void>;
type MiddlewareMethod=(req:any,res:any,next:()=>Promise<void>|void)=>Promise<void>;

export interface ResponseRun {
    Status:number;
    Data:any;
    middlewares:ResponseMiddlewares;
}

export enum RouterMethods{
    Post,
    Get,
    Put,
    Patch,
    Delete,

}
export class RouterTest {


    private getDic:any;
    private postDic:any;
    private putDic:any;
    private patchDic:any;
    private deleteDic:any;

    constructor(){

        this.getDic={};
        this.postDic={};
        this.putDic={};
        this.patchDic={};
        this.deleteDic={};

    }
    get(path:string,middlewares:MiddlewareMethod[],methodController:ControllerMethod){
        this.getDic[path]={middlewares,methodController};
    }
    post(path:string,middlewares:MiddlewareMethod[],methodController:ControllerMethod){
        this.postDic[path]={middlewares,methodController};
    }
    put(path:string,middlewares:MiddlewareMethod[],methodController:ControllerMethod){
        this.putDic[path]={middlewares,methodController};
    }
    patch(path:any,middlewares:MiddlewareMethod[],methodController:ControllerMethod){
        this.patchDic[path]={middlewares,methodController};
    }
    delete(path:any,middlewares:MiddlewareMethod[],methodController:ControllerMethod){
        this.deleteDic[path]={middlewares,methodController};
    }

    async run({method,path,dto,query,params,token,ipV4,ipV6,userAgent,loginData}:{method:keyof typeof RouterMethods,path:string,dto?:any,query?:any,params?:any,token?:string,ipV4?:string,ipV6?:string,userAgent?:string,loginData?:TokenData}):Promise<ResponseRun>{
        

        let route;
        let dic;
        let response:ResponseMiddlewares;

        if(!dto){
            dto={};
        }
        if(!query){
            query={};
        }
        if(!params){
            params={};
        }

        switch(method){
            case"Post":
                dic=this.postDic;
                break;
            case"Get":
                dic=this.getDic;
                break;
            case"Put":
                dic=this.putDic;
                break;
            case"Patch":
                dic=this.patchDic;
                break;
            case"Delete":
                dic=this.deleteDic;
                break;
            default:
                throw new Error('Invalid Method');
        }
        
        route=dic[path];
        if(!route){
            throw new Error('Invalid Path');
        }


        response=await Middleware.check(route.middlewares,{loginData,dto,query,params,token,ipV4,ipV6,userAgent});
        
        if(response.isFinished){
           response.result=new Response();

           await route.methodController(response.request,response.result);
        }else{
            
            response.result={
                status:response.response.status,
            };
        }
        return {Status:response.result?.status,Data:response.result?.data,middlewares:response};
    }


}
