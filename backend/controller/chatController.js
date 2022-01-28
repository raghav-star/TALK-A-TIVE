const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  console.log("here");
  const { userId } = req.body;
 

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  console.log(req.user._id+"--"+userId)

   var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  console.log(isChat);

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchData=asyncHandler(async(req,res)=>{
     try{
         Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
         .populate("users","-password")
         .populate("groupAdmin","-password")
         .populate("latestMessage")
         .sort({updateAt:-1})
         .then(async(result)=>{
             result=await User.populate(result,{
                 path:"latestMessage",
                 select:"name email pic"
             })

             res.status(200).send(result);
         })

     }catch(e){
         res.status(401);
         throw new Error(e.message);
     }
})

const createGroup=asyncHandler(async(req,res)=>{
    if(!req.body.name && !req.body.users){
        return res.status(400).send({message:"Please enter group name and member properly"});
    }

    const users=JSON.parse(req.body.users);

    if(users.length<2){
        return res.status(400).send("Enter more the one member");
    }

    users.push(req.user);

    try{
       const groupChat=await Chat.create({
           chatName:req.body.name,
           users:users,
           isGroup:true,
           groupAdmin:req.user,
       });

       const fullGroupChat=await Chat.findOne({_id:groupChat._id})
       .populate("users","-password")
       .populate("groupAdmin","-password");

       res.status(200).json(fullGroupChat);

    }catch(e){
       res.status(400);
        throw new Error(error.message);
    }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});


const removeFromGroup = asyncHandler(async (req, res) => {
  console.log("hellow");
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

module.exports={accessChat,fetchData,createGroup,renameGroup,addToGroup,removeFromGroup};
