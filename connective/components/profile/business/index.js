import axios from "axios"
import {useState, useEffect} from "react"
import {useRouter} from "next/router"
import ButtonDark from "../../button-dark"

export default function BusinessProfile({user}) {
    const router = useRouter()

    const [data, setData] = useState()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        getProfile()
    }, [])

    useEffect(() => {
        if(typeof(window) != "undefined" && typeof(user) == "undefined") {
            router.push("/auth/signin")
        }
    }, [user])

    const getProfile = async () => {
        await axios.get("/api/profiles/business")
            .then(res => {
                if(typeof(res.data) != "undefined") {
                    setData(res.data)
                    console.log(res.data)
                    setLoaded(true)
                }
        })
    }

    return (
        <div className="flex flex-col w-full h-full">
            {loaded && (
            <>
            <img className="h-[18vh] w-full object-cover relative shadow-md" src="/assets/banners/waves-min.jpeg"></img>
            {data.logo == "" ? (
                <img className="rounded-full w-32 h-32 -mt-16 z-10 ml-16 backdrop-blur-sm bg-white/20 shadow-md" src={`https://avatars.dicebear.com/api/micah/${user.id}.svg`}></img> 
            ) : (
                <img className="rounded-full w-32 h-32 -mt-16 z-10 ml-16 backdrop-blur-sm bg-white/20 shadow-md" src={data.logo}></img> 
            )}
            
            
            <div className="mt-10 ml-16 text-black">
                <div className="flex flex-row">
                    <p className="font-bold text-3xl 2xl:text-4xl mb-5">{data?.company_name}</p>
                    <ButtonDark text="Edit Profile"></ButtonDark>
                </div>
                <div className="flex flex-row gap-10 text-lg 2xl:text-xl w-fit mr-16 pb-5 border-b border-black/20">
                    <div className="flex flex-row gap-2">
                        <img className="h-6 w-6" src="/assets/location-pin.png"/>
                        <p>{data?.location}</p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <img className="h-6 w-6" src="/assets/link.png"/>
                        <p className="font-bold">Website: <a className="font-normal cursor-pointer text-blue-600 underline" href={data?.website}>{data?.website}</a></p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <p className="font-bold">Company Size:</p>
                        <p>{data?.size} employees</p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <p className="font-bold">Industry:</p>
                        <p>{data?.industry}</p>
                    </div>
                </div>
                <p className="font-bold text-xl mt-20 mb-5">About company:</p>
                <div className="rounded-xl bg-white shadow w-[40vw] p-5">
                    <p>{data?.description}</p>
                </div>
            </div>
            </>
            )}
        </div>
    )
}