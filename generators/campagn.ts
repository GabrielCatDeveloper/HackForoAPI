import { faker } from "@faker-js/faker/.";
import Campaign from "../models/campaign";



export async function GenerateCampagne(){
    return Campaign.Create({accessToken:faker.string.uuid()});
}