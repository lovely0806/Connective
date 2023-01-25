import {DAO} from "../../lib/dao";
import {describe, expect, test, beforeAll, afterAll} from "@jest/globals";
import { User } from "../../types/types";

describe("Get by Id", () => {
    test("Get user by Id which exists",async () => {
        let User = await DAO.Users.getById(415);

        expect(User.id).not.toBeNull();
        expect(User.username).not.toBeNull();
        expect(User.password_hash).not.toBeNull();
        expect(User.email).not.toBeNull();
        expect(User.email_verified).toBe(true);
        expect(User.is_signup_with_google).toBe(false);
        expect(User.show_on_discover).toBe(false);
    })
})

describe("Get by email", () => {
    test("Get user by email which exists and has not verified email", async () => {
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
        let User = await DAO.Users.getByEmail("kkingsbe@gmail.com");
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

describe("Get All", () => {
    test("Get all users",async () => {
        let Users = await DAO.Users.getAll();

        // expect(Users.length).toBe(205);
    })
})

describe("Get by Email and VerificationId", () => {
    test("Get user with existing email and verification_id",async () => {
        let User = await DAO.Users.getByEmailAndVerificationId("tikitaka.mou@gmail.com", "62dee2ac-c673-4bd9-8098-ba3f1849852b");

        expect(User.id).not.toBeNull();
        expect(User.username).not.toBeNull();
        expect(User.password_hash).not.toBeNull();
        expect(User.email).not.toBeNull();
        expect(User.verification_timestamp).not.toBeNull();
        expect(User.email_verified).toBe(true);
        expect(User.is_signup_with_google).toBe(false);
        expect(User.show_on_discover).toBe(false);
    })
})

describe("add new user", () => {

    // 457, 458, 459, 460
    test("add new user without google",async () => {
        let Id = await DAO.Users.add("John Doe", "$2a$10$e6pO/qYuFpKBwSBQTbz6oO55baOWV4HZbl/tl57a2O8IBYNrk0Bqq", "johndoe@xxx.com", "acct_1MRTOGBRAJesAWt0");
        let User = await DAO.Users.getById(Id as number);

        expect(typeof(Id)).toBe("number");
        expect(Id).toBeGreaterThan(0);
        expect(User.id).toBe(Id);
        expect(User.username).toBe("John Doe");
        expect(User.email).toBe("johndoe@xxx.com");
        expect(User.stripeID).toBe("acct_1MRTOGBRAJesAWt0");
        expect(User.email_verified).toBe(false);
        expect(User.is_signup_with_google).toBe(false);
        expect(User.show_on_discover).toBe(false);
    })

    test("add new user with google",async () => {
        let Id = await DAO.Users.add("John Doe", "$2a$10$e6pO/qYuFpKBwSBQTbz6oO55baOWV4HZbl/tl57a2O8IBYNrk0Bqq", "johndoe@xxx.com", "acct_1MRTOGBRAJesAWt0", true);
        let User = await DAO.Users.getById(Id as number);

        expect(typeof(Id)).toBe("number");
        expect(Id).toBeGreaterThan(0);
        expect(User.id).toBe(Id);
        expect(User.username).toBe("John Doe");
        expect(User.email).toBe("johndoe@xxx.com");
        expect(User.stripeID).toBe("acct_1MRTOGBRAJesAWt0");
        expect(User.email_verified).toBe(true);
        expect(User.is_signup_with_google).toBe(true);
        expect(User.show_on_discover).toBe(false);
    })
})

describe("update verification status", () => {
    test("update status to true",async () => {
        await DAO.Users.updateVerificationStatus(true, "tikitaka.mou@gmail.com");
        let User = await DAO.Users.getByEmail("tikitaka.mou@gmail.com") as User;

        expect(User.id).not.toBeNull();
        expect(User.username).not.toBeNull();
        expect(User.password_hash).not.toBeNull();
        expect(User.email).not.toBeNull();
        expect(User.verify_email_otp).toBeNull();
        expect(User.email_verified).toBe(true);
    })

    test("update status to false",async () => {
        await DAO.Users.updateVerificationStatus(false, "tikitaka.mou@gmail.com");
        let User = await DAO.Users.getByEmail("tikitaka.mou@gmail.com") as User;

        expect(User.id).not.toBeNull();
        expect(User.username).not.toBeNull();
        expect(User.password_hash).not.toBeNull();
        expect(User.verify_email_otp).toBeNull();
        expect(User.email).not.toBeNull();
        expect(User.email_verified).toBe(false);
    })
})