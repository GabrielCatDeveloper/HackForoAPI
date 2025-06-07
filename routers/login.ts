import { default as Controller } from "../controllers/login";
import { default as Middlewares } from "../middlewares/login";




export class LoginRouter {

    constructor(private router?:any){
        if(router){
            this.Configure(router);
        }
    }
    Configure(router?:any){

        if(router){
            this.router=router;
        }

        this.Router.get(this.PathGeneric,Middlewares.GetValue("Get"),Controller.GetMethod("Get"));
        this.Router.post(this.PathGeneric,Middlewares.GetValue("Post"),Controller.GetMethod("Post"));
        this.Router.delete(this.PathGeneric,Middlewares.GetValue("Delete"),Controller.GetMethod("Delete"));


    }

    public get UrlRel(){
        return '/login';
    }

    public get Router(){
        return this.router;
    }
    
    public get PathGeneric(){
        return '/';
    }
    
}

