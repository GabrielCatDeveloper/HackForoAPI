import { faker } from "@faker-js/faker";
import Reply from "../models/reply";
import { GenerateTopic } from "./topic";



export async function GenerateReply({parentId,topicId,userId}:{topicId?:number,userId:string,parentId?:number}) {
    
    if(!topicId){
       topicId=await GenerateTopic(undefined,userId).then(r=>r.id); 
    }
    
    return Reply.Create({
        topicId,
        userId,
        parentId,
        title:faker.book.title(),
        message:faker.lorem.paragraph()
    });
}