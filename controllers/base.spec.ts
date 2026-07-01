import { expect } from "chai";
import { BaseController } from "./base";
import { HttpStatus } from "../utils/httpStatusCode";

describe("BaseController",()=>{
    function makeRes(){
        const res:any={status:undefined,data:undefined};
        res.status=(code:number)=>{res.status=code;return res;};
        res.json=(data:any)=>{res.data=data;return res;};
        return res;
    }

    describe("getAllById / GetAllById",()=>{
        it("Should return 200 with data on success",async()=>{
            const model:any={GetAllById:async()=>[{id:1}]};
            const controller=new BaseController(model);
            const {status,data,error}=await controller.getAllById("user1",5);
            expect(status).to.be.equals(HttpStatus.Success);
            expect(error).to.be.undefined;
            expect(data).to.be.an("array");
        });
        it("Should return 500 when the model throws",async()=>{
            const model:any={GetAllById:async()=>{throw new Error("boom");}};
            const controller=new BaseController(model);
            const {status,error}=await controller.getAllById("user1");
            expect(status).to.be.equals(HttpStatus.InternalServerError);
            expect(error?.message).to.be.equals("boom");
        });
        it("GetAllById should read the id from req.params and respond via res",async()=>{
            const model:any={GetAllById:async(userId:string,id:string)=>({userId,id})};
            const controller=new BaseController(model);
            const req={params:{id:"7"},user:{nickname:"user1"}};
            const res=makeRes();
            await controller.GetAllById(req,res);
            expect(res.status).to.be.equals(HttpStatus.Success);
            expect(res.data).to.deep.equals({userId:"user1",id:"7"});
        });
    });

    describe("post / Post",()=>{
        it("Should return 200 with created data on success",async()=>{
            const model:any={Create:async(body:any)=>({id:1,...body})};
            const controller=new BaseController(model);
            const {status,data}=await controller.post({name:"x"});
            expect(status).to.be.equals(HttpStatus.Success);
            expect(data.name).to.be.equals("x");
        });
        it("Should return 500 when creation throws",async()=>{
            const model:any={Create:async()=>{throw new Error("invalid");}};
            const controller=new BaseController(model);
            const {status,error}=await controller.post({});
            expect(status).to.be.equals(HttpStatus.InternalServerError);
            expect(error?.message).to.be.equals("invalid");
        });
        it("Post should read the body from req.body and respond via res",async()=>{
            const model:any={Create:async(body:any)=>({id:1,...body})};
            const controller=new BaseController(model);
            const req={body:{name:"x"}};
            const res=makeRes();
            await controller.Post(req,res);
            expect(res.status).to.be.equals(HttpStatus.Success);
            expect(res.data.name).to.be.equals("x");
        });
    });

    describe("putById / PutById",()=>{
        it("Should return 200 with updated data on success",async()=>{
            const model:any={UpdateById:async(id:any,body:any)=>({id,...body})};
            const controller=new BaseController(model);
            const {status,data}=await controller.putById(5,{name:"y"});
            expect(status).to.be.equals(HttpStatus.Success);
            expect(data.name).to.be.equals("y");
        });
        it("Should return 500 when update throws",async()=>{
            const model:any={UpdateById:async()=>{throw new Error("nope");}};
            const controller=new BaseController(model);
            const {status,error}=await controller.putById(5,{});
            expect(status).to.be.equals(HttpStatus.InternalServerError);
            expect(error?.message).to.be.equals("nope");
        });
        it("PutById should read the id from req.params (regression: used to read req.extra)",async()=>{
            const model:any={UpdateById:async(id:any,body:any)=>({id,...body})};
            const controller=new BaseController(model);
            const req={params:{id:"9"},body:{name:"z"}};
            const res=makeRes();
            await controller.PutById(req,res);
            expect(res.status).to.be.equals(HttpStatus.Success);
            expect(res.data).to.deep.equals({id:"9",name:"z"});
        });
    });

    describe("deleteById / DeleteById",()=>{
        it("Should return 200 on success",async()=>{
            const model:any={DeleteById:async(id:any)=>({id,deletedAt:new Date()})};
            const controller=new BaseController(model);
            const {status,data}=await controller.deleteById(3);
            expect(status).to.be.equals(HttpStatus.Success);
            expect(data.id).to.be.equals(3);
        });
        it("Should return 500 when delete throws",async()=>{
            const model:any={DeleteById:async()=>{throw new Error("cannot delete");}};
            const controller=new BaseController(model);
            const {status,error}=await controller.deleteById(3);
            expect(status).to.be.equals(HttpStatus.InternalServerError);
            expect(error?.message).to.be.equals("cannot delete");
        });
        it("DeleteById should read the id from req.params (regression: used to read req.extra)",async()=>{
            const model:any={DeleteById:async(id:any)=>({id})};
            const controller=new BaseController(model);
            const req={params:{id:"11"}};
            const res=makeRes();
            await controller.DeleteById(req,res);
            expect(res.status).to.be.equals(HttpStatus.Success);
            expect(res.data).to.deep.equals({id:"11"});
        });
    });

    describe("GetAll",()=>{
        it("Should call getAllById with req.user.nickname and no parent id",async()=>{
            const model:any={GetAllById:async(userId:string,parentId:any)=>({userId,parentId})};
            const controller=new BaseController(model);
            const req={user:{nickname:"user1"}};
            const res=makeRes();
            await controller.GetAll(req,res);
            expect(res.status).to.be.equals(HttpStatus.Success);
            expect(res.data).to.deep.equals({userId:"user1",parentId:undefined});
        });
        it("Should work even without req.user (anonymous list)",async()=>{
            const model:any={GetAllById:async(userId:string,parentId:any)=>({userId,parentId})};
            const controller=new BaseController(model);
            const req:any={};
            const res=makeRes();
            await controller.GetAll(req,res);
            expect(res.status).to.be.equals(HttpStatus.Success);
        });
    });
});
