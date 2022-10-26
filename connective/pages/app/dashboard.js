import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Sidebar from "../../components/sidebar";
import Util from "../../util/"
import Layout from "../../components/layout";
import ButtonDark from "../../components/button-dark";

const DashboardItem = ({title, value, icon, color}) => {
    return (
        <div className="flex flex-col bg-[#F9F9F9] p-5 shadow-lg rounded-lg">
            <div className="flex flex-row gap-5 mr-20">
                <div className={`rounded-full bg-[${color}] w-7 h-7 p-1 flex`}>
                    <img src={icon} className="m-auto"/>
                </div>
                <p className="my-auto text-[#8A8888]">{title}</p>
            </div>
            <p className="text-center font-bold text-4xl">{value}</p>
        </div>
    )
}

const DashboardRow = ({title, buttonText, buttonOnClick, children}) => {
    return (
        <div>
            <p className="text-center text-2xl font-bold mb-5">{title}</p>
            <div className="w-fit mx-auto">
                <div className="flex flex-row mx-auto justify-between bg-[#FFFFFF] py-6 px-10 w-fit gap-10 rounded-xl">
                    {children}
                </div>
                <ButtonDark onClick={buttonOnClick} text={buttonText} className="mb-20 mr-0 mt-5"></ButtonDark>
            </div>
        </div>
    )
}

const Divider = () => {
    return (
        <div className="w-[1px] h-fill bg-black/10 my-3"></div>
    )
}

export default function Dashboard({user}) {
    const connectwithBankDetails = async () => {
        const { data } = await axios.post(process.env.URL + '/api/stripe/connect-seller');
        // further actions here
    };

    return (
        <Layout title="Dashboard">
            <DashboardRow title="Buying" buttonText="Explore Marketplace">
                <DashboardItem title="List Views" value="100" icon="/assets/dashboard/list.svg" color="#CCE0FE"></DashboardItem>
                <Divider></Divider>
                <DashboardItem title="Lists Sold" value="50" icon="/assets/dashboard/listCheck.svg" color="#CCE0FE"></DashboardItem>
                <Divider></Divider>
                <DashboardItem title="Total Earnings" value="$150" icon="/assets/dashboard/money.svg" color="#D3EBD5"></DashboardItem>
            </DashboardRow>

            <DashboardRow title="Selling" buttonText="Create a List">
                <DashboardItem title="List Views" value="100" icon="/assets/dashboard/list.svg" color="#CCE0FE"></DashboardItem>
                <Divider></Divider>
                <DashboardItem title="List Views" value="100" icon="/assets/dashboard/list.svg" color="#CCE0FE"></DashboardItem>
                <Divider></Divider>
                <DashboardItem title="Total Spent" value="$500" icon="/assets/dashboard/money.svg" color="#D3EBD5"></DashboardItem>
            </DashboardRow>
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