import { faker } from "@faker-js/faker";
import { GenerateUser } from "./user";
import { default as Message } from "../models/message";




export async function GenerateMessage({userFromId,message,userToId}:{userFromId?:string,userToId?:string,message?:string}) {
    if(!userFromId){
        userFromId=await GenerateUser().then(r=>r.nickname);
    }
    if(!userToId){
        userToId=await GenerateUser().then(r=>r.nickname);
    }
    if(!message){
        message=faker.animal.cat()
    }
    return Message.Create({
        message,userFromId,userToId
    });
}