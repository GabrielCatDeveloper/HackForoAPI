import { default as Controller } from "../controllers/login";
import { default as Middlewares } from "../middlewares/login";
import { IRouter } from "../utils/router";




export class LoginRouter {

    constructor(private router?:IRouter){
        if(router){
            this.Configure(router);
        }
    }
    Configure(router?:IRouter){

        if(router){
            this.router=router;
        }

        if(!this.router)throw new Error("Router is required!");

        this.Router.get(this.PathGeneric,Middlewares.GetValue("Get"),Controller.GetMethod("Get"));
        this.Router.post(this.PathGeneric,Middlewares.GetValue("Post"),Controller.GetMethod("Post"));
        this.Router.delete(this.PathGeneric,Middlewares.GetValue("Delete"),Controller.GetMethod("Delete"));


    }

    public get UrlRel(){
        return '/login';
    }

    public get Router(){
        return this.router!;
    }
    
    public get PathGeneric(){
        return '/';
    }
    
}

export default new LoginRouter();