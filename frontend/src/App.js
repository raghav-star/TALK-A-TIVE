import { Button } from "@chakra-ui/react";
import { Route } from "react-router-dom";
import HomePage from "./page/Homepage.js"
import ChatPage from "./page/Chatpage.js"
import "./App.css"

function App() {
  return (
    <div className="App">
    <Route path="/" exact component={HomePage}/>
    <Route path="/chats" exact component={ChatPage}/>
    
    </div>
  );
}

export default App;
