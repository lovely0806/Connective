import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Layout from "../../../components/layout";
import Select from "react-select"
import ListCard from "../../../components/marketplace/ListCard";
import {categoryOptions} from "../../../common/selectOptions"

export default function Dashboard({user}) {
    const [lists, setLists] = useState([])
    const [loading, setLoading] = useState(true)
    const [filteredLists, setFilteredLists] = useState([])

    const sortOptions = [
        {value: "Buyers", label: "Buyers"},
        {value: "Price", label: "Price"},
        {value: "New", label: "New"},
        {value: "Old", label: "Old"}
    ]

    const getLists = async () => {
        let {data} = await axios.get("/api/lists")
        setLists(data)
        setFilteredLists(data)
        setLoading(false)
    }

    const updateFilter = (e) => {
        let temp = []
        lists.forEach(list => {
            if(list.category == e.value) {
                temp.push(list)
            }
        })
        setFilteredLists(temp)
    }

    useEffect(() => {
        getLists()
    }, [])

    return (
        <Layout title="Marketplace">
            <div className="mx-20 h-screen">
                <div className="flex flex-row w-full mb-20 gap-10">
                    <input placeholder="Search for lists here" style={{background: "white url(/assets/search.svg) no-repeat 5px 5px"}} className="h-fit w-full mr-32 outline-none pl-10 px-5 py-2 border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"></input>
                    <Select options={categoryOptions} onChange={updateFilter} isMulti={false} placeholder="Categories" className="w-96"></Select>
                    <Select options={sortOptions} placeholder="Sort" className="w-96"></Select>
                </div>

                {filteredLists.length > 0 ? (
                    <div className="grid sm:grid-cols-3 2xl:grid-cols-4 auto-rows-[30vw] gap-10 pb-20">
                        {filteredLists.map((item, index) => {
                            return (
                                <ListCard item={item}></ListCard>
                            )
                        })}
                    </div>
                ) : (
                    <div className="w-full h-full flex">
                        {loading ? (
                            <p className="mx-auto mt-20 text-2xl">Loading...</p>
                        ) : (
                            <p className="mx-auto mt-20 text-2xl">No lists exist for this category yet :(</p>
                        )}
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