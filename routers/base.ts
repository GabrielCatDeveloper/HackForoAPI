import { type BaseController } from "../controllers/base";
import { BaseMiddlewares } from "../middlewares/base";



export class BaseRouter {

    
    constructor(
        public readonly UrlRel:string, 
        public readonly Middlewares:BaseMiddlewares,
        public readonly Controller:BaseController,
        private router?:any,
    ){
        if(!this.UrlRel.startsWith('/'))
        {
            this.UrlRel='/'+this.UrlRel;
        }
        if(router){
            this.Configure(router);
        }
    }
    Configure(router?:any){

        if(router){
            this.router=router;
        }
        this.Router.get(this.PathGeneric,this.Middlewares.GetAll,this.Controller.GetMethod("GetAll"));
        this.Router.get(this.PathById,this.Middlewares.GetAllById,this.Controller.GetMethod("GetAllById"));
        this.Router.post(this.PathGeneric,this.Middlewares.Post,this.Controller.GetMethod("Post"));
        this.Router.put(this.PathById,this.Middlewares.PutById,this.Controller.GetMethod("PutById"));
        this.Router.delete(this.PathById,this.Middlewares.DeleteById,this.Controller.GetMethod("DeleteById"));
    }

    public get Router(){
        return this.router!;
    }


    public get PathGeneric(){
        return '/';
    }
    public get PathById(){
        return '/:id';
    }
}