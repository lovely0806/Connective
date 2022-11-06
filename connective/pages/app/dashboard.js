import axios from "axios";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import Sidebar from "../../components/sidebar";
import Util from "../../util/";
import Layout from "../../components/layout";
import ButtonDark from "../../components/button-dark";

const DashboardItem = ({ title, value, icon, color }) => {
  return (
    <div className="flex flex-col px-4 py-6 border-[1px] border-[#0D1011]/[.15] w-[270px] rounded-[10px] gap-1">
      <div className="flex flex-row gap-5 mr-20">
        <p className="font-[Poppins] font-medium text-[12px] leading-[18px] text-[#8A8888]">
          {title}
        </p>
      </div>
      <p className="font-[Montserrat] font-bold text-[32px] leading-[39px] text-[#0D1011]">
        {value == "$undefined" ? "" : value}
      </p>
    </div>
  );
};

const DashboardRow = ({ title, buttonText, buttonOnClick, children }) => {
  return (
    <div className="ml-[64px]">
      <p className="text-2xl font-bold">{title}</p>
      <div className="w-fit">
        <div className="flex flex-row justify-between py-6 w-fit gap-6 rounded-xl">
          {children}
        </div>
        <ButtonDark
          onClick={buttonOnClick}
          text={buttonText}
          className="w-[270px]"
        ></ButtonDark>
      </div>
    </div>
  );
};

const Divider = () => {
  return <div className="w-[1px] h-fill bg-black/10 my-3"></div>;
};

export default function Dashboard({ user }) {
  const [isVerified, setIsVerified] = useState(true);
  const [data, setData] = useState();

  const getVerified = async () => {
    const { data } = await axios.get("/api/stripe/UserValidated");
    setIsVerified(data.verified);
  };

  const getData = async () => {
    let type = await Util.accountType(user.id);
    if (type == "Business") {
      let { data } = await axios.get("/api/dashboard/business");
      console.log(data);
      setData(data);
    } else {
      let { data } = await axios.get("/api/dashboard/individual");
      console.log(data);
      setData(data);
    }
  };

  useEffect(() => {
    getVerified();
    getData();
  }, []);

  const connectwithBankDetails = async () => {
    const { data } = await axios.post("/api/stripe/connect-seller");
    console.log(data);
    window.open(data.accountLink, "_blank");
  };

  return (
    <Layout title="Dashboard">
      {!isVerified && (
        <div className="ml-[64px] flex flex-row gap-5 bg-white p-5 pl-0">
          <p className="my-auto text-[16px]">
            Enter your payment details to begin buying & selling lists:
          </p>
          <ButtonDark
            text="Connect"
            onClick={connectwithBankDetails}
            className="w-fit"
          ></ButtonDark>
        </div>
      )}

      <div className="flex flex-row ml-[64px] gap-4 mb-20 mt-20">
        <DashboardItem
          className="border-0"
          title="EARNINGS"
          value={"$" + data?.totalEarned}
          icon="/assets/dashboard/money.svg"
          color="#D3EBD5"
        ></DashboardItem>
        <DashboardItem
          title="TOTAL SPENT"
          value={"$" + data?.totalSpent}
          icon="/assets/dashboard/money.svg"
          color="#D3EBD5"
        ></DashboardItem>
      </div>

      <div className="flex flex-row gap-8">
        <DashboardRow title="Buyer" buttonText="Explore Marketplace">
          <DashboardItem
            title="List Viewed"
            value={data?.listsViewed}
            icon="/assets/dashboard/list.svg"
            color="#CCE0FE"
          ></DashboardItem>
          <DashboardItem
            title="Lists Bought"
            value={data?.purchasedLists}
            icon="/assets/dashboard/listCheck.svg"
            color="#CCE0FE"
          ></DashboardItem>
        </DashboardRow>

        <DashboardRow title="Seller" buttonText="Create a List">
          <DashboardItem
            title="List Created"
            value={data?.listsCreated}
            icon="/assets/dashboard/list.svg"
            color="#CCE0FE"
          ></DashboardItem>
          <DashboardItem
            title="Lists Sold"
            value={data?.listsSold}
            icon="/assets/dashboard/list.svg"
            color="#CCE0FE"
          ></DashboardItem>
        </DashboardRow>
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
