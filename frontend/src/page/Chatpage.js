import { Box } from '@chakra-ui/react';
import React,{useEffect,useState} from 'react'
import ChatBox from '../component/ChatBox';
import SideDrawer from '../component/miscellenous/SideDrawer';
import MyChats from '../component/MyChats';
import { ChatState } from '../Context/ChatProvider.js';
const Chatpage = () => {

  

   const { user } = ChatState();
   const [fethAgain,setFetchAgain]=useState(false);

    return (
        <div style={{width:"100%"}}>
           {user && <SideDrawer/>}
             
             <Box d="flex" justifyContent={"space-between"} w={"100%"} h="91.6vh" p={"10px"}>
               {user && <MyChats  fethAgain={fethAgain}/>}
               {user && <ChatBox fethAgain={fethAgain}  setFetchAgain={setFetchAgain}/>}
            </Box>
        </div>
    )
}

export default Chatpage
