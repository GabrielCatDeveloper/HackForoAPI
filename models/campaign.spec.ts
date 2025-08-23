import Campaign from "./campaign";
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { GenerateFullCampagn } from "../generators/campagn";
import  Message  from "./message";
import  Reply  from "./reply";
import  Topic  from "./topic";


describe("Campaign",()=>{

    it("Should get include ok",()=>{
        const include=Campaign.getInclude("sora13");
        expect(include?.topics?.include?.replies?.include?.views).to.be.not.undefined;
    });

    it.only("should generate all campaign",async()=>{
        const {
            campaign,
            messages,
            replieViews,
            replies,
            topics,
            users
        }=await GenerateFullCampagn();
        const ACCESS_TOKEN="newToken";
        const TITLE="newTitle";
        const MESSAGE="newMessage";
        const  NAME="newName";
        let message,reply,topic;
        const replyToCheck=Array.from(replies.values())[0][0];
        let campagn=await Campaign.UpdateById(campaign.id,{accessToken: ACCESS_TOKEN});
        expect(campagn.accessToken).to.be.equals(ACCESS_TOKEN);
        message=await Message.UpdateById(messages[0].id,{viewedAt:new Date()});
        expect(message.viewedAt).to.be.not.null;
        reply=await Reply.UpdateById(replyToCheck.id,{title: TITLE,message:MESSAGE});
        expect(reply.title).to.be.equals(TITLE);
        expect(reply.message).to.be.equals(MESSAGE);
        topic=await Topic.UpdateById(topics[0].id,{name:NAME});
        expect(topic.name).to.be.equals(NAME);
        let res=await Topic.GetAllById(users.find(r=>r.campaignId==campagn.id)!.nickname,campagn.id);


    });



});