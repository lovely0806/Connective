import {DAO} from "../../lib/dao";
import {describe, expect, test, beforeAll, afterAll} from "@jest/globals";

describe("Get by email", () => {
    test("Get user by email which exists", async () => {
        let User = await DAO.Users.getByEmail("kkingsbe@gmail.com");
        console.log(User)

        //Make sure getByEmail found user
        expect(typeof(User)).not.toBe("boolean")

        if(typeof(User) != "boolean") { //Type guard
            //TODO: Make sure no null values, besides those null in db (check db to see which values can be null)
            expect(User.id).not.toBeNull();
            expect(User.username).not.toBeNull();
            expect(User.password_hash).not.toBeNull();
            expect(User.email).not.toBeNull();
        }
    })

    //TODO: Implement
    test("Get user by email which does not exist", async () => {
        let User = await DAO.Users.getByEmail("abcdefg");
        console.log(User);

        //Make sure getByEmail found user
        expect(User).toBe(false);
    })

    test("User verified his email", async () => {
        let User = await DAO.Users.getByEmail("tikitaka.mou@gmail.com");
        console.log(User);

        //Make sure getByEmail found user
        expect(typeof(User)).not.toBe("boolean")

        if (typeof(User) != "boolean") {
            expect(User.id).not.toBeNull();
            expect(User.username).not.toBeNull();
            expect(User.password_hash).not.toBeNull();
            expect(User.email).not.toBeNull();
            expect(User.email_verified).toBe(true);
            expect(User.stripeID).not.toBeNull();
            expect(User.show_on_discover).not.toBeNull();
            expect(User.verification_timestamp).not.toBeNull();
            expect(User.verify_email_otp).not.toBeNull();
            expect(User.send_code_attempt).not.toBeNull();
            expect(User.is_signup_with_google).toBe(false);
        }
    })

    test("User has not verified his email", async () => {
        let User = await DAO.Users.getByEmail("kyguy@gmail.com");
        console.log(User);

        //Make sure getByEmail found user
        expect(typeof(User)).not.toBe("boolean")

        if (typeof(User) != "boolean") {
            expect(User.id).not.toBeNull();
            expect(User.username).not.toBeNull();
            expect(User.password_hash).not.toBeNull();
            expect(User.email).not.toBeNull();
            expect(User.email_verified).toBe(false);
            expect(User.is_signup_with_google).toBe(false);
        }
    })

    test("User signed up with google", async () => {
        let User = await DAO.Users.getByEmail("devispei@gmail.com");
        console.log(User);

        //Make sure getByEmail found user
        expect(typeof(User)).not.toBe("boolean")

        if (typeof(User) != "boolean") {
            expect(User.id).not.toBeNull();
            expect(User.username).not.toBeNull();
            expect(User.password_hash).not.toBeNull();
            expect(User.email).not.toBeNull();
            expect(User.email_verified).toBe(true);
            expect(User.stripeID).not.toBeNull();
            expect(User.show_on_discover).not.toBeNull();
            expect(User.is_signup_with_google).toBe(true);
        }
    })
})