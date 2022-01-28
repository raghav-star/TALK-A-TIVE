import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBageItem';
import UserListItem from '../userAvatar/UserListItem';

const UpdateGroupModal = ({fethAgain,setFetchAgain,fetchMessages}) => {
    // console.log(fethAgain);
   const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName,setGroupChatName]=useState();
    const [search,setSearch]=useState();
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState();
    const [renameLoading,setRenameLoading]=useState();

    const {selectedChat,user,setSelectedChat}=ChatState();

    const toast=useToast();

   
    const handleSearch=async(query)=>{

        if(!query){
            return;
        }

        try{ 
            setLoading(true);
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
             
            const {data}=await axios.get(`/api/user?search=${query}`,config);
            console.log(data);
           setSearchResult(data);
             
            setLoading(false);
        }
        catch(e){
            console.log(e);
               toast({
                   title:'Error Occured',
                   description:'Failed to load the search result',
                   status:'error',
                   duration:5000,
                   isClosable:true,
                   position:'bottom-left'
               })
        }

    }
    const handleRename=async()=>{
        if(!groupChatName)
        return;

        try{
            setRenameLoading(true);
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data}=await axios.put(`/api/chats/renameGroup`,
               {
                   chatId:selectedChat._id,
                   chatName:groupChatName
               },
               config
            )

            setSelectedChat(data);
            setFetchAgain(!fethAgain);
            // console.log(fethAgain);
            setRenameLoading(false);
        }catch(e){
            setRenameLoading(false);
            toast({
        title: "Failed to Rename the Chat!",
        description: e.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
        }
         

        setGroupChatName("");
    }

     const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chats/addToGroup`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fethAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chats/removeFromGroup`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fethAgain);
      fetchMessages();
    
      setLoading(false);
    } catch (error) {
        console.log(error);
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };


  return   <>
      <IconButton icon={<ViewIcon/>} d={{base:"flex"}} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            d="flex"
            justifyContent={"center"}
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
                 <Box w={"100%"} d="flex" flexWrap="wrap">
                 {
                     selectedChat.users.map(u=>(
                         <UserBadgeItem key={u._id} user={u}
                         handleFunction={()=>handleRemove(u)}
                         />
                     ))
                 }
               </Box>
               <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
             <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
             {
                  loading ?( <div>Loading</div> ):(
                      searchResult?.splice(0,4).map((user)=><UserListItem
                       key={user._id}
                       user={user}
                        handleFunction={()=>handleAddUser(user)}
                       />)
                  )  
              }
          </ModalBody>

           <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
};

export default UpdateGroupModal;
