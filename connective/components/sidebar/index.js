import {useRouter} from "next/router"
import axios from "axios"

const SidebarItem = ({text, route, icon, onClick}) => {
    const router = useRouter()
    let selected = router.route == route
    if(typeof(onClick) == "undefined") {
        onClick = () => {
            router.push(route)
        }
    }

    return (
        <div onClick={onClick} className={`flex flex-row gap-5 cursor-pointer text-[1.65vh] 2xl:text-[1.4vh] pl-6 py-[1.25vh] 2xl:py-[1.5vh] rounded-r-full w-full transition-all hover:bg-[#777777]/10 ${selected ? "bg-white/10" : ""} ${text == "Sign Out" ? "mt-auto" : ""}`}>
            <img className="w-[2vh] h-[2vh] my-auto" src={icon}/>
            <p>{text}</p>
        </div>
    )
}

const Sidebar = () => {
    const router = useRouter()
    const signout = async () => {
        await axios.get("/api/auth/signout")
        router.push("https://www.connective-app.xyz")
    }

    return (
        <div className="z-10 h-fill w-[15vw] 2xl:w-[13vw] bg-[#0F172A] flex flex-col text-white font-[Montserrat]">
            <div className="flex flex-row my-5 mx-auto">
                <img className="my-auto w-[2vw]" src="/assets/logo-icon-white.png"></img>
                <img className="mt-1 w-[8vw] object-scale-down" src="/assets/logo-text-white.png"></img>
            </div>

            <SidebarItem text="Dashboard" icon="/assets/navbar/DashboardIcon.svg" route="/app/dashboard"></SidebarItem>
            <SidebarItem text="Profile" icon="/assets/navbar/ProfileIcon.svg" route="/app/profile"></SidebarItem>

            <p className="mt-[5vh] mb-5 ml-3 font-bold text-[1.8vh]">As a buyer</p>
            <SidebarItem text="Marketplace" icon="/assets/navbar/MarketplaceIcon.svg" route="/app/marketplace"></SidebarItem>
            <SidebarItem text="Purchased Lists" icon="/assets/navbar/PurchasedListsIcon.svg" route="/app/lists/purchased"></SidebarItem>
            
            <p className="mt-[5vh] mb-5 ml-3 font-bold text-[1.8vh]">As a seller</p>
            <SidebarItem text="Lists" icon="/assets/navbar/ListsIcon.svg" route="/app/lists"></SidebarItem>
            <SidebarItem text="Earnings" icon="/assets/navbar/EarningsIcon.svg" route="/app/earnings"></SidebarItem>
            <SidebarItem text="Requests List" icon="/assets/navbar/RequestsListIcon.svg" route="/app/requests"></SidebarItem>
            
            <p className="mt-[5vh] mb-5 ml-3 font-bold text-[1.8vh]">Support</p>
            <SidebarItem text="Feedback" icon="/assets/navbar/FeedbackIcon.svg" route="/app/feedback"></SidebarItem>
            <SidebarItem text="Contact Us" icon="/assets/navbar/ContactUsIcon.svg" route="https://join.slack.com/t/connective-app/shared_invite/zt-1j40vh5y8-CBdGdfI_8syA8TI81ZaAMQ"></SidebarItem>
            <SidebarItem text="Sign Out" icon="/assets/navbar/SignOutIcon.svg" onClick={signout}></SidebarItem>
        </div>
    )
}

export default Sidebar