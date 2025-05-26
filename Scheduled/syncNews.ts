import { BaseScheduled } from "./base.ts";




export class SyncNews extends BaseScheduled{
    constructor(){
        super(1000*60*5);
    }

    override getMethod(): Promise<void> {
      throw new Error("Method not implemented.");
    }
}

export default new SyncNews();