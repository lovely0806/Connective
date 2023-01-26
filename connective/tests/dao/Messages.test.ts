import {DAO} from "../../lib/dao";
import mysql, { RowDataPacket } from "mysql2";
import {describe, expect, test, beforeAll, afterAll} from "@jest/globals";
import { Message, Conversation } from "../../types/types";

const connection = mysql.createConnection(process.env.DATABASE_URL || "");

/**
 * test for getByOtherUser function of Messages class
*/
describe("Gets all messages between one user and another", () => {
  test("get messages by other user",async () => {
    let messages: Array<Message> = await DAO.Messages.getByOtherUser(71, 168);

    expect(messages[0].id).not.toBeNull();
    expect(messages[0].sender).not.toBeNull();
    expect(messages[0].receiver).not.toBeNull();
    expect(messages[0].text).not.toBeNull();
    expect(messages[0].read).not.toBeNull();
    expect(messages[0].notified).not.toBeNull();
    expect(messages[0].timestamp).not.toBeNull();
  })
})

/**
 * test for add function of Messages class
*/
describe("Adds a new message to the database", () => {
  test("get messages by other user",async () => {
    let Id = await DAO.Messages.add(71, 168, "This is one for the test");
    var query = `Select * from messages where id = ${Id}`;
    let [message] = await connection.promise().query(query);

    expect(typeof(Id)).toBe("number");
    expect(Id).toBeGreaterThan(0);
    expect(message[0].id).toBe(Id);
    expect(message[0].sender).toBe(71);
    expect(message[0].receiver).toBe(168);
    expect(message[0].text).toBe("This is one for the test");
    expect(message[0].read).toBe("0");
    expect(message[0].notified).toBe("0");

    var query = `Delete from messages where id = ${Id}`;
    await connection.promise().query(query);
  })
})

/**
 * test for getConversations function of Messages class
*/
describe("Gets all conversations from the given user", () => {
  test("get conversations",async () => {
    let conversations: Array<Conversation> = await DAO.Messages.getConversations(71);

    if (conversations.length > 0) {
      expect(conversations[0].id).not.toBeNull();
      expect(conversations[0].email).not.toBeNull();
      expect(conversations[0].username).not.toBeNull();
      expect(conversations[0].location).not.toBeNull();
      expect(conversations[0].logo).not.toBeNull();
    }
  })
})

// /**
//  * test for getUnnotified function of Messages class
// */
// describe("Gets all unread & unnotified messages accross all users", () => {
//   test("get unnotified messages",async () => {
//     let messages: Array<Message> = await DAO.Messages.getUnnotified();
//     console.log(messages);

//     // expect(urls.length).toBeGreaterThan(0);
//   })
// })

/**
 * test for updateNotifyForSentMessage function of Messages class
*/
describe("Updates notified flag to present sent", () => {
  test("undate notify",async () => {
    var query = `Select notified from messages where id = 900`;
    let [values] = await connection.promise().query(query);
    let originValue: string = values[0].notified;

    await DAO.Messages.updateNotifyForSentMessage(900);
    var query = `Select * from messages where id = 900`;
    let [messages] = await connection.promise().query(query);

    expect(messages[0].notified).toBe('1');

    var recoverQuery ="UPDATE messages SET `notified` = " + originValue + " WHERE id = 900";
    await connection.promise().query(recoverQuery);
  })
})

/**
 * test for updateReadMessage function of Messages class
*/
describe("Updates read flag to read message", () => {
  test("update read",async () => {
    var query = `Select messages.read from messages where sender = 71 AND receiver = 168`;
    let [values] = await connection.promise().query(query);
    let originValue: string = values[0].read;

    await DAO.Messages.updateReadMessage({sender: 71, receiver: 168});
    var query = `Select * from messages where sender = 71 AND receiver = 168`;
    let [messages] = await connection.promise().query(query);

    expect(messages[0].read).toBe('1');

    // var recoverQuery ="UPDATE messages SET `read` = " + originValue + " WHERE sender = 71 AND receiver = 168";
    // await connection.promise().query(recoverQuery);
  })
})

