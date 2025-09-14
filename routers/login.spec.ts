import { faker } from "@faker-js/faker/.";
import { GenToken } from "../utils/commonLogin";
import { RouterTest } from "../utils/router";
import { default as LoginRouter } from "./login";
import { GenerateCampagn } from "../generators/campagn";
import { GenerateUser } from "../generators/user";
import { expect } from "chai";
import { HttpStatus } from "../utils/httpStatusCode";




describe("Login",()=>{
 
    let router:RouterTest;
    
    let token:string;
    let campaignId:number;
    let nickname:string;


    before(async()=>{
        const {id}=await GenerateCampagn();
        campaignId=id;
        ({nickname}=await GenerateUser(campaignId));
        token=await GenToken({campaignId,isAdmin:true,nickname});
        router=RouterTest.Config(LoginRouter);
    });
    

    it("Should get",async()=>{
        const res=await  router.run({
            method:"Get",
            path:LoginRouter.PathGeneric,
            token,
        });
        expect(res.Status).to.be.equals(HttpStatus.Success);
        expect(res.Data.token).to.be.equals(token);
    });

    it("Shouldn't get",async()=>{
        const res=await  router.run({
            method:"Get",
            path:LoginRouter.PathGeneric,
            token:undefined,
        });
        expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        expect(res.Data?.token).to.be.undefined;
    });
    it("Shouldn't get token is expired",async()=>{
        const token=await GenToken({campaignId,isAdmin:true,nickname},0);
        const res=await  router.run({
            method:"Get",
            path:LoginRouter.PathGeneric,
            token,
        });
        expect(res.Status).to.be.equals(HttpStatus.Unautoritzed);
        expect(res.Data?.token).to.be.undefined;
    });
});