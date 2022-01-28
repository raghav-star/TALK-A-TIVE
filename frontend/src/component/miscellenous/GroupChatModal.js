import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import UserBageItem from '../userAvatar/UserBageItem';

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName]=useState();
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [search,setSearch]=useState();
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState();

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

    const handleSubmit=async ()=>{
if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chats/createGroup`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    }

    const handleGroup=(userToAdd)=>{
        console.log(userToAdd);
        console.log(selectedUsers.includes(userToAdd));
          if(selectedUsers.includes(userToAdd))
          {
              toast({
                  title:"User already added",
                  status:"warning",
                  duration:5000,
                  isClosable:true,
                  position:"top"
              });
              return;
          }

          setSelectedUsers([...selectedUsers,userToAdd]);
    }

    const handleDelete=(userToDelete)=>{
          setSelectedUsers(
              selectedUsers.filter((sel)=> sel._id!==userToDelete._id)
          )
    }
    
   

    const {user,chats,setChats}=ChatState();

     return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center" >
            <FormControl>
                <Input placeholder='chat name' mb={3}
                  onChange={(e)=>setGroupChatName(e.target.value)}

                />
            </FormControl>

           <FormControl>
                <Input placeholder='Add user like Raghav,Jimmy' mb={3}
                  onChange={(e)=>handleSearch(e.target.value)}

                />
            </FormControl> 
                <Box w={"100%"} d="flex" flexWrap="wrap">
                 {
                     selectedUsers.map(u=>(
                         <UserBageItem key={u._id} user={u}
                         handleFunction={()=>handleDelete(u)}
                         />
                     ))
                 }
               </Box>
              {
                  loading ?( <div>Loading</div> ):(
                      searchResult?.splice(0,4).map((user)=><UserListItem
                       key={user._id}
                       user={user}
                        handleFunction={()=>handleGroup(user)}
                       />)
                  )  
              }

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
};

export default GroupChatModal;
