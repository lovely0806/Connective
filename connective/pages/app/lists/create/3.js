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

export default function NewList({user}) {
    const [price, setPrice] = useState("")
    const [priceError, setPriceError] = useState("")
    const [file, setFile] = useState()
    const [cover, setCover] = useState()

    const router = useRouter()

    //console.log(JSON.parse(localStorage.getItem("newListValues")))

    const submit = async () => {
        setPriceError("")
        if(price == "") {
            setPriceError("Enter a price")
            return
        }
        if(price <= 0) {
            setPriceError("Enter a price greater than $0")
            return
        }
        if(price.includes(".")) {
            setPriceError("Price must be a whole number")
            return
        }
        if(price > 1000) {
            setPriceError("Price cannot be more than $1000")
            return
        }

        let uploadUrl = await Util.uploadFile("preview_" + uuidv4(), file)
        let coverUrl = await Util.uploadFile("cover_" + uuidv4(), cover)
        console.log(coverUrl)
        
        localStorage.setItem("previewUrl", "")
        localStorage.setItem("coverUrl", "")
        localStorage.setItem("previewUrl", uploadUrl)
        localStorage.setItem("coverUrl", coverUrl)
        localStorage.setItem("newListPrice", price)
        router.push("/app/lists/create/4")
    }

    return (
        <Layout title="Lists">
            <div className="bg-white rounded-xl shadow-lg mx-[20vw] p-10">
                <p className="text-center font-bold text-xl mb-5">Create a list</p>
                <p className="text-center mb-10">Step 3 of 4</p>
                <p className="font-bold mb-10 text-xl">Price and preview:</p>
                <InputField name="Price" placeholder="Enter a price for this list" price={true} updateValue={setPrice} errorText={priceError}></InputField>
                
                <p className="text-sm mb-2 mt-10">Upload a cover image (optional)</p>
                <FileUpload text="Upload cover image" file={cover} setFile={setCover} id="cover upload"></FileUpload>
                
                <p className="text-sm mb-2 mt-10">Upload your CSV preview image</p>
                <FileUpload text="Upload Image" file={file} setFile={setFile} id="preview upload"></FileUpload>
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