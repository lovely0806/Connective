const mysql = require("mysql2")
import {withIronSession} from "next-iron-session"
import { DAO } from '../../../lib/dao';

export async function handler(req, res) {
    try {
        if(typeof(req.session.get().user) == "undefined") {
            return res.status(500).json({success: false, error: "Not signed in"})
        }
        if(req.method == "POST") {
            const {id, type} = req.body 
            
            if(type == "business") await DAO.Business.incrementProfileViews(id)
            else await DAO.Individual.incrementProfileViews(id)

            res.status(200).json({success: true})
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

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "4mb"
        }
    }
}