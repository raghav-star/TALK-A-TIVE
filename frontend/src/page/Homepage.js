import { Box, Container, Text ,Tabs ,TabList,Tab,TabPanel,TabPanels} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Login from "../component/Auth/Login.js"
import SignUp from "../component/Auth/SignUp.js"



const Homepage = () => {
  // const history=useHistory();
  // useEffect(() => {
    
  //   const cuser= JSON(localStorage.userInfo);

  //      if(cuser){
  //          history.push("/chats");
  //      }

    
  // }, [history]);
    return (
        <Container maxW="xl" centerContent>
            <Box
             d="flex"
             justifyContent="center"
             p={3}
             bg={"white"}
             w="100%"
             m="40px 0 15px 0"
             borderRadius="lg"
             borderWidth="1px"
            >
              <Text fontSize={"4xl"} fontFamily="Work sans" color="black">
                  Talk-A-Tive
              </Text>
            </Box>

            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Tabs variant='soft-rounded' >
                <TabList mb="1em">
                 <Tab width="50%">Login</Tab>
                  <Tab width="50%">Sign Up</Tab>
                  </TabList>
                 <TabPanels>
                   <TabPanel>
                     <Login/>
                   </TabPanel>
                   <TabPanel>
                      <SignUp/>
                   </TabPanel>
                 </TabPanels>
               </Tabs>
            </Box>
        </Container>
    )
}

export default Homepage
