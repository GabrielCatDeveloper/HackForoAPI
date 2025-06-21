import { default as Reply } from "../models/reply";
import { default as ReplyView } from "../models/replyView";
import { GenerateReply } from "./reply";



export async function GenerateReplyView({replyId,userId,replyUpdatedAt}:{replyId?:number,userId:string,replyUpdatedAt?:Date}){

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