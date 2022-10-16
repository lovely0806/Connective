import axios from "axios"
import {useState, useEffect} from "react"
import {withIronSession} from "next-iron-session"
import Util from "../../util/"
import Layout from "../../components/layout";
import ButtonDark from "../../components/button-dark";
import Select from "react-select"

const ListCard = ({item}) => {
    return (
        <div className="bg-white flex flex-col gap-5 p-5 rounded-xl shadow-lg h-fit">
            <img className="rounded-xl object-cover h-[40%]" src={item.img}/>
            <p className="font-bold text-xl">{item.title}</p>
            <p className="text-[#8A8888]">{item.description}</p>
            <div className="flex flex-row gap-10 mx-auto">
                <div className="bg-[#CCE0FE] text-black/70 font-bold p-2 px-5 rounded-full w-32 text-center">
                    {item.buyers} buyers
                </div>
                <div className="bg-[#D3EBD5] text-black/70 font-bold p-2 px-5 rounded-full w-32 text-center">
                    ${item.price}
                </div>
            </div>
            <div className="mx-auto mt-10 pl-10">
                <ButtonDark text="Explore" className="ml-0 mr-0 mb-0 mt-0"></ButtonDark>
            </div>
        </div>
    )
}

export default function Dashboard({user}) {
    const categoryOptions = [
        {value: "Web Development", label: "Web Development"},
        {value: "Event Planning", label: "Event Planning"},
        {value: "Investors", label: "Investors"}
    ]

    const sortOptions = [
        {value: "Buyers", label: "Buyers"},
        {value: "Price", label: "Price"},
        {value: "New", label: "New"},
        {value: "Old", label: "Old"}
    ]

    return (
        <Layout title="Marketplace">
            <div className="mx-20 h-screen">
                <div className="flex flex-row w-full mb-20 gap-10">
                    <input placeholder="Search for lists here" style={{background: "white url(/assets/search.svg) no-repeat 5px 5px"}} className="w-full mr-32 outline-none pl-10 px-5 py-2 border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"></input>
                    <Select options={categoryOptions} placeholder="Categories" className="w-96"></Select>
                    <Select options={sortOptions} placeholder="Sort" className="w-96"></Select>
                </div>

                <div className="grid grid-cols-3 gap-10 pb-20">
                    <ListCard item={{
                        img: "/assets/banners/leaves-min.jpeg",
                        title: "Airtable Formula Playground",
                        description: "Lörem ipsum co-creation mjuta liksom William Jensen som Dan Samuelsson. Avvisningsfrekvens halvtaktsjobb och Olof Hedlund Tomas Lundströ",
                        buyers: 10,
                        price: "45"
                    }}></ListCard>

                    <ListCard item={{
                        img: "/assets/banners/leaves-min.jpeg",
                        title: "Airtable Formula Playground",
                        description: "Lörem ipsum co-creation mjuta liksom William Jensen som Dan Samuelsson. Avvisningsfrekvens halvtaktsjobb och Olof Hedlund Tomas Lundströ ",
                        buyers: 10,
                        price: "45"
                    }}></ListCard>

                    <ListCard item={{
                        img: "/assets/banners/leaves-min.jpeg",
                        title: "Airtable Formula Playground",
                        description: "Lörem ipsum co-creation mjuta liksom William Jensen som Dan Samuelsson. Avvisningsfrekvens halvtaktsjobb och Olof Hedlund Tomas Lundströ",
                        buyers: 10,
                        price: "45"
                    }}></ListCard>

                    <ListCard item={{
                        img: "/assets/banners/leaves-min.jpeg",
                        title: "Airtable Formula Playground",
                        description: "Lörem ipsum co-creation mjuta liksom William Jensen som Dan Samuelsson. Avvisningsfrekvens halvtaktsjobb och Olof Hedlund Tomas Lundströ",
                        buyers: 10,
                        price: "45"
                    }}></ListCard>
                </div>
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