import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Util from "../../../../util/"
import Layout from "../../../../components/layout";
import ButtonDark from "../../../../components/button-dark";
import {useRouter} from "next/router"
import InputField from "../../../../components/input-field";

export default function Dashboard({user}) {
    const [file, setFile] = useState()

    const [title, setTitle] = useState("")
    const [titleError, setTitleError] = useState("")

    const [description, setDescription] = useState("")
    const [descriptionError, setDescriptionError] = useState("")

    const [geo, setGeo] = useState("")
    const [geoError, setGeoError] = useState("")

    const [obtain, setObtain] = useState("")
    const [obtainError, setObtainError] = useState("")

    const router = useRouter()

    const submit = async () => {
        setTitleError("")
        setDescriptionError("")
        setGeoError("")
        setObtainError("")

        if(!Util.verifyField(title, setTitleError, "Please enter a title.") || 
           !Util.verifyField(description, setDescriptionError, "Please enter a description.") || 
           !Util.verifyField(geo, setGeoError, "Please enter a value.") || 
           !Util.verifyField(obtain, setObtainError, "Please enter a value.")) return
        
        localStorage.setItem("newListValues", JSON.stringify({title, description, geo, obtain}))
        router.push("/app/lists/create/3")
    }

    return (
        <Layout title="Lists">
            <div className="bg-white rounded-xl shadow-lg mx-[20vw] p-10">
                <p className="text-center font-bold text-xl mb-5">Create a list</p>
                <p className="text-center mb-10">Step 2 of 4</p>
                <p className="font-bold mb-10 text-xl">List details:</p>
                <div className="flex flex-col gap-10">
                    <InputField name="Title" placeholder="Name your list" updateValue={setTitle} errorText={titleError}></InputField>
                    <InputField name="Description" textarea={true} placeholder="Enter a description" updateValue={setDescription} errorText={descriptionError}></InputField>
                    <InputField name="Geographical area of resources" placeholder="Where are the resources on your list located?" updateValue={setGeo} errorText={geoError}></InputField>
                    <InputField name="How did you obtain this list?" textarea={true} placeholder="Describe how you compiled this list" updateValue={setObtain} errorText={obtainError}></InputField>
                </div>
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