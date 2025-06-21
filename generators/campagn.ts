import { faker } from "@faker-js/faker";
import Campaign from "../models/campaign";
import { MessageBD, ReplyBD, TopicBD, UserBD } from "../prisma/.client";
import { GenerateUser } from "./user";
import { isGeneratorFunction } from "util/types";
import { GenerateMessage } from "./message";
import { GenerateTopic } from "./topic";
import { GenerateReply } from "./reply";
import { GenerateReplyView } from "./replyView";



export async function GenerateCampagn(){
    return Campaign.Create({accessToken:faker.string.uuid()});
}

export async function GenerateFullCampagn(){
    let campaign=await GenerateCampagn();
    let users:UserBD[]=[];
    let messages:MessageBD[]=[];
    let topics:TopicBD[]=[];
    let replies:Map<number,ReplyBD[]>=new Map();
    let replieViews:Map<number,Set<string>>=new Map();

    for(let i=0;i<10;i++){
        users.push(await GenerateUser(campaign.id));
    }
    for(let user of users){
        for(let otherUser of users){
            if(user.nickname != otherUser.nickname){
                messages.push(await GenerateMessage({userFromId:user.nickname,userToId:otherUser.nickname}))
            }
        }
    }
    for(let user of users){
        topics.push(await GenerateTopic(campaign.id,user.nickname));
    }
    for(let topic of topics){
        replies.set(topic.id,[]);
        for(let user of users){
            replies.get(topic.id)!.push(await GenerateReply({topicId:topic.id,userId:user.nickname}));
        }
    }
    for(let [_,repliesArr] of replies){
        for(let reply of repliesArr){
            replieViews.set(reply.id,new Set());
            for(let user of users){
                if(faker.datatype.boolean()){
                    await GenerateReplyView({replyId:reply.id,replyUpdatedAt:reply.updatedAt,userId:user.nickname});
                    replieViews.get(reply.id)!.add(user.nickname);
                }
            }
        }
    }

    return {
        campaign,
        users,
        topics,
        messages,
        replies,
        replieViews,
    };
}