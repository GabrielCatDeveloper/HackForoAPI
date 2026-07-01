import { faker } from "@faker-js/faker";
import { expect } from "chai";
import { RouterTest } from "../utils/router";
import { BaseRouter } from "./base";
import { BaseMiddlewares } from "../middlewares/base";
import { BaseController } from "../controllers/base";
import Topic from "../models/topic";
import { GenerateCampagn } from "../generators/campagn";
import { GenerateUser } from "../generators/user";
import { GenerateTopic } from "../generators/topic";
import { HttpStatus } from "../utils/httpStatusCode";

describe("Router - Topic (generic BaseRouter CRUD)",()=>{
    let topicRouterDef:BaseRouter;
    let router:RouterTest;
    let campaignId:number;
    let userId:string;
    let otherUserId:string;

    before(async()=>{
        topicRouterDef=new BaseRouter('topic',new BaseMiddlewares(Topic),new BaseController(Topic));
        router=RouterTest.Config(topicRouterDef);
        campaignId=await GenerateCampagn().then(r=>r.id);
        userId=await GenerateUser(campaignId).then(r=>r.nickname);
        otherUserId=await GenerateUser(campaignId).then(r=>r.nickname);
    });

    describe("GetAll",()=>{
        it("Should return 401 without a token",async()=>{
            const res=await router.run({method:"Get",path:topicRouterDef.PathGeneric});
            expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should return the list with a valid token",async()=>{
            await GenerateTopic(campaignId,userId);
            const res=await router.run({method:"Get",path:topicRouterDef.PathGeneric,loginData:{nickname:userId,isAdmin:false,campaignId}});
            expect(res.Status).to.be.equals(HttpStatus.Success);
            expect(res.Data).to.be.an("array");
        });
    });

    describe("GetAllById",()=>{
        it("Should return 401 without a token",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const res=await router.run({method:"Get",path:topicRouterDef.PathById,params:{id:topic.id}});
            expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should return 400 invalid ID when the id isn't numeric",async()=>{
            const res=await router.run({method:"Get",path:topicRouterDef.PathById,params:{id:"abc"},loginData:{nickname:userId,isAdmin:false,campaignId}});
            expect(res.Status).to.be.equals(HttpStatus.BadRequest);
            expect(res.Data?.error).to.be.equals('invalid ID');
        });
        it("Should return 400 not exists for an unknown id",async()=>{
            const res=await router.run({method:"Get",path:topicRouterDef.PathById,params:{id:999999999},loginData:{nickname:userId,isAdmin:false,campaignId}});
            expect(res.Status).to.be.equals(HttpStatus.BadRequest);
            expect(res.Data?.error).to.be.equals('not exists');
        });
        it("Should return the topic for an existing id",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const res=await router.run({method:"Get",path:topicRouterDef.PathById,params:{id:topic.id},loginData:{nickname:userId,isAdmin:false,campaignId}});
            expect(res.Status).to.be.equals(HttpStatus.Success);
        });
    });

    describe("Post",()=>{
        it("Should return 401 without a token",async()=>{
            const res=await router.run({method:"Post",path:topicRouterDef.PathGeneric,dto:{}});
            expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should return 400 invalid BODY on an empty body",async()=>{
            const res=await router.run({method:"Post",path:topicRouterDef.PathGeneric,dto:{},loginData:{nickname:userId,isAdmin:false,campaignId}});
            expect(res.Status).to.be.equals(HttpStatus.BadRequest);
            expect(res.Data?.error).to.be.equals('invalid BODY');
        });
        it("Should create a topic with a valid body",async()=>{
            const res=await router.run({
                method:"Post",
                path:topicRouterDef.PathGeneric,
                dto:{campaignId,userId,name:faker.animal.bird(),canAdd:true,deletedAt:null},
                loginData:{nickname:userId,isAdmin:false,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Success);
            expect(res.Data.id).to.be.not.undefined;
        });
    });

    describe("PutById",()=>{
        it("Should return 401 without a token",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const res=await router.run({method:"Put",path:topicRouterDef.PathById,params:{id:topic.id},dto:{name:"x"}});
            expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should return 400 invalid ID when the id isn't numeric",async()=>{
            const res=await router.run({method:"Put",path:topicRouterDef.PathById,params:{id:"abc"},dto:{name:"x"},loginData:{nickname:userId,isAdmin:false,campaignId}});
            expect(res.Status).to.be.equals(HttpStatus.BadRequest);
        });
        it("Should return 400 invalid BODY with a malformed body",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const res=await router.run({method:"Put",path:topicRouterDef.PathById,params:{id:topic.id},dto:{canAdd:"not-a-boolean"},loginData:{nickname:userId,isAdmin:false,campaignId}});
            expect(res.Status).to.be.equals(HttpStatus.BadRequest);
            expect(res.Data?.error).to.be.equals('invalid BODY');
        });
        it("Should return 401 when the user is not the owner nor admin",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const res=await router.run({
                method:"Put",
                path:topicRouterDef.PathById,
                params:{id:topic.id},
                dto:{name:faker.animal.bird()},
                loginData:{nickname:otherUserId,isAdmin:false,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should update when the user is the owner",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const NAME=faker.animal.bird();
            const res=await router.run({
                method:"Put",
                path:topicRouterDef.PathById,
                params:{id:topic.id},
                dto:{name:NAME},
                loginData:{nickname:userId,isAdmin:false,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Success);
            expect(res.Data.name).to.be.equals(NAME);
        });
        it("Should update when the user is admin, even if not the owner",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const NAME=faker.animal.bird();
            const res=await router.run({
                method:"Put",
                path:topicRouterDef.PathById,
                params:{id:topic.id},
                dto:{name:NAME},
                loginData:{nickname:otherUserId,isAdmin:true,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Success);
            expect(res.Data.name).to.be.equals(NAME);
        });
        it("Should set deletedAt when canAdd is set to false",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const res=await router.run({
                method:"Put",
                path:topicRouterDef.PathById,
                params:{id:topic.id},
                dto:{canAdd:false},
                loginData:{nickname:userId,isAdmin:false,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Success);
            expect(res.Data.deletedAt).to.be.not.null;
        });
    });

    describe("DeleteById",()=>{
        it("Should return 401 without a token",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const res=await router.run({method:"Delete",path:topicRouterDef.PathById,params:{id:topic.id}});
            expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should return 400 not exists for an unknown id",async()=>{
            const res=await router.run({method:"Delete",path:topicRouterDef.PathById,params:{id:999999999},loginData:{nickname:userId,isAdmin:false,campaignId}});
            expect(res.Status).to.be.equals(HttpStatus.BadRequest);
        });
        it("Should return 401 when the user is not the owner nor admin",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const res=await router.run({
                method:"Delete",
                path:topicRouterDef.PathById,
                params:{id:topic.id},
                loginData:{nickname:otherUserId,isAdmin:false,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should soft-delete (set deletedAt) when the user is the owner",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const res=await router.run({
                method:"Delete",
                path:topicRouterDef.PathById,
                params:{id:topic.id},
                loginData:{nickname:userId,isAdmin:false,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Success);
            expect(res.Data.deletedAt).to.be.not.null;
        });
        it("Should soft-delete when the user is admin, even if not the owner",async()=>{
            const topic=await GenerateTopic(campaignId,userId);
            const res=await router.run({
                method:"Delete",
                path:topicRouterDef.PathById,
                params:{id:topic.id},
                loginData:{nickname:otherUserId,isAdmin:true,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Success);
        });
    });
});
