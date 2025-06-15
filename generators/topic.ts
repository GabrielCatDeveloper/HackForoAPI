import { faker } from "@faker-js/faker";
import Topic from "../models/topic";
import { GenerateCampagn } from "./campagn";
import { GenerateUser } from "./user";



export async function GenerateTopic(campaignId?:number,userId?:string){
    if(!campaignId){
        campaignId=await GenerateCampagn().then(r=>r.id);
    }
    if(!userId){
        userId=await GenerateUser().then(r=>r.nickname);
    }
    return Topic.Create({
        campaignId,
        userId,
        canAdd:true,
        deletedAt:null,
        name:faker.animal.bird()

    });
}