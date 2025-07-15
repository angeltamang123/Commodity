import ChatCard from "@/components/chat/chat-card";
import CustomNavbar from "@/components/navbar";
import React from "react";

const Chat = () => {
  return (
    <div className=" absolute w-screen flex flex-col items-center flex-1">
      <CustomNavbar />
      <ChatCard />
    </div>
  );
};

export default Chat;
