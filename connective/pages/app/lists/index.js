import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Layout from "../../../components/layout";
import Util from "../../../util";
import ListRow from "../../../components/lists/list-row";
import Link from "next/link"

export default function Lists({user}) {
    const [lists, setLists] = useState([])

    const getLists = async() => {
        let type = await Util.accountType(user.id)
        if(type == "Business") {
            setLists((await axios.get("/api/profiles/business")).data.lists)
        }
        if(type == "Individual") {
            setLists((await axios.get('/api/profiles/individual')).data.lists)
        }
    }

    useEffect(() => {
        getLists()
    }, [])

    return (
        <Layout title="Lists">
            <Link href="/app/lists/create/1">
                <div className="mx-40 mb-40 cursor-pointer justify-center flex flex-row gap-5 bg-[#D9D9D9]/30 p-5 border border-black/40 border-dashed rounded-md transition-all hover:bg-[#D9D9D9]/10">
                    <div className="rounded-full w-8 h-8 flex bg-black/50">
                        <p className="text-xl font-bold mx-auto my-auto text-white">+</p>
                    </div>
                    <p className="my-auto text-center text-black font-bold">
                        <p>Create a list</p>
                    </p>
                </div>
            </Link>
            
            <p className="text-black font-bold mx-20 border-b border-black/20 pb-5 mb-10">Created Lists</p>
            <div className="mx-20 flex flex-col gap-10">
                {lists.map((item, index) => {
                    return (
                        <ListRow item={item}></ListRow>
                    )
                })}
            </div>
        </Layout>
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