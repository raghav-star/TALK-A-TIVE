import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat';

const ChatBox = ({fethAgain,setFetchAgain}) => {
   const {selectedChat}=ChatState();
    return (
        <Box
         d={{base:selectedChat?"flex":"none",md:"flex"}}
         alignItems={"center"}
         flexDir={"column"}
         p={3}
         bg={"white"}
         w={{base:"100%",md:"65%"}}
         borderRadius={"lg"}
         borderWidth={"1px"}
        >
        <SingleChat fethAgain={fethAgain} setFetchAgain={setFetchAgain}/>
           
        </Box>
    )
}

export default ChatBox
