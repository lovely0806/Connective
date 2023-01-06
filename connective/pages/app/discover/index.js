import axios from "axios";
import { useState, useEffect, useRef} from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { withIronSession } from "next-iron-session";
import Select from "react-select";
import searchIcon from "../../../public/assets/search-2.svg";
import Image from "next/image";
import DiscoverList from "components/discover/list";
import { data } from "autoprefixer";
import { industryOptions } from "common/selectOptions";
import { Recache } from "recache-client";
import Head from 'next/head'
import ReactPaginate from 'react-paginate';

function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div>
            {item}
          </div>
        ))}
    </>
  );
}


export default function Messages({ user}) {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const discoverRef = useRef(null)
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  const router = useRouter();

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  // items per page = 10
  const endOffset = itemOffset + 10;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = filteredUsers.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredUsers.length / 10);

  // Invoke when user click to request another page.
  const handlePageClick = (page) => {
    setPage(page.selected);
    const newOffset = (page.selected * 10) % filteredUsers.length;
    setItemOffset(newOffset);
  };

  const getUsers = async () => {
    let start = Date.now();
    const { data } = await Recache.cached(137, axios.get, ["/api/profiles"]);
    //const {data} = await axios.get("/api/profiles")
    setUsers(data.filter((a) => a.show_on_discover));
    setFilteredUsers(data.filter((a) => a.show_on_discover));
    console.log(data);
    console.log(Date.now() - start);
  };

  useEffect(() => {
    console.log("user------------", user);
    if (typeof user == "undefined") {
      router.push("/auth/signin")
    }
  }, [user]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (a) =>
          a.username.toLowerCase().includes(filter.toLowerCase()) &&
          (category == "All" || a?.industry == category)
      )
    );
  }, [filter, category]);

  useEffect(() => {
    Recache.init("cac121461df5ec95fd867894904f0839b108b03a", 235);

    getUsers();
  }, []);

  return (
    <Layout user={user} title="Discover">
      <Head>
        <title>Discover - Conenctive</title>
      </Head>
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
                setFilter(e.target.value);
              }}
              placeholder="Search for lists"
              className="w-full z-[5] h-fit outline-none pl-10 px-5 py-2 border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300 text-[14px]"
            ></input>
          </div>
          <Select
            placeholder="Categories"
            isMulti={false}
            options={industryOptions}
            onChange={(e) => {
              setCategory(e.label);
            }}
            className="w-[250px] text-[12px]"
          ></Select>
          {/*
          <Select placeholder="Sort"  className="w-[250px] text-[12px]"></Select>
          */}
        </div>
        <div className="flex flex-col w-full gap-10 pb-20" ref={discoverRef}>
          <ReactPaginate
            forcePage={page}
            breakLabel="..."
            nextLabel="next >"
            onPageChange={(page) => handlePageClick(page)}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            activeClassName={'active'}
          />
          <Items currentItems={currentItems.map((item) => {
            return (
              <DiscoverList
                id={item.id}
                title={item.username}
                description={item.description}
                imgURL={item.logo}
                status={item?.status ? item.status : null}
              />
            );
          })} />
          <ReactPaginate
            forcePage={page}
            breakLabel="..."
            nextLabel="next >"
            onPageChange={function(page){
              handlePageClick(page);
              discoverRef.current.scrollIntoView({behavior: "smooth"});
           }}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            activeClassName={'active'}
          />
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
