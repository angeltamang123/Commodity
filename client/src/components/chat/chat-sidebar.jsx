import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Users = ({ user, userClicked }) => {
  return (
    <div
      className="flex gap-2 text-center overflow-hidden cursor-pointer"
      onClick={() => {
        userClicked(user);
      }}
    >
      <Avatar>
        <AvatarImage
          className="size-10"
          src="https://github.com/shadcn.png"
          alt="@shadcn"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {user.isOnline && (
        <div className="absolute ml-6 mt-7 size-3 border  rounded-full bg-green-800" />
      )}
      <div className="flex flex-col truncate">
        <p className="text-[#FFFFFA] text-sm text-start font-normal">
          {user.name}
        </p>
        {user.chat[0].sender !== "me" ? (
          <p className="text-xs font-extralight text-[#FFFFFA]">
            {user.chat[0].text}
          </p>
        ) : (
          <p className="text-xs font-extralight text-[#FFFFFA]">
            You: {user.chat[0].text}
          </p>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ users, userClicked }) => {
  let sortedUser = [...users];
  sortedUser = sortedUser.sort((a, b) => {
    return b.lastConversation - a.lastConversation;
  });

  return (
    <div className="flex flex-col bg-[#00232A] -mt-1 w-1/4  font-bold border-r border-[#00232A] z-10 -mx-1 p-5 justify-start gap-2">
      <p className="font-bold text-[#AF0000] text-center text-lg underline underline-offset-4">
        Commodity
      </p>
      <div className="gap-4 mt-4 flex flex-col">
        {sortedUser.map((item, index) => (
          <Users key={index} user={item} userClicked={userClicked} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
