import InputField from "../../components/input-field";
import Logo from "../../components/logo";
import axios from "axios"
import {useState, useEffect} from "react"
import {useRouter} from "next/router"
import {withIronSession} from "next-iron-session"
import OnboardingSidebar from "../../components/onboarding-sidebar";
import ProfileTypeSelector from "../../components/onboarding/profile-type-selector";
import FileUpload from "../../components/file-upload";
import Select from "react-select"

export default function CreateProfile({user}) {
    const [name, setName] = useState("")
    const [nameError, setNameError] = useState("")
    const [description, setDescription] = useState("")
    const [logo, setLogo] = useState()
    const [url, setUrl] = useState("")
    const [location, setLocation] = useState("")
    const [pfp, setPfp] = useState("")
    const [type, setType] = useState("buisness")

    const industryOptions = [
        {value: "Web3", label: 'Web3'},
        {value: "Software Development", label: "Software Development"},
        {value: "Event Planning", label: "Event Planning"}
    ]

    const sizeOptions = [
        {value: "<10", label: "<10"},
        {value: "10-50", label: "10-50"},
        {value: "50-100", label: "50-100"},
        {value: "100-200", label: "100-200"},
        {value: "200-1000", label: "200-1000"},
        {value: "1000+", label: "1000+"}
    ]

    const router = useRouter()

    const submitAccount = async () => {
        if(email == "") {
            setEmailError("You must enter an email.")
            setPasswordError("")
            return
        }
        if(password == "") {
            setPasswordError("You must enter a password.")
            setEmailError("")
            return
        }
  
        setPasswordError("")
        setEmailError("")
  
        await axios({
            method: "post",
            url: "/api/auth/sessions",
            data: {email, password}
        })
        .then((res) => {
            if(res.status == 201) {
                console.log("success")
                router.push("/projects")
            }
        })
        .catch(e => {
            if(e.response.status == 403 || e.response.data.error == "Account does not exist") setPasswordError("Incorrect email or password")
        })
    }

    return (
        <main className="flex flex-row min-h-screen min-w-screen">
            <OnboardingSidebar></OnboardingSidebar>
            
            <div className="flex flex-col w-[40vw] mx-auto text-[Montserrat] bg-[#F9F9F9] rounded-xl shadow-md p-5 my-20">
                <div className="flex flex-row gap-10 mb-10">
                    <p className="text-3xl font-bold">Create {type == "buisness" ? "Company" : "Individual"} Profile</p>
                </div>
                
                <p className="text-center mb-5 font-medium text-lg">Which best describes you?</p>

                <ProfileTypeSelector type={type} setType={setType}></ProfileTypeSelector>

                {type == "buisness" ? (
                    <div className="flex flex-col gap-5 mt-10">
                        <InputField name={"Name"} placeholder={"Enter company name"} updateValue={setName} errorText={nameError}></InputField>
                        <InputField name={"Description"} placeholder={"Enter company description"} updateValue={setDescription} textarea={true}></InputField>
                        <div>
                            <p className="text-sm mb-2">Logo</p>
                            <FileUpload text="Upload company logo" file={pfp} setFile={setPfp}></FileUpload>
                        </div>
                        <InputField name={"Website"} placeholder={"Enter company website URL"} updateValue={setUrl}></InputField>
                        <InputField name={"Location"} placeholder={"Enter where your company is located"} updateValue={setLocation}></InputField>
                        <div className="flex flex-row justify-between gap-10">
                            <div className="w-full">
                                <p className="text-sm mb-2">Industry</p>
                                <Select className="w-full" options={industryOptions} placeholder="Choose your industry"></Select>
                            </div>
                            <div className="w-full">
                                <p className="text-sm mb-2">Size</p>
                                <Select className="w-full" options={sizeOptions} placeholder="Choose your company size"></Select>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 mt-10">
                        <InputField name={"Name"} placeholder={"Enter company name"} updateValue={setName} errorText={nameError}></InputField>
                        <InputField name={"Bio"} placeholder={"Enter your bio"} updateValue={setDescription} textarea={true}></InputField>
                        <div>
                            <p className="text-sm mb-2">Profile picture</p>
                            <FileUpload text="Upload profile picture" file={pfp} setFile={setPfp}></FileUpload>
                        </div>
                        <InputField name={"Location"} placeholder={"Enter your location"} updateValue={setLocation}></InputField>
                    </div>
                )}
                
                <button onClick={submitAccount} className="w-full bg-[#0F172A] font-bold text-white py-4 mt-20 rounded-md shadow-md transition-all hover:scale-105 hover:shadow-lg">
                    Create Profile
                </button>
            </div>
        </main>
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