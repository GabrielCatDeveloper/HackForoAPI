import { expect } from "chai";
import { BaseMiddlewares } from "./base";
import { Request, Response } from "../utils/middleware";
import { HttpStatus } from "../utils/httpStatusCode";
import Topic from "../models/topic";
import { GenerateCampagn } from "../generators/campagn";
import { GenerateUser } from "../generators/user";
import { GenerateTopic } from "../generators/topic";

describe("BaseMiddlewares",()=>{
    let middlewares:BaseMiddlewares;
    let campaignId:number;
    let ownerId:string;
    let otherId:string;

    before(async()=>{
        middlewares=new BaseMiddlewares(Topic);
        campaignId=await GenerateCampagn().then(r=>r.id);
        ownerId=await GenerateUser(campaignId).then(r=>r.nickname);
        otherId=await GenerateUser(campaignId).then(r=>r.nickname);
    });

    describe("IdChecker",()=>{
        it("Should accept an integer-like id",()=>{
            expect(middlewares.IdChecker("5")).to.be.true;
        });
        it("Should accept a real number too",()=>{
            expect(middlewares.IdChecker(5)).to.be.true;
        });
        it("Should reject undefined",()=>{
            expect(middlewares.IdChecker(undefined as any)).to.be.false;
        });
        it("Should reject a non numeric id",()=>{
            expect(middlewares.IdChecker("abc")).to.be.false;
        });
        it("Should reject a decimal id",()=>{
            expect(middlewares.IdChecker("1.5")).to.be.false;
        });
    });

    describe("CheckId",()=>{
        it("Should respond 400 invalid ID for a non numeric id",async()=>{
            const req=await Request.Create({dto:{},params:{id:"abc"},cookies:{},query:{},path:''});
            const res=new Response();
            await middlewares.CheckId(req as any,res as any,()=>req.next());
            expect(res.status).to.be.equals(HttpStatus.BadRequest);
            expect(res.data?.error).to.be.equals('invalid ID');
        });
        it("Should respond 400 not exists for a valid but unknown id",async()=>{
            const req=await Request.Create({dto:{},params:{id:999999999},cookies:{},query:{},path:''});
            const res=new Response();
            await middlewares.CheckId(req as any,res as any,()=>req.next());
            expect(res.status).to.be.equals(HttpStatus.BadRequest);
            expect(res.data?.error).to.be.equals('not exists');
        });
        it("Should call next for a valid existing id",async()=>{
            const topic=await GenerateTopic(campaignId,ownerId);
            const req=await Request.Create({dto:{},params:{id:topic.id},cookies:{},query:{},path:''});
            const res=new Response();
            await middlewares.CheckId(req as any,res as any,()=>req.next());
            expect(req.NextCount).to.be.equals(1);
        });
    });

    describe("CanDoIt",()=>{
        it("Should call next when the user is admin",async()=>{
            const topic=await GenerateTopic(campaignId,ownerId);
            const req=await Request.Create({dto:{},params:{id:topic.id},cookies:{},query:{},path:''});
            req.user={nickname:otherId,isAdmin:true,campaignId} as any;
            const res=new Response();
            await middlewares.CanDoIt(req as any,res as any,()=>req.next());
            expect(req.NextCount).to.be.equals(1);
        });
        it("Should call next when the user is the owner",async()=>{
            const topic=await GenerateTopic(campaignId,ownerId);
            const req=await Request.Create({dto:{},params:{id:topic.id},cookies:{},query:{},path:''});
            req.user={nickname:ownerId,isAdmin:false,campaignId} as any;
            const res=new Response();
            await middlewares.CanDoIt(req as any,res as any,()=>req.next());
            expect(req.NextCount).to.be.equals(1);
        });
        it("Should respond 401 when the user is neither owner nor admin",async()=>{
            const topic=await GenerateTopic(campaignId,ownerId);
            const req=await Request.Create({dto:{},params:{id:topic.id},cookies:{},query:{},path:''});
            req.user={nickname:otherId,isAdmin:false,campaignId} as any;
            const res=new Response();
            await middlewares.CanDoIt(req as any,res as any,()=>req.next());
            expect(res.status).to.be.equals(HttpStatus.Unautoritzed);
        });
    });

    describe("CheckBody",()=>{
        it("Should respond 400 invalid BODY for an empty create body",async()=>{
            const req=await Request.Create({dto:{},params:{},cookies:{},query:{},path:''});
            const res=new Response();
            await middlewares.CheckBody(true)(req as any,res as any,()=>req.next());
            expect(res.status).to.be.equals(HttpStatus.BadRequest);
            expect(res.data?.error).to.be.equals('invalid BODY');
        });
        it("Should call next for a valid create body",async()=>{
            const req=await Request.Create({dto:{campaignId,userId:ownerId,name:"Test topic",canAdd:true},params:{},cookies:{},query:{},path:''});
            const res=new Response();
            await middlewares.CheckBody(true)(req as any,res as any,()=>req.next());
            expect(req.NextCount).to.be.equals(1);
        });
        it("Should call next for a valid (partial) update body",async()=>{
            const req=await Request.Create({dto:{name:"Renamed topic"},params:{},cookies:{},query:{},path:''});
            const res=new Response();
            await middlewares.CheckBody(false)(req as any,res as any,()=>req.next());
            expect(req.NextCount).to.be.equals(1);
        });
    });

    describe("LoadUser",()=>{
        it("Should respond 401 without a token",async()=>{
            const req=await Request.Create({dto:{},params:{},cookies:{},query:{},path:''});
            const res=new Response();
            await middlewares.LoadUser(req as any,res as any,()=>req.next());
            expect(res.status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should call next and set req.user with a valid token",async()=>{
            const req=await Request.Create({dto:{},params:{},cookies:{},query:{},path:''});
            await req.setRandomToken({nickname:ownerId,isAdmin:false,campaignId});
            const res=new Response();
            await middlewares.LoadUser(req as any,res as any,()=>req.next());
            expect(req.NextCount).to.be.equals(1);
            expect((req.user as any)?.nickname).to.be.equals(ownerId);
        });
    });
});
