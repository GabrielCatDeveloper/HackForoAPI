import { faker } from "@faker-js/faker";
import { GenerateUser } from "./user";
import { default as Message } from "../models/message";




export async function GenerateMessage({userFromId,message,userToId}:{userFromId:string,userToId:string,message?:string}) {

    if(!message){
        message=faker.animal.cat()
    }
    return Message.Create({
        message,userFromId,userToId
    });
}