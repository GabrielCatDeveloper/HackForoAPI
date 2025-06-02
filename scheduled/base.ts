// deno-lint-ignore-file ban-types no-explicit-any



export interface ITimeToDo{
    hour:number;
    minute:number;
}
export abstract class BaseScheduled{

    private timeout:number|undefined;

    constructor(private interval:number){ }

    get Timeout(){
        return this.timeout;
    }
    set Timeout(value){
        this.timeout=value;
    }
    get Interval():number|undefined{
        return this.interval;
    }
    get Method():Function{
        return this.getMethod.bind(this);
    }
    abstract getMethod():Promise<void>;

    get CanProd(){
        return this.canProd();
    }

    canProd(){
        return true;
    }

    Clear(){
        const timeout=this.Timeout;
        if(timeout){
            clearInterval(timeout);
            this.Timeout=undefined;
        }
    }
    public async InitTest(){}   
    public async Test(){ 
        
        await this.InitTest();
        
        await this.Init();
       
        await this.Method();
    }
    async Init(){}
    async Start(){

        const method=this.Method;

        if(((Deno.env.get("IsDevSide")=='true') || this.CanProd)){

            await this.Init();
            await method();

            if(this.Interval){
                if(!this.Timeout){
                    this.Timeout=setInterval(async()=>{
                        try{
                            await method();

                        }catch({message}:any){
                          console.error(`TimeOut:${this.constructor.name}.${this.Start.name}:${message}`);
                        }
                    },this.Interval);
                }
            }
          

          }
    }

}

export default null;