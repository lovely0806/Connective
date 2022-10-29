import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Util from "../../../../util/"
import Layout from "../../../../components/layout";
import ButtonDark from "../../../../components/button-dark";
import {useRouter} from "next/router"
import InputField from "../../../../components/input-field";
import FileUpload from "../../../../components/file-upload";
import {v4 as uuidv4} from "uuid"
import ListCard from "../../../../components/marketplace/ListCard";

export default function NewList({user}) {
    const [price, setPrice] = useState("")
    const [title, setTitle] = useState()
    const [category, setCategory] = useState()
    const [description, setDescription] = useState()
    const [geo, setGeo] = useState()
    const [obtain, setObtain] = useState()
    const [fields, setFields] = useState()
    const [uploadUrl, setUploadUrl] = useState()
    const [previewUrl, setPreviewUrl] = useState()
    const [coverUrl, setCoverUrl] = useState()
    const [processing, setProcessing] = useState(false)

    const router = useRouter()

    useEffect(() => {
        let newListvalues = JSON.parse(localStorage.getItem("newListValues"))
        let uploadUrl = localStorage.getItem("uploadUrl")
        let previewUrl = localStorage.getItem("previewUrl")
        let coverUrlStr = localStorage.getItem("coverUrl")
        let newListPrice = localStorage.getItem("newListPrice")

        setPrice(newListPrice)
        setTitle(newListvalues.title)
        setCategory(newListvalues.category)
        setDescription(newListvalues.description)
        setGeo(newListvalues.geo)
        setObtain(newListvalues.obtain)
        setFields(newListvalues.fieldDescription)
        setUploadUrl(uploadUrl)
        setPreviewUrl(previewUrl)
        setCoverUrl(coverUrlStr)
    }, [])

    const submit = async () => {
        if(processing) return
        setProcessing(true)
        await axios.post("/api/lists", {
            title,
            category,
            description,
            geo,
            obtain,
            uploadUrl,
            previewUrl,
            coverUrl,
            price,
            fields
        })
        setProcessing(false)
        router.push("/app/marketplace")
    }

    return (
        <Layout title="Lists">
            <div className="mx-20 p-10 flex flex-col bg-white/70 mb-20 shadow-lg rounded-xl">
                <p className="text-center font-bold text-xl mb-5">Create a list</p>
                <p className="text-center mb-10">Step 4 of 4</p>
                <p className="font-bold mb-10 text-xl">Preview:</p>
                <div className="flex flex-row justify-between">
                    <div className="sm:w-[30vw] 2xl:w-[20vw]">
                        {typeof(title) != "undefined" && (
                            <ListCard preview={true} user={user} item={{
                                cover_url: coverUrl,
                                title,
                                description,
                                price: price
                            }}></ListCard>
                        )}
                    </div>
                    
                    <div className="w-[30vw] object-fit">
                        <img src={previewUrl}/>
                    </div>
                </div>
                
                <div className="flex mx-auto pl-10">
                    <ButtonDark text="Publish" className="mr-0 mt-20" onClick={submit}></ButtonDark>
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