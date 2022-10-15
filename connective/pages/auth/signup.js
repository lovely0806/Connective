import InputField from "../../components/input-field";
import Logo from "../../components/logo";

export default function SignUp() {
    return (
        <main className="flex flex-row min-h-screen min-w-screen">
            <div className="w-[15vw] h-fill rounded-r-lg bg-[#0F172A] flex flex-col">
                <div className="flex flex-row my-5 mx-auto">
                    <img className="my-auto w-[3vw]" src="../assets/logo-icon-white.png"></img>
                    <img className="mt-1 w-[10vw] object-scale-down" src="../assets/logo-text-white.png"></img>
                </div>
            </div>

            <div className="flex flex-col my-auto w-[40vw] mx-auto text-[Montserrat]">
                <p className="font-bold text-3xl">Sign up</p>
                <p className="text-black/50 mt-3">Welcome to Connective. Create your account and have instant access to hundreads of lists.</p>
                <div className="flex flex-col gap-5 mt-10">
                    <InputField name={"Name"} placeholder={"Enter your name"}></InputField>
                    <InputField name={"Email"} placeholder={"Enter your email"}></InputField>
                    <InputField name={"Password"} placeholder={"Enter password"} password={true}></InputField>
                </div>
                <div className="flex flex-row gap-3 mt-5">
                    <input type="checkbox"></input>
                    <p className="my-auto">I accept the <span className="underline cursor-pointer">Terns & Conditions</span> and I have read the <span className="underline cursor-pointer">Privacy Policy</span></p>
                </div>
                <button className="w-full bg-[#0F172A] font-bold text-white py-4 mt-20 rounded-md shadow-md transition-all hover:scale-105 hover:shadow-lg">
                    Sign up & Create my account
                </button>
            </div>
        </main>
    )
}