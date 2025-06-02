import { default as Controller } from "../Controllers/login";
import { default as Middlewares } from "../Middlewares/login";




export class LoginRouter {

    constructor(private router?:any){
        this.Configure(router);
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

