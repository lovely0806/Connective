import {withIronSession} from "next-iron-session"
import { DAO } from "../../../../lib/dao"
import {NextApiResponse} from 'next';

export async function handler(req: any, res: NextApiResponse) {
    const {id} = req.query
    try {
        let user = req.session.get().user
        if(typeof(user) == "undefined") {
            return res.status(500).json({success: false, error: "Not signed in"})
        }
        if(req.method == "GET") { //Returns callers account
            res.status(200).json(await DAO.Individual.getByUserId(id))
        }
    } catch(e) {
        console.log(e)
        return res.status(500).json({success: false, error: e})
    }
}

export default withIronSession(handler, {
    password: process.env.APPLICATION_SECRET,
    cookieName: "Connective",
    // if your localhost is served on http:// then disable the secure flag
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
});