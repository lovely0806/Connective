import axios from "axios";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import Layout from "../../../components/layout";
import Select from "react-select";
import ListCard from "../../../components/marketplace/ListCard";
import { categoryOptions } from "../../../common/selectOptions";
import Image from "next/image";
import searchIcon from "../../../public/assets/search-2.svg";
import RequestModal from "components/modal/request-modal";
import ListMarketplace from "components/marketplace/ListMarketplace";

export default function Dashboard({ user }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredLists, setFilteredLists] = useState([]);
  const [sort, setSort] = useState("New");
  const [filter, setFilter] = useState(0);
  const [search, setSearch] = useState("");
  const [cardDisplayed, setCardDisplayed] = useState(false);

  const sortOptions = [
    { value: "Buyers", label: "Buyers" },
    { value: "Price", label: "Price" },
    { value: "New", label: "New" },
    { value: "Old", label: "Old" },
  ];

  const getLists = async () => {
    let { data } = await axios.get("/api/lists");
    console.log(data);
    setLists(data);
    setLoading(false);
  };

  const updateFilter = (e) => {
    setFilter(e.value);
  };

  const updateSort = (e) => {
    setSort(e.label);
  };

  useEffect(() => {
    getLists();
  }, []);

  useEffect(() => {
    let tempFiltered = [];
    if (filter == 0) {
      tempFiltered = lists;
    } else {
      let temp = [];
      lists.forEach((list) => {
        if (list.category == filter) {
          temp.push(list);
        }
      });
      tempFiltered = temp;
    }

    tempFiltered = tempFiltered.filter((i) => {
      return (
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase()) ||
        i.username.toLowerCase().includes(search.toLowerCase())
      );
    });

    if (sort == "Buyers") {
      tempFiltered = tempFiltered.sort((a, b) => {
        return b.buyers - a.buyers;
      });
    }

    if (sort == "Price") {
      tempFiltered = tempFiltered.sort((a, b) => {
        return b.price - a.price;
      });
    }

    if (sort == "New") {
      tempFiltered = tempFiltered.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    }

    if (sort == "Old") {
      tempFiltered = tempFiltered.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at);
      });
    }

    setFilteredLists([...tempFiltered]);
  }, [filter, sort, lists, search]);

  const displayCardHandler = () => {
    setCardDisplayed((prevState) => !prevState);
  };

  return (
    <Layout title="Marketplace">
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
            options={categoryOptions}
            defaultValue={categoryOptions[0]}
            onChange={updateFilter}
            isMulti={false}
            className="w-[250px] text-[12px]"
          ></Select>
          <Select
            placeholder="Sort"
            options={sortOptions}
            defaultValue={sortOptions[2]}
            onChange={updateSort}
            className="w-[250px] text-[12px]"
          ></Select>
        </div>

        {filteredLists.length > 0 ? (
          <div className="grid grid-cols-3 5bp:grid-cols-4 gap-10 pb-20">
            {filteredLists.map((item, index) => {
              return <ListMarketplace item={item} key={index} />;
            })}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {loading ? (
              <p className="mx-auto mt-20 text-2xl">Loading...</p>
            ) : (
              <div className="flex flex-col items-center">
                {!cardDisplayed && (
                  <div className="w-[100%] flex flex-col items-center mt-[170px]">
                    <p className="w-[710px] font-[Poppins] font-normal text-[24px] leading-[30px] text-[#0D1011] text-center mb-[32px]">
                      Sorry, we could not find the list you re looking for.
                      Submit request so we can get to you the list!
                    </p>
                    <button
                      className="w-[241px] h-[39px] text-center bg-[#061A40] text-white font-[Poppins] font-medium text-[14px] leading-[17px]"
                      onClick={displayCardHandler}
                    >
                      Submit Request
                    </button>
                  </div>
                )}
                {cardDisplayed && (
                  <RequestModal onClick={displayCardHandler} close={()=>{setCardDisplayed(false)}}/>
                )}
              </div>
            )}
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
