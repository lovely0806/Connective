import axios from "axios";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import Layout from "../../../components/layout";
import Util from "../../../util";
import ListRow from "../../../components/lists/list-row";
import Link from "next/link";

export default function Lists({ user }) {
  const [lists, setLists] = useState([]);

  const getLists = async () => {
    let type = await Util.accountType(user.id);
    if (type == "Business") {
      setLists((await axios.get("/api/profiles/business")).data.lists);
    }
    if (type == "Individual") {
      setLists((await axios.get("/api/profiles/individual")).data.lists);
    }
  };

  useEffect(() => {
    getLists();
  }, []);

  return (
    <Layout user={user} title="Lists for Sale"  className="relative items-center">
      <Link href="/app/lists/create/1">
        <div  className="absolute flex flex-row right-[277px] mt-[55px]">
          <button  className="w-[172px] text-[12px] font-[Poppins] bg-[#061A40] text-white rounded-[8px] absolute">
            Create New List
          </button>
        </div>
      </Link>

      <div>
        <div  className="mx-20 ml-[64px] flex flex-row flex-wrap gap-[32px] mt-[64px]">
          {lists.map((item, index) => {
            return <ListRow item={item} key={index}></ListRow>;
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
