import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Sidebar from "../../components/sidebar";
import Util from "../../util/"
import Layout from "../../components/layout";
import ButtonDark from "../../components/button-dark";
import FileUpload from "../../components/file-upload";

export default function Dashboard({user}) {
    const [file, setFile] = useState()

    return (
        <Layout title="Lists">
            <div className="bg-white rounded-xl shadow-lg mx-20 p-10">
                <p className="text-center font-bold text-xl mb-5">Create a list</p>
                <p className="text-center mb-10">Step 1 of 4</p>
                <FileUpload text="Upload CSV File" file={file} setFile={setFile} id="CSV Upload"></FileUpload>
                <ButtonDark text="Next" className="mr-0 mt-10"></ButtonDark>
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