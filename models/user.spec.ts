import { faker } from "@faker-js/faker";
import { GenerateCampagn } from "../generators/campagn";
import { GenerateUser } from "../generators/user";
import User from "./user";
import { expect } from "chai";
import path from "path";
import { readFileBase64 } from "../utils/file";


describe("User",()=>{
    let campaingId:number;
    before(async()=>{
        campaingId=await GenerateCampagn().then(r=>r.id);
    });

    describe("",()=>{
        let userId:string;
        beforeEach(async()=>{
            userId=await GenerateUser(campaingId).then(r=>r.nickname);
        });


        describe("Update",()=>{


            it("Should update Nickname",async()=>{
                let after;
                let before=await User.GetFirst({nickname:userId});
                let updated=await User.UpdateById(userId,{nickname:faker.animal.bear()});
                after=await User.GetFirst({nickname:userId});
                expect(after).to.be.null;
                expect(before!.nickname).to.be.equals(userId);
                after=await User.GetFirst({nickname:updated.nickname});
                expect(before!.nickname).to.be.not.equals(after!.nickname);
                expect(updated.nickname).to.be.equals(after!.nickname);
            });

            it("Should update Name",async()=>{
                let after;
                let before=await User.GetFirst({nickname:userId});
                
                await User.UpdateById(userId,{name:faker.animal.bear()});
                after=await User.GetFirst({nickname:userId});
                expect(after).to.be.not.null;
                expect(before!.name).to.be.not.equals(after!.name);
                
            });


            it("Should update Picture",async()=>{
            
                const before=await User.GetFirst({nickname:userId});
                const picturePath=path.join(__dirname,'../testData/pictures/user.webp');
                const pictureFileBase64=await readFileBase64(picturePath);
                const after=await User.UpdateById(userId,{pictureFileBase64});
   
                expect(after).to.be.not.null;
                expect(before!.pictureFileId).to.be.null;
                expect(after.pictureFileId).to.be.not.null;
                
            });
        });











    });


});