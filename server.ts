import Routers from "./routers";
import Express, {Application} from 'express';

export class Server{


    constructor(public app: Application=Express()){
        this.Configure();
    }

    Configure(){
        for(let router of Routers){
            console.info(`${router.UrlRel}`);
            router.Configure(Express.Router())
            this.app.use(router.UrlRel, router.Router as Express.Router);
        }
    }





    Start(){
        const port=3455;
        const ip='0.0.0.0';
        console.info(`Listening ${ip}:${port}`);
        this.app.listen(port,ip);
    }



}


export default new Server();