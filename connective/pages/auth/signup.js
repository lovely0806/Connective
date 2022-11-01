import InputField from "../../components/input-field";
import Logo from "../../components/logo";
import axios from "axios"
import {useState} from "react"
import {useRouter} from "next/router"
import OnboardingSidebar from "../../components/onboarding-sidebar";

export default function SignUp() {
    const [name, setName] = useState("")
    const [nameError, setNameError] = useState("")
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [tacError, setTacError] = useState("")
    const router = useRouter()

    const submitAccount = async () => {
        let checkboxChecked = document.getElementById("checkbox").checked

        if(name == "") {
            setNameError("You must enter a name.")
            setEmailError("")
            setPasswordError("")
            setTacError("")
            return
        }
        if(email == "") {
            setEmailError("You must enter an email.")
            setNameError("")
            setPasswordError("")
            setTacError("")
            return
        }
        if(password == "") {
            setPasswordError("You must enter a password.")
            setNameError("")
            setEmailError("")
            setTacError("")
            return
        }
        if(!checkboxChecked) {
            setTacError("You must accept the terms and conditions")
            setPasswordError("")
            setNameError("")
            setEmailError("")
            return
        }
  
        setNameError("")
        setPasswordError("")
        setEmailError("")
  
        await axios({
            method: "post",
            url: "/api/auth/signup",
            data: {username: name, email, password}
        })
        .then(() => {
            router.push("/auth/signin")
        })
        .catch(e => {
            if(e.response.data.error == "Email already exists") {
                setEmailError("Email already exists.")
            } else {
                console.log(e)
            }
        })
    }

    return (
        <main className="flex flex-row min-h-screen min-w-screen">
            <OnboardingSidebar></OnboardingSidebar>

            <div className="flex flex-col my-auto w-[40vw] mx-auto font-[Montserrat]">
                <p className="font-bold text-3xl">Sign up</p>
                <p className="text-black/50 mt-3">Welcome to Connective. Create your account and have instant access to hundreads of lists.</p>
                <div className="flex flex-col gap-5 mt-10">
                    <InputField name={"Name"} placeholder={"Enter your name"} updateValue={setName} errorText={nameError}></InputField>
                    <InputField name={"Email"} placeholder={"Enter your email"} updateValue={setEmail} errorText={emailError}></InputField>
                    <InputField name={"Password"} placeholder={"Enter password"} password={true} updateValue={setPassword} errorText={passwordError}></InputField>
                </div>
                <div className="flex flex-row gap-3 mt-5">
                    <input type="checkbox" id="checkbox"></input>
                    <p className="my-auto">I accept the <span className="underline cursor-pointer">Terms & Conditions</span> and I have read the <span className="underline cursor-pointer">Privacy Policy</span></p>
                </div>
                <p className="text-red-500 font-bold text-[12px]">{tacError}</p>
                <button onClick={submitAccount} className="w-full bg-[#0F172A] font-bold text-white py-4 mt-20 rounded-md shadow-md transition-all hover:scale-105 hover:shadow-lg">
                    Sign up & Create my account
                </button>
            </div>
        </main>
    )
}