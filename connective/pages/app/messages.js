import axios from "axios";
import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import { withIronSession } from "next-iron-session";
import ButtonDark from "components/button-dark";
import Select from "react-select";
import { useRouter } from "next/router";
import Api from "services/api"

const Message = ({text, sent}) => {
  if(sent) {
      return (
          <div  className="ml-auto bg-blue-100 w-3/5 p-2 rounded-lg shadow-md">
              <p>{text}</p>
          </div>
      )
  } else {
      return (
          <div  className="bg-slate-100 w-3/5 p-2 rounded-lg shadow">
              <p>{text}</p>
          </div>
      )
  }
}

const Conversations = ({selectedUser, setSelectedUser, conversations}) => {
  const [filter, setFilter] = useState("")
  const [filteredConversations, setFilteredConversations] = useState([])

  useEffect(() => {
    setFilteredConversations([...conversations])
  }, [conversations])

  useEffect(() => {
    if(filter != "")
      setFilteredConversations(conversations.filter(a => a.username.toLowerCase().includes(filter.toLowerCase()) || a.email.toLowerCase().includes(filter.toLowerCase())))
  }, [filter])

  return (
      <div  className="flex flex-col w-1/5 overflow-y-scroll bg-black/5">
          <input placeholder="Search..." onChange={(e)=>{setFilter(e.target.value)}}  className="outline-none pl-[32px] pr-[14px] text-sm py-2 rounded-full m-5 shadow-lg focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"></input>

          {filteredConversations.map((item, index) => {
              return (
                  <div onClick={()=>{setSelectedUser(item)}}  className={`flex flex-row p-2 cursor-pointer border-b border-slate-200 ${selectedUser?.id == item.id ? "bg-white" : "bg-slate-100"} hover:bg-slate-100/50 transition-all`}>
                      <img src={item.logo ? item.logo : `https://avatars.dicebear.com/api/micah/${item.id}.svg`}  className="w-12 h-12 bg-white rounded-full shadow-lg"/>
                      <p  className="my-auto ml-2 text-md font-medium">{item.username}</p>
                  </div>
              )
          })}
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
      else setMessages([])

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
      console.log(data);
      const unReadMesssages = data.filter(message => {
        return message.read != '1' && message.receiver == user.id && message.sender == selectedUser.id
      })
      const emailz = await axios('/api/messages/unread-messages-mailer', {
        header: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
      })

      // console.log(emailz);


      await readMessages(unReadMesssages)
  }
  
  const readMessages = async (unReadMesssages) => {
    await axios.post('/api/messages/read-message', {
      header: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      data: unReadMesssages
    })
  }

  const sendEmailNotification = async (user, sender, messages) => {
    const message = ``
    // const send = await Api.email('SMTP', { subject: `Connective | ${sender.name} left you ${messages.length} message` })
  }
  return (
      <div  className="flex flex-col h-full w-4/5 rounded-r-lg">
          {selectedUser && (
            <div  className="flex flex-row w-full p-2">
                <p  className="font-medium text-lg w-full mt-2 pb-2 border-b-2 border-slate-100">{selectedUser?.username + " (" + selectedUser?.email + ")"}</p>
            </div>
          )}
          
          <div id="messages-container"  className="h-full overflow-y-scroll p-5 flex flex-col gap-10">
              {messages.map((item, index) => {
                  return (
                      <Message text={item.text} sent={item.sender == user.id}></Message>
                  )
              })}
          </div>
          {selectedUser && (
              <div  className="flex flex-row p-5 gap-5">
                  <input id="message-input" placeholder="Type something..." onChange={(e)=>{setText(e.target.value)}}  className="outline-none w-full pl-[32px] pr-[14px] text-[14px] h-[47px] border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"></input>
                  <button  className="w-fit px-10" onClick={sendMessage}>Send</button>
              </div>
          )}
      </div>
  )
}

const UserDetails = ({selectedUser}) => {
  return (
    <div  className="w-1/5 h-full px-2">
      {selectedUser && (
        <>
          <img src={selectedUser.logo ? selectedUser.logo : `https://avatars.dicebear.com/api/micah/${selectedUser.id}.svg`}  className="w-[40%] mt-5 mx-auto bg-white rounded-full shadow-lg"/>
          <p  className="font-bold text-lg text-center mt-5">{selectedUser.username}</p>

          <p  className="text-sm font-bold mt-10">Contact Details:</p>
          <div  className="flex flex-row gap-2 my-5">
            <div  className="bg-black/5 rounded-full p-[7px] w-8 h-8 shadow-lg">
              <img src="/assets/email.png"></img>
            </div>
            <p  className="text-sm my-auto break-all">{selectedUser.email}</p>
          </div>
          <div  className="flex flex-row gap-2">
            <div  className="bg-black/5 rounded-full p-[7px] w-8 h-8 shadow-lg">
              <img src="/assets/location.png"></img>
            </div>
            <p  className="text-sm my-auto break-all">{selectedUser.location}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default function Messages({ user }) {
  const router = useRouter();
  const { newUser } = router.query;
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [conversations, setConversations] = useState([]);

  const getUsers = async () => {
    const { data } = await axios.get("/api/profiles");
    setUsers(data);
    newUser && setSelectedUser(data.filter((item) => item.id == newUser)[0]);
  };

  const getConversations = async () => {
    const { data } = await axios.get("/api/messages/conversations");
    let temp = [];
    data.forEach((item) => {
      let tempItem = item.filter((a) => a.id != user.id)[0];
      if (temp.filter((a) => a.id == tempItem.id).length == 0)
        temp.push(tempItem);
    });
    setConversations(temp);
  };

  useEffect(() => {
    getUsers();
    getConversations();

    let intervalId = setInterval(() => {
      getConversations();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Layout user={user} title="Messages">
      <div  className="bg-white h-full overflow-clip mt-5 flex flex-row">
        <Conversations
          conversations={conversations}
          setSelectedUser={setSelectedUser}
        ></Conversations>
        <Chat
          user={user}
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          conversations={conversations}
          getConversations={getConversations}
        ></Chat>
        <UserDetails selectedUser={selectedUser}></UserDetails>
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
