import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Layout from "../../../../components/layout";
import Select from "react-select"
import {useRouter} from "next/router"
import ButtonDark from "../../../../components/button-dark";

export default function Dashboard({user}) {
    const [data, setData] = useState([])
    const router = useRouter()
    const {id} = router.query

    const getData = async () => {
        let {data} = await axios.get(`/api/lists/${id}`)
        setData(data)
        console.log(data)
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <Layout title="">
            <div className="flex flex-col gap-20 mb-20">
                <div className="mx-20 bg-white shadow-lg rounded-xl p-10">
                    <div className="flex flex-row h-fit gap-5 mb-10">
                        <img src="/assets/listdetails.svg"></img>
                        <p className="font-bold text-xl my-auto">List Details</p>
                    </div>
                    
                    <div className="flex flex-row justify-between gap-20">
                        <div>
                            <p className="text-lg font-bold mb-2">List Name</p>
                            <p className="text-[#8A8888] mb-7">{data?.title}</p>
                            <p className="text-lg font-bold mb-2">Description</p>
                            <p className="text-[#8A8888] mb-7">{data?.description}</p>
                            
                            <div className="flex flex-row mb-2 gap-3">
                                <img src="/assets/question.svg"></img>
                                <p className="text-lg font-bold">How did the seller obtain this list?</p>
                            </div>
                            
                            <p className="text-[#8A8888] mb-7">{data?.list_obtained}</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold mb-2">Location</p>
                            <div className="flex flex-row mb-7 gap-3">
                                <img className="h-5 my-auto" src="/assets/location-pin.png"></img>
                                <p className="text-[#8A8888]">{data?.location}</p>
                            </div>
                            <p className="text-lg font-bold mb-2">Listed By</p>
                            <div className="flex flex-row gap-3">
                                <img className="h-8 rounded-full" src={typeof(data.logo) == "undefined" ? data.profile_picture : data.logo}/>
                                <p className="text-[#8A8888] mb-7 my-auto">{typeof(data.name) == "undefined" ? data.company_name : data.name}</p>
                            </div>
                            <p className="text-lg font-bold mb-2">List Price</p>
                            <p className="text-[#8A8888] mb-7">${data?.price}</p>
                        </div>
                    </div>
                </div>
                <div className="mx-20 bg-white shadow-lg rounded-xl p-10">
                    <div className="flex flex-row gap-5 mb-10">
                        <img src="/assets/fieldsdescription.svg"></img>
                        <p className="font-bold text-xl my-auto">Fields Description</p>
                    </div>
                    
                    <div className="flex flex-row w-full justify-between gap-5  ">
                        <div className="w-full">
                            <p>Fields</p>
                            <div className="flex flex-col gap-5">
                                {data?.fields?.fieldResults.map((item) => {
                                    return (
                                        <div className="bg-[#FBFAFA] border border-black/30 rounded-md w-full py-1 px-2">
                                            <p>{item.name}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="w-full">
                            <p>Description</p>
                            <div className="flex flex-col gap-5">
                                {data?.fields?.fieldResults.map((item) => {
                                    return (
                                        <div className="bg-[#FBFAFA] border border-black/30 rounded-md w-full py-1 px-2">
                                            <p>{item.description}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <ButtonDark text="Buy Now" className="ml-auto mr-auto mt-0" onClick={() => {
                    router.push({pathname: `/app/checkout/${id}`})
                }}></ButtonDark>
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