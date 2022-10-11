import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../entity/User";
import initializeDatabase from "../../../initializer/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        try {
            const connection = await initializeDatabase();
    
            if (connection) {
                const repository = await connection.getRepository(User);
                const userInfo = await repository.createQueryBuilder().where("user.email = :email", {email: req.body.email}).getOne()                    

                if (!userInfo || userInfo.password != req.body.password) {
                    console.log("Your email or password are incorrect")
                    res.status(401).json({message: "Your email or password are incorrect"})
                } else {
                    console.log(userInfo)
                    res.status(200).json(userInfo)
                }

                res.status(200)
            } else {
                console.log('connection error!')
            }
    
        } catch (err) {
            res.status(500)
        }
    }
}