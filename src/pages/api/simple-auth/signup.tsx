import { NextApiRequest, NextApiResponse } from "next";
import { getRepository } from "typeorm";
import { User } from "../../../entity/User";
import initializeDatabase from '../../../initializer/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method == "POST") {
        try {
            const connection = await initializeDatabase();
            if (connection) {
                await connection.createQueryBuilder().insert().into(User).values([
                    {email: req.body.email, password: req.body.password}
                ]).execute();
        
                await connection.close();

                console.log("signup success!")
        
                res.status(200).json({
                    message: "signup success!"
                })
            }
            
            res.status(500)
        } catch (err) {
            res.status(500)
        }
    }
}