import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import {io} from "../lib/socket.js"


export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filterUsers = await User.find({ _id: { $ne: loggedInUser } });
    res.status(200).json(filterUsers);
  } catch (error) {
    console.log("Error in message users route", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Errror in get messages controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToSendId } = req.params;
    const { text, image } = req.body;
    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "Message must contain text or image" });
    }
    let imageUrl;
    if (image) {
      const uploadImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadImage.secure_url;
    }
    const newMessage = new Message({
      senderId: myId,
      receiverId: userToSendId,
      text,
      image: imageUrl,
    });
  
    
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(newMessage.receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Errror in sendMessage controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const receiverId = req.params.id;
    const { editedText } = req.body;
    if (!editedText) {
      return res.status(400).json({ message: "Text must be edited" });
    }
    const editedMessage = await Message.findOneAndUpdate(
      { senderId: myId, receiverId: receiverId },
      { text: editedText },
      { new: true }
    );
    if (!editedMessage) {
      return res
        .status(403)
        .json({ message: "You can only edit your own messages" });
    }

    res.status(201).json(editedMessage);
  } catch (error) {
    console.log("Errror in editMessage controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMessgaes = async (req, res) => {
  try {
    const myId = req.user._id;
    const messageToDeleteId = req.params.messsaid;
    const deletedMessage = await Message.findOneAndDelete({
      senderId: myId,
      messageToDeleteId,
    });

    if (!deletedMessage) {
      return res
        .status(404)
        .json({
          message: "Message not found or you are not allowed to delete it",
        });
    }

    res
      .status(200)
      .json({ message: "Message deleted successfully", deletedMessage });
  } catch (error) {
    console.log("Error deleting message:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
