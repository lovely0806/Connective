import moment from "moment";
import mysql, { OkPacket, ResultSetHeader } from "mysql2"
import {Message, User} from "../types/types"

export namespace DAO {
    const connection = mysql.createConnection(process.env.DATABASE_URL);

    /**
     * Contains functions for interacting with Users in the database
     */
    export class Users {
        /**
         * Gets a user by their email
         * @param {string} email The users email
         * @returns {User} The user object
         */
        static async getByEmail(email: string): Promise<User> {
            var [results] = await connection.promise().query(`SELECT * FROM Users WHERE email=?;`, [email]);
            return results[0]
        }

        /**
         * Adds a new user to the database
         * @param {string} username The users username
         * @param {string} password_hash The users hashed password
         * @param {string} email The users email
         * @param {string} stripeID The users stripe id
         * @returns {number | boolean} The users insert id, or false if the insert failed
         */
        static async add(username: string, password_hash: string, email: string, stripeID: string): Promise<number | boolean> {
            var [result] = await connection.promise().execute<OkPacket>(`INSERT INTO Users (username, password_hash, email, stripeID) VALUES (?,?,?,?);`, [username, password_hash, email, stripeID]);
            return result.insertId
        }

        /**
         * Updates the email verification status of the given user
         * @param {boolean} status The new verification status of the user
         * @param {string} email The users email
         */
        static async updateVerificationStatus(status: boolean, email: string) {
            await connection.promise().execute(`UPDATE Users SET verify_email_otp = null, email_verified = ? WHERE email=?;`, [status == true ? "true" : "false", email]);
        }

        /**
         * Sets the one time passcode for the given user by their email
         * @param {string} code The new OTP code
         * @param {string} email The users email
         */
        static async setOtpCode(code: string, email: string) {
            await connection.promise().execute(`UPDATE Users SET verify_email_otp = ? WHERE email=?;`, [code, email]);
        }

        /**
         * Updates the one time passcode for a user, as well as the # of attempts for the given user
         * @param {string} code The new OTP code
         * @param {number} sendCodeAttempt The number of attempts which have occured
         * @param {string} email The users email
         */
        static async updateOtpCode(code: string, sendCodeAttempt: number, email: string) {
            await connection.promise().query(`UPDATE Users SET verify_email_otp = ?, send_code_attempt = ?, last_code_sent_time = ? WHERE email=?;`, 
                [code, sendCodeAttempt, moment().format("YYYY/MM/DD HH:mm:ss"), email]);
        }
    } 
 
    /**
     * Contains functions for interacting with Businesses in the database
     */
    export class Business {
        /**
         * Determines if a user is a business
         * @param {number} id The users id
         * @returns {boolean} True if the user is a business
         */
        static async isBusiness(id: number): Promise<boolean> {
            let [res] = await connection.promise().query(`SELECT COUNT(id) FROM Business WHERE user_id=?;`, [id]);
            return res[0]["count(id)"] > 0
        }

        /**
         * Gets a business by its user id
         * @param {number} userId The businesses user id 
         * @returns {Business} A Business object representing the business
         */
        static async getByUserId(userId: number): Promise<Business> {
            var [result] = await connection.promise().query(`SELECT * FROM Business WHERE user_id=?;`, [userId])
            return result[0]
        }
    }

    /**
     * Contains functions for interacting with Individuals in the database
     */
    export class Individual {
        /**
         * Determines if a user is an individual
         * @param {number} id The individuals user id 
         * @returns {boolean} True if the user is an individual
         */
        static async isIndividual(id: number): Promise<boolean> {
            let [res] = await connection.promise().query(`SELECT COUNT(id) FROM Individual WHERE user_id=?;`, [id]);
            return res[0]["count(id)"] > 0
        }

        /**
         * Gets an individual by its user id
         * @param {number} userId The individuals user id
         * @returns {Individual} An Indivual object representing the individual
         */
        static async getByUserId(userId: number): Promise<Individual> {
            var [result] = await connection.promise().query(`SELECT * FROM Individual WHERE user_id=?;`, [userId])
            return result[0]
        }
    }

    /**
     * Contains functions for interacting with Messages in the database
     */
    export class Messages {
        /**
         * Gets all messages between one user and antoher
         * @param {number} userId The first users id
         * @param {number} otherId The second users id
         * @returns {Message[]} An array of Message objects representing the conversation
         */
        static async getByOtherUser(userId: number, otherId: number): Promise<Message[]> {
            var [results] = await connection.promise().query(`SELECT * FROM messages WHERE sender=? and receiver=? UNION ALL SELECT * FROM messages WHERE receiver=? and sender=?;`,
            [userId, otherId, userId, otherId]);

            return results as Message[]
        }

        /**
         * Adds a new message to the database
         * @param {number} senderId The user id of the message sender
         * @param {number} receiverId The user id of the message receiver
         * @param {string} text The text content within the message
         * @returns {number} The messages insert id
         */
        static async add(senderId: number, receiverId: number, text: string): Promise<number> {
            var [result] = await connection.promise().query<OkPacket>(
                `INSERT INTO messages (`+'`sender`'+`, `+'`receiver`'+`, `+'`text`'+`, `+'`read`'+`, `+'`notified`'+`) VALUES (?, ?, ?, '0', '0')`, 
                [senderId, receiverId, text]);

            return result.insertId
        }

        /**
         * Gets all conversations from the given user
         * @param {number} userId The users id 
         * @returns An array of conversations
         */
        static async getConversations(userId: number) {
            var [results] = await connection.promise().query<OkPacket[]>(
                `select distinct sender, receiver from messages where sender = ? union all select distinct sender, receiver from messages where receiver = ?;`,
              [userId, userId]);

            var [profiles] = await connection
                .promise()
                .query<OkPacket[]>(`SELECT Users.id, Users.email, Business.company_name as username, Business.location, Business.logo FROM Users JOIN Business on Users.id = Business.user_id UNION ALL SELECT Users.id, Users.email, Individual.name as username, Individual.location, Individual.profile_picture AS logo FROM Users JOIN Individual on Users.id = Individual.user_id;`)
            
            let temp = []
            //Refactor this
            results.forEach((result: any) => {
                temp.push(profiles.filter((a: any) => a.id == result.sender || a.id == result.receiver))
            })
            let conversations = []
            temp.forEach(item => {
                if(conversations.filter(a => a.id == item.id).length == 0) {
                    conversations.push(item)
                }
            })
            return conversations
        }

        /**
         * Gets all unread & unnotified messages accross all users
         * @returns {{id: number, email: string}[]} All unread and unnotified messages
         */
        static async getUnnotified(): Promise<{id: number, email: string}[]> {
            var [messages] = await connection.promise().query("SELECT messages.id, Users.email FROM messages LEFT JOIN Users ON Users.id=`receiver` WHERE `read`='0' AND messages.timestamp < DATE_SUB(NOW(), interval 2 minute) AND `notified` ='0' ORDER BY timestamp DESC;")
            
            return messages as {id: number, email: string}[]
        }
    }
}