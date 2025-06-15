import { default as Reply } from "../models/reply";
import { default as ReplyView } from "../models/replyView";
import { GenerateReply } from "./reply";
import { GenerateUser } from "./user";




export async function GenerateReplyView({replyId,userId,replyUpdatedAt}:{replyId?:number,userId?:string,replyUpdatedAt?:Date}){
    if(!userId){
        userId=await GenerateUser().then(r=>r.nickname);
    }
    if(!replyId){
        replyId=await GenerateReply({userId}).then(r=>r.id);
    }
    if(!replyUpdatedAt){
        replyUpdatedAt=await Reply.GetFirst({id:replyId}).then(r=>r.updatedAt);
    }
    return ReplyView.Create({
        replyId,
        replyUpdatedAt,
        userId
    });
}