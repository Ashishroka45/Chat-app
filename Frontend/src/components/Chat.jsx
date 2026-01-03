import React, { useEffect ,useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const Chat = () => {
  const bottomRef = useRef(null);
  const { authUser } = useAuthStore();
  const { getMessages, messages, isMessagesLoading, selectedUser,subscribeToMessages,unSubscribeToMessages } =
    useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
      return () => unSubscribeToMessages()
  }, [selectedUser._id, getMessages,subscribeToMessages,unSubscribeToMessages]);

  
  useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto ">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  return (
    <div className="flex-1 flex flex-col overflow-auto ">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          // {console.log("Mesage",message);}
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className=" rounded-full border size-10">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile-pic"
                />
              </div>
            </div>
            <div className="chat-header">
              {message.senderId === authUser._id
                ? authUser.fullName
                : selectedUser.fullName}
              <time className="text-xs opacity-50">
               {new Date(message.createdAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}
              </time>
            </div>
            <div className="chat-bubble flex flex-col ">
              {message.image && (
                <img src={message.image} alt="Attachment"
                className=" rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
            
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default Chat;
