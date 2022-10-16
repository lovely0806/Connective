import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Sidebar from "../../components/sidebar";
import BusinessProfile from "../../components/profile/business";
import IndividualProfile from "../../components/profile/individual";
import Util from "../../util/"

export default function Profile({user}) {
    const [accountType, setAccountType] = useState()

    const getAccountType = async() => {
        setAccountType(await Util.accountType(user.id))
    }
    useEffect(() => {
        getAccountType()
    }, [])

    return (
        <main className="flex flex-row min-h-screen min-w-screen text-[Montserrat] bg-[#F5F5F5]">
            <Sidebar></Sidebar>
            {accountType == "Business" ? (
                <BusinessProfile user={user}></BusinessProfile>
            ) : (
                <IndividualProfile user={user}></IndividualProfile>
            )}
        </main>
    )
}

export const getServerSideProps = withIronSession(
    async ({req, res}) => {
        const user = req.session.get("user")
  
        if(!user) {
            return {props: {}}
        }
  
        return {
            props: {user}
        }
    },
    {
        cookieName: "Connective",
        cookieOptions: {
            secure: process.env.NODE_ENV == "production" ? true: false
        },
        password: process.env.APPLICATION_SECRET
    }
)