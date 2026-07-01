import { faker } from "@faker-js/faker";
import { expect } from "chai";
import { RouterTest } from "../utils/router";
import { BaseRouter } from "./base";
import { UserMiddlewares } from "../middlewares/user";
import { BaseController } from "../controllers/base";
import User from "../models/user";
import { GenerateCampagn } from "../generators/campagn";
import { GenerateUser } from "../generators/user";
import { HttpStatus } from "../utils/httpStatusCode";

describe("Router - User",()=>{
    let userRouterDef:BaseRouter;
    let router:RouterTest;
    let campaignId:number;
    let userId:string;
    let otherUserId:string;

    before(async()=>{
        userRouterDef=new BaseRouter('user',new UserMiddlewares(),new BaseController(User));
        router=RouterTest.Config(userRouterDef);
        campaignId=await GenerateCampagn().then(r=>r.id);
        userId=await GenerateUser(campaignId).then(r=>r.nickname);
        otherUserId=await GenerateUser(campaignId).then(r=>r.nickname);
    });

    describe("GetAllById",()=>{
        it("Should return 400 invalid ID when the nickname looks numeric",async()=>{
            const res=await router.run({method:"Get",path:userRouterDef.PathById,params:{id:"12345"},loginData:{nickname:userId,isAdmin:false,campaignId}});
            expect(res.Status).to.be.equals(HttpStatus.BadRequest);
            expect(res.Data?.error).to.be.equals('invalid ID');
        });
        it("Should return 400 not exists for a nickname that doesn't exist",async()=>{
            const res=await router.run({method:"Get",path:userRouterDef.PathById,params:{id:"totally-unknown-nick"},loginData:{nickname:userId,isAdmin:false,campaignId}});
            expect(res.Status).to.be.equals(HttpStatus.BadRequest);
            expect(res.Data?.error).to.be.equals('not exists');
        });
        it("Should return the user when the nickname exists",async()=>{
            const res=await router.run({method:"Get",path:userRouterDef.PathById,params:{id:userId},loginData:{nickname:userId,isAdmin:false,campaignId}});
            expect(res.Status).to.be.equals(HttpStatus.Success);
        });
    });

    describe("Post (create user)",()=>{
        it("Should return 401 without a token",async()=>{
            const res=await router.run({
                method:"Post",
                path:userRouterDef.PathGeneric,
                dto:{campaignId,name:faker.animal.bear(),nickname:faker.internet.username(),passwordHash:"hash"}
            });
            expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should return 400 invalid BODY when required fields are missing",async()=>{
            const res=await router.run({
                method:"Post",
                path:userRouterDef.PathGeneric,
                dto:{name:faker.animal.bear()},
                loginData:{nickname:userId,isAdmin:true,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.BadRequest);
            expect(res.Data?.error).to.be.equals('invalid BODY');
        });
        it("Should create a user with a valid body",async()=>{
            const res=await router.run({
                method:"Post",
                path:userRouterDef.PathGeneric,
                dto:{campaignId,name:faker.animal.bear(),nickname:faker.internet.username(),passwordHash:"hash"},
                loginData:{nickname:userId,isAdmin:true,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Success);
            expect(res.Data.nickname).to.be.not.undefined;
        });
    });

    describe("PutById",()=>{
        it("Should return 401 when trying to edit another user without being admin",async()=>{
            const res=await router.run({
                method:"Put",
                path:userRouterDef.PathById,
                params:{id:otherUserId},
                dto:{name:faker.animal.bear()},
                loginData:{nickname:userId,isAdmin:false,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should update when a user edits themselves",async()=>{
            const NAME=faker.animal.bear();
            const res=await router.run({
                method:"Put",
                path:userRouterDef.PathById,
                params:{id:userId},
                dto:{name:NAME},
                loginData:{nickname:userId,isAdmin:false,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Success);
            expect(res.Data.name).to.be.equals(NAME);
        });
        it("Should update another user when the requester is admin",async()=>{
            const NAME=faker.animal.bear();
            const res=await router.run({
                method:"Put",
                path:userRouterDef.PathById,
                params:{id:otherUserId},
                dto:{name:NAME},
                loginData:{nickname:userId,isAdmin:true,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Success);
            expect(res.Data.name).to.be.equals(NAME);
        });
    });

    describe("DeleteById",()=>{
        it("Should return 401 without a token",async()=>{
            const res=await router.run({method:"Delete",path:userRouterDef.PathById,params:{id:userId}});
            expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should return 401 when deleting another user without being admin",async()=>{
            const res=await router.run({
                method:"Delete",
                path:userRouterDef.PathById,
                params:{id:otherUserId},
                loginData:{nickname:userId,isAdmin:false,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        });
        it("Should delete when a user deletes themselves",async()=>{
            const toDelete=await GenerateUser(campaignId).then(r=>r.nickname);
            const res=await router.run({
                method:"Delete",
                path:userRouterDef.PathById,
                params:{id:toDelete},
                loginData:{nickname:toDelete,isAdmin:false,campaignId}
            });
            expect(res.Status).to.be.equals(HttpStatus.Success);
        });
    });
});
