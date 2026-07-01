import { expect } from "chai";
import { LoginMiddlewares } from "./login";
import { Request, Response } from "../utils/middleware";
import { HttpStatus } from "../utils/httpStatusCode";
import { GenerateCampagn } from "../generators/campagn";
import { GenerateUser } from "../generators/user";

describe("LoginMiddlewares.CheckLogin",()=>{
    let middlewares:LoginMiddlewares;
    let campaignId:number;
    let nickname:string;
    let passwordHash:string;

    before(async()=>{
        middlewares=new LoginMiddlewares();
        campaignId=await GenerateCampagn().then(r=>r.id);
        const user=await GenerateUser(campaignId);
        nickname=user.nickname;
        passwordHash=user.passwordHash;
    });

    it("Should respond 400 when nickname is missing",async()=>{
        const req=await Request.Create({dto:{passwordHash,campaignId},params:{},cookies:{},query:{},path:''});
        const res=new Response();
        await middlewares.CheckLogin(req as any,res as any,()=>req.next());
        expect(res.status).to.be.equals(HttpStatus.BadRequest);
        expect(req.NextCount).to.be.equals(0);
    });

    it("Should respond 400 when passwordHash is missing",async()=>{
        const req=await Request.Create({dto:{nickname,campaignId},params:{},cookies:{},query:{},path:''});
        const res=new Response();
        await middlewares.CheckLogin(req as any,res as any,()=>req.next());
        expect(res.status).to.be.equals(HttpStatus.BadRequest);
        expect(req.NextCount).to.be.equals(0);
    });

    it("Should respond 400 when campaignId is missing",async()=>{
        const req=await Request.Create({dto:{nickname,passwordHash},params:{},cookies:{},query:{},path:''});
        const res=new Response();
        await middlewares.CheckLogin(req as any,res as any,()=>req.next());
        expect(res.status).to.be.equals(HttpStatus.BadRequest);
        expect(req.NextCount).to.be.equals(0);
    });

    it("Should respond 400 when the body is empty",async()=>{
        const req=await Request.Create({dto:{},params:{},cookies:{},query:{},path:''});
        const res=new Response();
        await middlewares.CheckLogin(req as any,res as any,()=>req.next());
        expect(res.status).to.be.equals(HttpStatus.BadRequest);
    });

    it("Should respond 400 when the passwordHash doesn't match",async()=>{
        const req=await Request.Create({dto:{nickname,passwordHash:'wrong-hash',campaignId},params:{},cookies:{},query:{},path:''});
        const res=new Response();
        await middlewares.CheckLogin(req as any,res as any,()=>req.next());
        expect(res.status).to.be.equals(HttpStatus.BadRequest);
    });

    it("Should respond 400 when the campaignId doesn't match the user",async()=>{
        const otherCampaignId=await GenerateCampagn().then(r=>r.id);
        const req=await Request.Create({dto:{nickname,passwordHash,campaignId:otherCampaignId},params:{},cookies:{},query:{},path:''});
        const res=new Response();
        await middlewares.CheckLogin(req as any,res as any,()=>req.next());
        expect(res.status).to.be.equals(HttpStatus.BadRequest);
    });

    it("Should call next and set req.user with valid credentials",async()=>{
        const req=await Request.Create({dto:{nickname,passwordHash,campaignId},params:{},cookies:{},query:{},path:''});
        const res=new Response();
        await middlewares.CheckLogin(req as any,res as any,()=>req.next());
        expect(req.NextCount).to.be.equals(1);
        expect((req.user as any)?.nickname).to.be.equals(nickname);
    });
});
