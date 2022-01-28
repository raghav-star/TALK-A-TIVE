import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import React,{useState} from 'react'
import axios from "axios";
import { useHistory } from "react-router";

const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmPassword, setconfirmPassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [Show, setShow] = useState(false);
    const [loading,setPicLoading]=useState(false);
      const toast = useToast();
      const history=useHistory();

    const handleClick=()=>{
        setShow(!Show);
    }

     const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "talk-a-tive");
      data.append("cloud_name", "do2pc9kk6");
      fetch("https://api.cloudinary.com/v1_1/do2pc9kk6/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

    const submitHandler=async()=>{
       setPicLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
        
    }
    
    return (
        <VStack spacing="5px" color="black">
             <FormControl id="first-name" isRequired> 
                 <FormLabel>name</FormLabel>
                 <Input
                  placeholder='Enter Your name'
                  onChange={(e)=>setName(e.target.value)}
                 />
             </FormControl>

              <FormControl id="email" isRequired> 
                 <FormLabel>Email</FormLabel>
                 <Input
                  placeholder='Enter Your Email'
                  onChange={(e)=>setEmail(e.target.value)}
                 />

                 
             </FormControl>


               <FormControl id="password" isRequired> 
                 <FormLabel>Password</FormLabel>
                 <InputGroup size="md">
                  <Input
                   type={Show?"text":"password"}
                   placeholder='Enter Your Password'
                   onChange={(e)=>setPassword(e.target.value)}
                 />

                 <InputRightElement></InputRightElement>
                   <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                           {Show?"Hide":"Show"}
                      </Button>
                  </InputRightElement> 

               </InputGroup>
             </FormControl>


             <FormControl id="confirmPassword" isRequired> 
                 <FormLabel>Confirm Password</FormLabel>
                 <InputGroup size="md">
                  <Input
                   type={Show?"text":"password"}
                   placeholder='Enter Your Confirm Password'
                   onChange={(e)=>setconfirmPassword(e.target.value)}
                 />

                 <InputRightElement></InputRightElement>
                   <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                           {Show?"Hide":"Show"}
                      </Button>
                  </InputRightElement> 

               </InputGroup>
             </FormControl>


             <FormControl id="pic"> 
                 <FormLabel>Upload a picture</FormLabel>
                 <Input
                  type="file"
                  p={1.5}
                  accept="image/*"
                  onChange={(e)=>postDetails(e.target.files[0])}
                  
                 />   
             </FormControl>

             <Button
                colorScheme="blue"
                width="100%"
                style={{backgroudColor:"blue",marginTop:15}}
                onClick={submitHandler}
                isLoading={loading}
             >
                 Sign Up
             </Button>
        </VStack>
    )
}

export default SignUp
