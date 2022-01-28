const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage=async(req,res)=>{
     const {content,chatId}= req.body;
     
     if(!content || !chatId){
         console.log("Invalid data passed for sending message");
         return res.sendStatus(400);
     }

     var newMessage = {
         sender:req.user._id,
         content:content,
         chat:chatId,
     }
     
     try{
        // console.log(newMessage);
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    const c= await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);      
     }catch(err){
         console.log(err.message);
         res.status(400);
         throw new Error(err.message);
     }
}

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
      // console.log(messages);
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports={sendMessage,allMessages}