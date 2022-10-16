import {useRouter} from "next/router"
import axios from "axios"

const SidebarItem = ({text, route, icon, selected, onClick}) => {
    return (
        <div onClick={onClick} className={`flex flex-row gap-5 cursor-pointer text-[1.75vh] 2xl:text-[1.5vh] pl-6 py-[1.25vh] 2xl:py-[1.5vh] rounded-r-full w-full transition-all hover:bg-[#777777]/10 ${selected ? "bg-white/10" : ""} ${text == "Sign Out" ? "mt-auto" : ""}`}>
            <img className="w-[2vh] h-[2vh] my-auto" src={icon}/>
            <p>{text}</p>
        </div>
    )
}

const Sidebar = () => {
    const router = useRouter()
    const signout = async () => {
        await axios.get("/api/auth/signout")
        router.push("/")
    }

    return (
        <div className="z-10 h-fill w-[15vw] 2xl:w-[13vw] bg-[#0F172A] flex flex-col text-white text-[Montserrat]">
            <div className="flex flex-row my-5 mx-auto">
                <img className="my-auto w-[2vw]" src="../assets/logo-icon-white.png"></img>
                <img className="mt-1 w-[8vw] object-scale-down" src="../assets/logo-text-white.png"></img>
            </div>

            <SidebarItem text="Dashboard" icon="/assets/navbar/DashboardIcon.svg"></SidebarItem>
            <SidebarItem text="Profile" icon="/assets/navbar/ProfileIcon.svg" selected={true}></SidebarItem>

            <p className="mt-[5vh] mb-5 ml-3 font-bold text-[2vh]">As a buyer</p>
            <SidebarItem text="Marketplace" icon="/assets/navbar/MarketplaceIcon.svg"></SidebarItem>
            <SidebarItem text="Purchased Lists" icon="/assets/navbar/PurchasedListsIcon.svg"></SidebarItem>
            
            <p className="mt-[5vh] mb-5 ml-3 font-bold text-[2vh]">As a seller</p>
            <SidebarItem text="Lists" icon="/assets/navbar/ListsIcon.svg"></SidebarItem>
            <SidebarItem text="Earnings" icon="/assets/navbar/EarningsIcon.svg"></SidebarItem>
            <SidebarItem text="Requests List" icon="/assets/navbar/RequestsListIcon.svg"></SidebarItem>
            
            <p className="mt-[5vh] mb-5 ml-3 font-bold text-[2vh]">Support</p>
            <SidebarItem text="Feedback" icon="/assets/navbar/FeedbackIcon.svg"></SidebarItem>
            <SidebarItem text="Contact Us" icon="/assets/navbar/ContactUsIcon.svg"></SidebarItem>
            <SidebarItem text="Sign Out" icon="/assets/navbar/SignOutIcon.svg" onClick={signout}></SidebarItem>
        </div>
    )
}

export default Sidebar