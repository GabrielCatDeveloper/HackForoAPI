import { default as User } from "../models/user";
import { faker } from '@faker-js/faker';

export async function GenerateUser(campaignId:number){
    const body={
        campaignId,
        name:faker.animal.bear(),
        nickname:faker.internet.username(),
        passwordHash:User.encryptPassword(faker.string.uuid()),
    };
    return User.Create(body);
}