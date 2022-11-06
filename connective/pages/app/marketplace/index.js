import axios from "axios";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import Layout from "../../../components/layout";
import Select from "react-select";
import ListCard from "../../../components/marketplace/ListCard";
import { categoryOptions } from "../../../common/selectOptions";

export default function Dashboard({ user }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredLists, setFilteredLists] = useState([]);
  const [sort, setSort] = useState("New");
  const [filter, setFilter] = useState(0);
  const [search, setSearch] = useState("");

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

  return (
    <Layout title="Marketplace">
      <div className="ml-[100px] mr-20 h-screen">
        <div className="flex flex-row w-full mb-20 gap-10">
          <input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search for lists"
            style={{
              background: "white url(/assets/search.svg) no-repeat 5px 5px",
            }}
            className="h-fit w-full mr-32 outline-none pl-10 px-5 py-2 border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"
          ></input>
          <Select
            options={categoryOptions}
            defaultValue={categoryOptions[0]}
            onChange={updateFilter}
            isMulti={false}
            placeholder="Categories"
            className="w-96"
          ></Select>
          <Select
            options={sortOptions}
            defaultValue={sortOptions[2]}
            onChange={updateSort}
            placeholder="Sort"
            className="w-96"
          ></Select>
        </div>

        {filteredLists.length > 0 ? (
          <div className="flex flex-row flex-wrap gap-[7px] mb-[65px]">
            {filteredLists.map((item, index) => {
              return <ListCard item={item} key={index}></ListCard>;
            })}
          </div>
        ) : (
          <div className="w-full h-full flex">
            {loading ? (
              <p className="mx-auto mt-20 text-2xl">Loading...</p>
            ) : (
              <p className="mx-auto mt-20 text-2xl">
                No lists exist for this category yet :(
              </p>
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
