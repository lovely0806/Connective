import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Util from "../../../../util/"
import Layout from "../../../../components/layout";
import ButtonDark from "../../../../components/button-dark";
import FileUpload from "../../../../components/file-upload";
import {useRouter} from "next/router"
import {v4 as uuidv4} from "uuid"

export default function NewList({user}) {
    const [processing, setProcessing] = useState(false)
    const [file, setFile] = useState()
    const router = useRouter()

    const submit = async () => {
        if(processing) return
        setProcessing(true)
        let uploadUrl = await Util.uploadFile("list_" + uuidv4(), file)
        localStorage.setItem("uploadUrl", uploadUrl) //Store the upload url in s3
        router.push("/app/lists/create/2")
        setProcessing(false)
    }

    return (
        <Layout title="Lists">
            <div className="bg-white rounded-xl shadow-lg mx-20 p-10">
                <p className="text-center font-bold text-xl mb-5">Create a list</p>
                <p className="text-center mb-10">Step 1 of 4</p>
                <FileUpload text="Upload CSV File" file={file} setFile={setFile} id="CSV Upload"></FileUpload>
                <ButtonDark text="Next" className="mr-0 mt-10" onClick={submit}></ButtonDark>
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