import Link from "next/link"

const OnboardingSidebar = () => {
    return (
        <div className="w-[25vw] h-fill rounded-r-lg bg-[#0F172A] flex flex-col">
            <Link href="https://www.connective-app.xyz">
                <div className="flex flex-row my-5 mx-auto cursor-pointer">
                    <img className="my-auto w-[3vw]" src="../assets/logo-icon-white.png"></img>
                    <img className="mt-1 w-[10vw] object-scale-down" src="../assets/logo-text-white.png"></img>
                </div>
            </Link>
        </div>
    )
}

export default OnboardingSidebar