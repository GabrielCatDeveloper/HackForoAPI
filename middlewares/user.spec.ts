import { expect } from "chai";
import { UserMiddlewares } from "./user";
import { Request, Response } from "../utils/middleware";
import { HttpStatus } from "../utils/httpStatusCode";
import { GenerateCampagn } from "../generators/campagn";
import { GenerateUser } from "../generators/user";

describe("UserMiddlewares",()=>{
    let middlewares:UserMiddlewares;
    let campaignId:number;
    let ownerId:string;
    let otherId:string;

    before(async()=>{
        middlewares=new UserMiddlewares();
        campaignId=await GenerateCampagn().then(r=>r.id);
        ownerId=await GenerateUser(campaignId).then(r=>r.nickname);
        otherId=await GenerateUser(campaignId).then(r=>r.nickname);
    });

    describe("IdChecker (override: nicknames are NOT numeric)",()=>{
        it("Should accept a non-numeric nickname",()=>{
            expect(middlewares.IdChecker("some-nickname")).to.be.true;
        });
        it("Should reject a numeric-looking id",()=>{
            expect(middlewares.IdChecker("12345")).to.be.false;
        });
        it("Should reject undefined",()=>{
            expect(middlewares.IdChecker(undefined as any)).to.be.false;
        });
    });

    describe("CheckId with real nicknames",()=>{
        it("Should call next for an existing nickname",async()=>{
            const req=await Request.Create({dto:{},params:{id:ownerId},cookies:{},query:{},path:''});
            const res=new Response();
            await middlewares.CheckId(req as any,res as any,()=>req.next());
            expect(req.NextCount).to.be.equals(1);
        });
        it("Should respond 400 not exists for an unknown nickname",async()=>{
            const req=await Request.Create({dto:{},params:{id:"totally-unknown-nick"},cookies:{},query:{},path:''});
            const res=new Response();
            await middlewares.CheckId(req as any,res as any,()=>req.next());
            expect(res.status).to.be.equals(HttpStatus.BadRequest);
            expect(res.data?.error).to.be.equals('not exists');
        });
    });

    describe("CanDoIt (inherited from User model: id === userId)",()=>{
        it("Should call next when editing yourself",async()=>{
            const req=await Request.Create({dto:{},params:{id:ownerId},cookies:{},query:{},path:''});
            req.user={nickname:ownerId,isAdmin:false,campaignId} as any;
            const res=new Response();
            await middlewares.CanDoIt(req as any,res as any,()=>req.next());
            expect(req.NextCount).to.be.equals(1);
        });
        it("Should call next when the requester is admin, even for another user",async()=>{
            const req=await Request.Create({dto:{},params:{id:otherId},cookies:{},query:{},path:''});
            req.user={nickname:ownerId,isAdmin:true,campaignId} as any;
            const res=new Response();
            await middlewares.CanDoIt(req as any,res as any,()=>req.next());
            expect(req.NextCount).to.be.equals(1);
        });
        it("Should respond 401 when editing someone else without being admin",async()=>{
            const req=await Request.Create({dto:{},params:{id:otherId},cookies:{},query:{},path:''});
            req.user={nickname:ownerId,isAdmin:false,campaignId} as any;
            const res=new Response();
            await middlewares.CanDoIt(req as any,res as any,()=>req.next());
            expect(res.status).to.be.equals(HttpStatus.Unautoritzed);
        });
    });
});
