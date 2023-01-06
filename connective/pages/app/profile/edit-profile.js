import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { withIronSession } from "next-iron-session";
import Sidebar from "../../../components/sidebar";
import EditBusinessProfile from "../../../components/edit-profile/business";
import EditIndividualProfile from "../../../components/edit-profile/individual";
import Util from "../../../util";
import Head from 'next/head'

export default function EditProfile({ user }) {
  const [accountType, setAccountType] = useState();
  const router = useRouter();

  const getAccountType = async () => {
    if(user)
      setAccountType(await Util.accountType(user.id));
  };
  useEffect(() => {
    if(typeof user == 'undefined') router.push('/auth/signin')
  }, [user]);
  useEffect(() => {
    getAccountType();
  }, []);

  return (
    <main  className="flex flex-row h-screen min-w-screen font-[Montserrat] bg-[#F5F5F5]">
      <Head>
        <title>Edit Profile - Conenctive</title>
      </Head>
      <Sidebar></Sidebar>
      <div  className="h-screen w-screen overflow-y-scroll">
        {accountType == "Business" && (
          <EditBusinessProfile user={user}></EditBusinessProfile>
        )}
        {accountType == "Individual" && (
          <EditIndividualProfile user={user}></EditIndividualProfile>
        )}
      </div>
    </main>
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
