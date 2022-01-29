import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React,{useState} from 'react'
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [Show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const toast=useToast();


    const handleClick=()=>{
        setShow(!Show);
    }

    

    const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
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
  };
    return (
        <VStack spacing="5px" color="black">
            

              <FormControl id="email" isRequired> 
                 <FormLabel>Email</FormLabel>
                 <Input
                  placeholder='Enter Your Email'
                  onChange={(e)=>setEmail(e.target.value)}
                  value={email}
                 />

                 
             </FormControl>


               <FormControl id="password" isRequired> 
                 <FormLabel>Password</FormLabel>
                 <InputGroup size="md">
                  <Input
                   type={Show?"text":"password"}
                   placeholder='Enter Your Password'
                   onChange={(e)=>setPassword(e.target.value)}
                   value={password}
                 />

                 <InputRightElement></InputRightElement>
                   <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                           {Show?"Hide":"Show"}
                      </Button>
                  </InputRightElement> 

               </InputGroup>
             </FormControl>

             <Button
                colorScheme="blue"
                width="100%"
                style={{backgroudColor:"blue",marginTop:15}}
                onClick={submitHandler}
             >
                 Login
             </Button>

              <Button
              varient="solid"
                colorScheme="red"
                width="100%"
                onClick={()=>{
                    setEmail("ram@gmail.com");
                    setPassword("12345678");
                }}
             >
                 Get Guest User Credential
             </Button>
        </VStack>
    )
}

export default Login
