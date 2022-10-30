import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Layout from "../../../components/layout";
import Select from "react-select"
import {categoryOptions} from "../../../common/selectOptions"
import ListRow from "../../../components/lists/purchased-list";

export default function PurchasedLists({user}) {
    const [lists, setLists] = useState([])
    const [loading, setLoading] = useState(true)

    const getLists = async () => {
        let {data} = await axios.get("/api/lists/purchased")
        console.log(data)
        setLists(data)
        setLoading(false)
    }

    useEffect(() => {
        getLists()
    }, [])

    return (
        <Layout title="Purchased Lists">
            <div className="mx-20 h-screen">
                {lists.length > 0 ? (
                    <div className="flex flex-col gap-10 pb-20">
                        {lists.map((item, index) => {
                            return (
                                <ListRow item={item}></ListRow>
                            )
                        })}
                    </div>
                ) : (
                    <div className="w-full h-full flex">
                        <p className="mx-auto mt-20 text-2xl">Loading...</p>
                    </div>
                )}
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