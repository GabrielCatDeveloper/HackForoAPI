import { GenToken, TokenData } from "./commonLogin";
import { HttpStatus } from "./httpStatusCode";





type TestFunction=(name:string,method:any,timeOut?:number)=>void;

//como los suelo usar para debug pongo un timeout de 10 minutos
function testOnly(name:string,method:any,timeOut:number=10*60*1000){
    return it.only(name,async function(){
            this.timeout(timeOut);
            await method();
    });
}


let testFunction:TestFunction&{only:TestFunction}= function(name:string,method:any,timeOut:number=10*1000){
    return it(name,async function(){
            this.timeout(timeOut);
            await method();
    });
} as any;


testFunction.only=testOnly;

export const test=testFunction;


export class Response{
    public data:any;
    public headers:any;
    public cookies:any;
    public status:number|any;
    constructor(){
        this.data=null;
        this.cookies={};
        this.status=(code:number)=>{
            this.status=code;
            return this;
        };
    }
   
    send(data:any){
        this.data=data;
        return this;
    }
    json(data:any){
        return this.send(data);
    }
    cookie(name:string,value:any,options:any){
        this.cookies[name]={value,options};
        return this;
    }
    end(data?:any){
        if(data){
            this.data=data;
        }
    }
    clearCookie(name:string){
        this.cookies[name]=null;
        return this;
    }

    redirect(url:string){
        this.data={'Location':url};
        this.status=HttpStatus.Redirect;
        return this;
    }

    writeHead(status:number,headers:any){
        this.status=status;
        this.headers=headers;
        return this;
    }
}


export class Request {
    body:any;
    cookies:any;
    headers:any;
    socket:any;
    params:any;
    query:any;
    NextCount:number;
    Init:Promise<Request>;

    public data?:any;
    public user?:{id:string,deletedAt:Date|null,isAdmin:boolean};
   

    public login?:{id:string};

    public language?:any;
    public loginSeviceId?:string;
    public userGroupId?:string;
    public groupId?:string;
    public path?:string;
    public anonimous?:{id:string};
    public isFromOpenServer?:boolean;
 
    public originalUrl?:string;
    public origin?:string;

    constructor({dto,cookies,params,query,path,ipV4,ipV6,userAgent,anonimous,isFromOpenServer}:{dto:any,cookies:any,params:any,query:any,path:string,ipV4?:string|null,ipV6?:string|null,userAgent?:string,anonimous?:any,isFromOpenServer?:boolean}) {
        

        this.NextCount = 0;
        this.query = query ?? {};
        this.cookies = cookies ?? {};
        this.path = path;
        this.headers = {};
        this.headers['user-agent'] = userAgent;
        this.socket = new Socket(ipV4 == null || ipV4 == undefined ? ipV6! : ipV4);
        this.params = params ?? {};
        this.Init = this._Init(dto);
        this.isFromOpenServer=isFromOpenServer;
        this.origin=isFromOpenServer?'testOriginServer.com':undefined;
        this.anonimous=anonimous;

    }
    async _Init(dto:any){
        if(dto instanceof Promise){
            dto=await dto;
        }
        if(dto && dto.prepareToSend){
            dto=dto.prepareToSend();
        }
        this.body = dto ?? {};
        return this;
    }
    public async setToken(token:string) {
        
        if(this.isFromOpenServer){  
            this.headers['authorization']=token;  
        }else{
            this.cookies.token=token;
        }
    }
    public async setRandomToken(data:TokenData) {

        this.setToken(await GenToken(data));

    }
    public next() {
        this.NextCount++;
    }
    
    static async Create({dto,params,cookies,query,ipV4,ipV6,userAgent,path,isFromOpenServer}:{dto:any,params:any,cookies:any,query:any,path:string,ipV4?:string|null,ipV6?:string|null,userAgent?:string,isFromOpenServer?:boolean}){
        return new Request({dto,params,cookies,query,ipV4,ipV6,userAgent,path,isFromOpenServer}).Init;
    }

}

export class Socket{
    _address:string;
    _family:string;
    constructor(address:string|undefined){
        this._address=address!;
        this._family=address?.includes(':')?'IPv6':'IPv4';
    }
    address(){
        return {
            address:this._address,
            family:this._family
        };
    }
}

export class Middleware{

    static async check(middlewares:Function|Function[]|Promise<Function>|Promise<Function>[],{loginData,cookies,dto,query,params,token,ipV4,ipV6,userAgent,bodyToData}:{bodyToData?:boolean,loginData?:TokenData,notInitENV?:boolean,cookies?:any,dto?:any,query?:any,params?:any,token?:string,ipV4?:string|null,ipV6?:string|null,userAgent?:string,isFromOpenServer?:boolean}):Promise<ResponseMiddlewares>{
        let middleware:Function|Promise<Function>;
        let request = await  Request.Create({dto,params,cookies,query,ipV4,ipV6,userAgent,path:''});
        let response=new Response();
        let middlewaresArray:Function[];
        if(loginData){
            await request.setRandomToken(loginData);
        }else if(token){
            await request.setToken(token);
        }
        if(!Array.isArray(middlewares)){
            middlewares=[middlewares as Function];
            middlewaresArray=middlewares as Function[];
        }else{
            middlewaresArray=middlewares as Function[];
        }

        if(bodyToData){
            request.data=request.body;
        }
        for(let i=0;i<middlewares.length && request.NextCount == i && response.data == null;i++){
            middleware = middlewares[i];
            if(middleware instanceof Promise){
                middleware=await middleware;
            }
       
            await middleware(request,response,()=>{
                request.next();
            });
    
           
        }
        
        if(isNaN(response.status)){
            response.status(HttpStatus.Success);
        }
        return {response,request,pos:request.NextCount,isFinished:request.NextCount == middlewares.length,middlewares:middlewaresArray};
    }

}


export interface ResponseMiddlewares{
    response:Response;
    request:Request;
    pos:number;
    isFinished:boolean;
    result?:any;
    middlewares:Function[];

}



