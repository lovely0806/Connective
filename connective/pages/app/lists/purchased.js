import axios from "axios";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import Layout from "../../../components/layout";
import Select from "react-select";
import { categoryOptions } from "../../../common/selectOptions";
import ListRow from "../../../components/lists/purchased-list";
import ButtonGreen from "components/button-green";
import ButtonDark from "components/button-dark";
import ButtonLight from "components/button-light";
import Image from "next/image";
import ReviewModal from "components/modal/review-modal";
import Link from "next/link";

export default function PurchasedLists({ user }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewCardDisplayed, setReviewCardDisplayed] = useState(false);

  const getLists = async () => {
    let { data } = await axios.get("/api/lists/purchased");
    console.log(data);
    setLists(data);
    setLoading(false);
  };

  useEffect(() => {
    getLists();
  }, []);

  const displayReviewCard = () => {
    setReviewCardDisplayed((prevState) => !prevState);
  };

  return (
    <Layout title="Purchased Lists">
      <div>
        {lists.length > 0 ? (
          <div className="flex flex-col gap-20 mt-10">
            {lists.map((item, index) => {
              return <ListRow item={item} showModal={displayReviewCard} />;
            })}
          </div>
        ) : (
          <div className="w-full h-full flex">
            <p className="mx-auto mt-20 text-2xl">Loading...</p>
          </div>
        )}
        {reviewCardDisplayed && (
          <div className="w-[100%] mx-auto" onClick={displayReviewCard}>
            <ReviewModal onClick={displayReviewCard} />
          </div>
        )}
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
