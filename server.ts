import Routers from "./Routers";


export class Server{


    constructor(){
        this.Configure();
    }

    Configure(){
        for(let router of Routers){
            console.info(`${router.UrlRel}`);
        }
    }





    Start(){
        console.info(`Listening`);
    }



}


export default new Server();