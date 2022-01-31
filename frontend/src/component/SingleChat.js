import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getSender ,getSenderDetail} from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './miscellenous/ProfileModal';
import UpdateGroupModal from './miscellenous/UpdateGroupModal';
import Lottie from 'react-lottie'
import ScrollableChat from './ScrollableChat.js';
import io from "socket.io-client"
import animationData from "../animations/typing.json";
const ENDPOINT = "https://talk-a-tiive.herokuapp.com/";
var socket,selectedChatCompare;

const SingleChat = ({fethAgain,setFetchAgain}) => {
   const {user,selectedChat,setSelectedChat,notification,setNotification} =ChatState();
   const [loading, setLoading] = useState(false);
   const [messages, setMessages] = useState([]);
   const [newMessage,setNewMessage]=useState("");
     const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
//   console.log(fethAgain);
   const toast=useToast();
     const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

   //  console.log(notification);
     const sendMessage=async(event)=>{
        if(event.key==='Enter' && newMessage){
           try{
               socket.emit("stop typing",selectedChat._id);
               const config={
                 headers:{
                  "Content-Type":"application/json",
                  Authorization:`Bearer ${user.token}`,
                 },
               }
               setNewMessage("");
               const {data}=await axios.post(`/api/message`,{
                  content:newMessage,
                  chatId:selectedChat._id
               },
               config
               );
               //   console.log(data);
              socket.emit("new message",data); 
              setMessages([...messages,data]);

           }catch(error){
               toast(
                  {
                     title:'Error occured',
                     description:'cannot send the message',
                     status:'error',
                     duration:5000,
                     position:'bottom'
                  }
               )
           }
        }     

    }

    const typeHandler=(e)=>{
        setNewMessage(e.target.value);

      //   typing indicator .................
        if(!socketConnected) return;

        if(!typing){
           setTyping(true);
           socket.emit("typing",selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(()=>{
           var timeNow=new Date().getTime();
           var td=timeNow-lastTypingTime;

         //   console.log(td+"-"+timerLength);

           if(timerLength<=td && typing){
            //   console.log(td+"hh");
              socket.emit("stop typing",selectedChat._id);
              setTyping(false);
           }

        },timerLength
        )
    }

      const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.log(data);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat",selectedChat._id);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

     useEffect(()=>{
     socket=io(ENDPOINT);
     socket.emit("setup",user);
     socket.on("connected", () => setSocketConnected(true));
       socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  },[])

     useEffect(() => {
    fetchMessages();

    selectedChatCompare=selectedChat;
  }, [selectedChat]);

  useEffect(()=>{
     socket.on("message recieved",(newMessageRecieved)=>{
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
         //   give notification
             if(!notification.includes(newMessageRecieved)){
                setNotification([...notification,newMessageRecieved]);
                setFetchAgain(!fethAgain);
             }
        }else{
           setMessages([...messages,newMessageRecieved]);
        }
     })
  })

 
  return (
      <>
     { selectedChat ? (
     <>
        <Text
         fontSize={{base:"20px",md:"30px"}}
         pb={3}
         px={2}
         w={"100%"}
         fontFamily={"Work sans"}
         d={"flex"}
         justifyContent={{base:"space-between"}}
         alignItems={"center"}
        >
         <IconButton
           d={{base:"flex",md:"none"}}
           icon={<ArrowBackIcon/>}
           onClick={()=>setSelectedChat("")}
         />
         {
            !selectedChat.isGroup?(<>
                  {
                      getSender(user,selectedChat.users)
                   
                  }
                 <ProfileModal user={getSenderDetail(user,selectedChat.users)}/>

            </>):(
               <>
               {selectedChat.chatName}
               <UpdateGroupModal fethAgain={fethAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
               </>
               )
         }

        </Text> 
        <Box
        d="flex"
        flexDir={"column"}
        justifyContent={"flex-end"}
        p={3}
        bg={"#E8E8E8"}
        w={"100%"}
        h="100%"
        borderRadius={"lg"}
        overflowY={"hidden"}

        >
           {loading ?(
              <><Spinner
                 size={"xl"}
                 w={20}
                 h={20}
                 alignSelf={"center"}
                 margin={"auto"}

              /></>
           ):(
              <div className='messages'>
                  <ScrollableChat messages={messages}/>
              </div>
           )}

           <FormControl onKeyDown={sendMessage}>
           {
              istyping && <div><Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  /></div>
           }
             <Input
               variant={"filled"}
               bg={"#E0E0E0"}
                placeholder='Type your message here...'
                onChange={typeHandler}
                value={newMessage}
             />

           </FormControl>


        </Box>

     </>) : (
         <Box d="flex" alignItems={"center"} justifyContent={"center"} h={"100%"}>
            <Text fontSize="3xl" pb={3} fontFamily={"Work sans"}>
              Click on a user to start Chatting

            </Text>

         </Box>
     )

   }
   </>)
};

export default SingleChat;
