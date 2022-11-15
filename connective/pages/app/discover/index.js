import axios from "axios";
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { withIronSession } from "next-iron-session";
import Select from "react-select";
import searchIcon from "../../../public/assets/search-2.svg";
import Image from "next/image";
import DiscoverList from "components/discover/list";
import { data } from "autoprefixer";

export default function Messages({ user }) {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const { data } = await axios.get("/api/profiles");
    setUsers(data);
    console.log(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout title="Discover">
      <div className="ml-[64px] mr-20 h-screen">
        <div className="flex flex-row w-[100%] mb-20 gap-10 items-center mt-20">
          <div className="w-full relative">
            <div className="absolute z-[10] p-[10px]">
              <Image
                src={searchIcon}
                alt="Search icon"
                width="16px"
                height="16px"
              />
            </div>
            <input
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search for lists"
              className="w-full z-[5] h-fit outline-none pl-10 px-5 py-2 border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300 text-[14px]"
            ></input>
          </div>
          <Select
            placeholder="Categories"
            isMulti={false}
            className="w-[250px] text-[12px]"
          ></Select>
          <Select placeholder="Sort" className="w-[250px] text-[12px]"></Select>
        </div>
        <div className="flex flex-col w-full gap-10">
          {users.map((item) => {
            return (
              <DiscoverList
                id={item.id}
                title={item.username}
                description={item.description}
                imgURL={item.logo}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) {
      return { props: {} };
    }

    return {
      props: { user },
    };
  },
  {
    cookieName: "Connective",
    cookieOptions: {
      secure: process.env.NODE_ENV == "production" ? true : false,
    },
    password: process.env.APPLICATION_SECRET,
  }
);
