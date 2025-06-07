import Campaign from "./campaign";
import { expect } from 'chai';
import { describe, it } from 'mocha';


describe("Campaign",()=>{

    it("Should get include ok",()=>{
        const include=Campaign.getInclude("sora13");
        expect(include?.topics?.include?.replies?.include?.views).to.be.not.undefined;
    });





});