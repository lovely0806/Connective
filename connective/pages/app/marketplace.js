import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Util from "../../util/"
import Layout from "../../components/layout";
import ButtonDark from "../../components/button-dark";
import Select from "react-select"
import ListCard from "../../components/marketplace/ListCard";

export default function Dashboard({user}) {
    const [lists, setLists] = useState([])
    
    const categoryOptions = [
        {value: "Web Development", label: "Web Development"},
        {value: "Event Planning", label: "Event Planning"},
        {value: "Investors", label: "Investors"}
    ]

    const sortOptions = [
        {value: "Buyers", label: "Buyers"},
        {value: "Price", label: "Price"},
        {value: "New", label: "New"},
        {value: "Old", label: "Old"}
    ]

    const getLists = async () => {
        let {data} = await axios.get("/api/lists")
        setLists(data)
    }

    useEffect(() => {
        getLists()
    }, [])

    return (
        <Layout title="Marketplace">
            <div className="mx-20 h-screen">
                <div className="flex flex-row w-full mb-20 gap-10">
                    <input placeholder="Search for lists here" style={{background: "white url(/assets/search.svg) no-repeat 5px 5px"}} className="w-full mr-32 outline-none pl-10 px-5 py-2 border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"></input>
                    <Select options={categoryOptions} placeholder="Categories" className="w-96"></Select>
                    <Select options={sortOptions} placeholder="Sort" className="w-96"></Select>
                </div>

                <div className="grid grid-cols-3 gap-10 pb-20">
                    {lists.map((item, index) => {
                        return (
                            <ListCard item={item}></ListCard>
                        )
                    })}
                </div>
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