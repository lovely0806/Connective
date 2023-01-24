import {DAO} from "../../lib/dao";
import {describe, expect, test, beforeAll, afterAll} from "@jest/globals";

describe("DAO.Users", () => {
    test("Get user by email which exists", async () => {
        let User = await DAO.Users.getByEmail("kkingsbe@gmail.com");
        console.log(User)
        
        //Make sure getByEmail found user
        expect(typeof(User)).not.toBe("boolean")
    
        if(typeof(User) != "boolean") { //Type guard
            //TODO: Make sure no null values, besides those null in db (check db to see which values can be null)
        }
    })
    
    //TODO: Implement
    test("Get user by email which does not exist", async () => {
        let User = await DAO.Users.getByEmail("abcdefg");
    })
})