import moment from "moment";
import mysql, { OkPacket, ResultSetHeader } from "mysql2"
import {Message, User} from "../types/types"

export namespace DAO {
    const connection = mysql.createConnection(process.env.DATABASE_URL);

    export class Users {
        static async getByEmail(email: string): Promise<User> {
            var [results] = await connection.promise().query(`SELECT * FROM Users WHERE email=?;`, [email]);
            return results[0]
        }

        static async add(username: string, password_hash: string, email: string, stripeID: string): Promise<number | boolean> {
            var [result] = await connection.promise().execute<OkPacket>(`INSERT INTO Users (username, password_hash, email, stripeID) VALUES (?,?,?,?);`, [username, password_hash, email, stripeID]);
            return result.insertId
        }

        static async updateVerificationStatus(status: boolean, email: string) {
            await connection.promise().execute(`UPDATE Users SET verify_email_otp = null, email_verified = ? WHERE email=?;`, [status == true ? "true" : "false", email]);
        }

        static async setOtpCode(code: string, email: string) {
            await connection.promise().execute(`UPDATE Users SET verify_email_otp = ? WHERE email=?;`, [code, email]);
        }

        static async updateOtpCode(code: string, sendCodeAttempt: number, email: string) {
            await connection.promise().query(`UPDATE Users SET verify_email_otp = ?, send_code_attempt = ?, last_code_sent_time = ? WHERE email=?;`, 
                [code, sendCodeAttempt, moment().format("YYYY/MM/DD HH:mm:ss")]);
        }
    }

    export class Business {
        static async isBusiness(id: number): Promise<boolean> {
            let [res] = await connection.promise().query(`SELECT COUNT(id) FROM Business WHERE user_id=?;`, [id]);
            return res[0]["count(id)"] > 0
        }
    }

    export class Individual {
        static async isIndividual(id: number): Promise<boolean> {
            let [res] = await connection.promise().query(`SELECT COUNT(id) FROM Individual WHERE user_id=?;`, [id]);
            return res[0]["count(id)"] > 0
        }
    }

    export class Messages {
        static async getByOtherUser(userId: number, otherId: number): Promise<Message[]> {
            var [results] = await connection.promise().query(`SELECT * FROM messages WHERE sender=? and receiver=? UNION ALL SELECT * FROM messages WHERE receiver=? and sender=?;`,
            [userId, otherId, userId, otherId]);

            return results as Message[]
        }

        static async add(senderId: number, receiverId: number, text: string): Promise<number> {
            var [result] = await connection.promise().query<OkPacket>(
                `INSERT INTO messages (`+'`sender`'+`, `+'`receiver`'+`, `+'`text`'+`, `+'`read`'+`, `+'`notified`'+`) VALUES (?, ?, ?, '0', '0')`, 
                [senderId, receiverId, text]);
                
            return result.insertId
        }
    }
}