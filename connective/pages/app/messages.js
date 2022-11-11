import axios from "axios";
import { useState, useEffect } from "react";
import Layout from "../../components/layout"
import { withIronSession } from "next-iron-session";
import ButtonDark from "components/button-dark"
import Select from "react-select"

const Message = ({text, sent}) => {
    if(sent) {
        return (
            <div className="ml-auto bg-blue-100 w-2/5 p-2 rounded-lg shadow-md">
                <p>{text}</p>
            </div>
        )
    } else {
        return (
            <div className="bg-slate-100 w-2/5 p-2 rounded-lg shadow">
                <p>{text}</p>
            </div>
        )
    }
}

const Conversations = ({selectedUser, setSelectedUser, conversations}) => {
    return (
        <div className="flex flex-col gap-1 w-1/5 overflow-y-scroll">
            {conversations.map((item, index) => {
                return (
                    <div onClick={()=>{setSelectedUser(item)}} className="flex flex-row p-2 cursor-pointer bg-slate-100 hover:bg-slate-200 transition-all">
                        <img src={item.logo ? item.logo : `https://avatars.dicebear.com/api/micah/${item.id}.svg`} className="w-12 h-12 bg-white rounded-full shadow-lg"/>
                        <p className="my-auto ml-2 text-lg">{item.username}</p>
                    </div>
                )
            })}

            <div
                className="flex flex-row cursor-pointer text-white rounded-lg bg-[#061A40] hover:bg-[#0a2352] transition-all py-3 m-5"
                onClick={() => setSelectedUser(null)}
            >
            <p className="font-[Poppins] text-center mx-auto">
                New Chat
            </p>
            </div>
        </div>
    )
}

const Chat = ({users, selectedUser, setSelectedUser, user, conversations, getConversations}) => {
    const [messages, setMessages] = useState([])
    const [userOptions, setUserOptions] = useState([])
    const [text, setText] = useState("")
    let prevMessages = 0

    useEffect(() => {
        let temp = []
        users.forEach(user => {
            temp.push({value: user.id, label: user.username + " (" + user.email + ")"})
        })
        setUserOptions(temp)
    }, [users])

    useEffect(() => {
        if(selectedUser != null)
            getMessages()
        let intervalId = setInterval(() => {
            if(selectedUser != null)
                getMessages()
        }, 1000)

        return () => clearInterval(intervalId)
    }, [selectedUser])

    const sendMessage = async() => {
        await axios.post("/api/messages/" + selectedUser.id, {text})
        document.getElementById("message-input").value = ""

        //Re-fetch the list of conversations if the message was sent to a new conversation
        console.log(conversations.filter(a => a.id == selectedUser.id))
        if(conversations.filter(a => a.id == selectedUser.id).length == 0) {
            getConversations()
        }
        setMessages([...messages, {sender: user.id, text}])
    }

    const getMessages = async () => {
        let temp = messages
        const {data} = await axios.get("/api/messages/" + selectedUser.id)
        if(data.length > prevMessages) {
            document.getElementById("messages-container").scroll({ top: document.getElementById("messages-container").scrollHeight, behavior: "smooth"})
        }
        prevMessages = data.length
        setMessages(data)
    }

    return (
        <div className="flex flex-col h-full w-4/5 rounded-r-lg">
            <div className="flex flex-row w-full p-2">
                {selectedUser != null ? (
                    <p className="font-medium text-xl w-full text-center mt-2 pb-2 border-b-2 border-slate-100">{selectedUser.username + " (" + selectedUser.email + ")"}</p>
                ) : (
                    <Select
                        className="font-[Poppins] w-full"
                        onChange={(e) => {
                        setSelectedUser(users.filter(a => a.id == e.value)[0]);
                        }}
                        options={userOptions}
                        placeholder="Search for a User"
                    ></Select>
                )}
            </div>
            <div id="messages-container" className="h-full overflow-y-scroll p-5 flex flex-col gap-10">
                {messages.map((item, index) => {
                    return (
                        <Message text={item.text} sent={item.sender == user.id}></Message>
                    )
                })}
            </div>
            <div className="flex flex-row p-5 gap-5">
                <input id="message-input" placeholder="Type something..." onChange={(e)=>{setText(e.target.value)}} className="outline-none w-full pl-[32px] pr-[14px] text-[14px] h-[47px] border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"></input>
                <button className="w-fit px-10" onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default function Messages({ user }) {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState()
    const [conversations, setConversations] = useState([])

    const getUsers = async() => {
        const {data} = await axios.get("/api/profiles")
        setUsers(data)
    }

    const getConversations = async() => {
        const {data} = await axios.get("/api/messages/conversations")
        let temp = []
        data.forEach(item => {
            let tempItem = item.filter(a => a.id != user.id)[0]
            if(temp.filter(a => a.id == tempItem.id).length == 0)
                temp.push(tempItem)
        })
        setConversations(temp)
    }

    useEffect(() => {
        getUsers()
        getConversations()

        let intervalId = setInterval(() => {
            getConversations()
        }, 5000)

        return () => clearInterval(intervalId)
    }, [])

    return (
      <Layout title="Messages">
        <div className="bg-white shadow-lg rounded-lg h-[75vh] m-10 flex flex-row">
            <Conversations conversations={conversations} setSelectedUser={setSelectedUser}></Conversations>
            <Chat user={user} users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} conversations={conversations} getConversations={getConversations}></Chat>
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