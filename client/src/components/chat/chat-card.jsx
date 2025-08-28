"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import Sidebar from "./chat-sidebar";
import { Input } from "../ui/input";
import { SendHorizonal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ChatCard = () => {
  const [focusUser, setFocusUser] = useState(null);
  const userDetails = [
    {
      name: "Ram",
      userProfilePicture: "https://example.com/ram.jpg",
      isOnline: true,
      lastConversation: Date.now() - 1000 * 60 * 2,
      chat: [
        { text: "Just got home. What about you?", sender: "xx" },
        { text: "How was your day?", sender: "me" },
        { text: "Yo, what's up!", sender: "xx" },
      ],
    },
    {
      name: "Shyam",
      userProfilePicture: "https://example.com/shyam.jpg",
      isOnline: false,
      lastConversation: Date.now() - 1000 * 60 * 60 * 1,
      chat: [
        { text: "Gotta run, talk later.", sender: "me" },
        { text: "Haha, yeah. Old days were something else.", sender: "xx" },
        { text: "Remember that time in Pokhara?", sender: "me" },
        { text: "What's been up lately?", sender: "me" },
        { text: "Hey, long time!", sender: "xx" },
      ],
    },
    {
      name: "Hari",
      userProfilePicture: "https://example.com/hari.jpg",
      isOnline: true,
      lastConversation: Date.now() - 1000 * 60 * 30,
      chat: [
        { text: "Cool, let's catch up tomorrow then!", sender: "me" },
        { text: "Today’s too packed. Maybe tomorrow?", sender: "xx" },
        { text: "Movie plan tonight?", sender: "me" },
      ],
    },
    {
      name: "Gita",
      userProfilePicture: "https://example.com/gita.jpg",
      isOnline: false,
      lastConversation: Date.now() - 1000 * 60 * 5,
      chat: [
        { text: "Let's grab coffee later?", sender: "me" },
        { text: "Sure! Free after 4?", sender: "xx" },
        { text: "Wanna catch up later today?", sender: "me" },
      ],
    },
    {
      name: "Rita",
      userProfilePicture: "https://example.com/rita.jpg",
      isOnline: true,
      lastConversation: Date.now() - 1000 * 60 * 10,
      chat: [
        { text: "I'm watching that K-drama now. You?", sender: "xx" },
        { text: "Chilling at home. Bored though.", sender: "me" },
        { text: "Heyy, what you up to?", sender: "xx" },
      ],
    },
    {
      name: "Ghanshyam",
      userProfilePicture: "https://example.com/ghanshyam.jpg",
      isOnline: false,
      lastConversation: Date.now() - 1000 * 60 * 60 * 2,
      chat: [
        { text: "I’ll let you know by evening.", sender: "xx" },
        { text: "Did you finish the project?", sender: "me" },
        { text: "Working on the assignment?", sender: "me" },
        { text: "Yo", sender: "me" },
      ],
    },
  ];

  const userClicked = (user) => {
    setFocusUser(user);
  };

  return (
    <div className="relative flex grow w-full justify-center">
      <Card className=" flex mt-1 justify-center items-center w-full h-[500px]">
        <div className="flex gap-0 w-full border-[#00232A] border-2 shadow-md shadow-[#00232A] rounded-xl h-full overflow-hidden">
          <Sidebar users={userDetails} userClicked={userClicked} />
          <div className="h-full w-full">
            <CardHeader className="flex flex-row bg-[#00232A] border-b border-[#00232A] p-1 pl-6">
              {focusUser ? (
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="mx-5 text-[#FFFFFA]">
                    <CardTitle>{focusUser.name}</CardTitle>
                    <CardDescription className="text-xs">
                      End-to-End encrypted
                    </CardDescription>
                  </div>
                </div>
              ) : null}
            </CardHeader>
            <CardContent
              className={cn(
                `h-[75%] w-full flex flex-col-reverse gap-2 p-3 bg-gray-900 border-gray-900 overflow-y-scroll text-[#FFFFFA]
             [scrollbar-width:normal] 
             [scrollbar-color:#4B5563_transparent] 
            `,
                !focusUser && "h-full -mt-3"
              )}
            >
              {focusUser
                ? focusUser.chat.map((item, index) =>
                    item.sender == "me" ? (
                      <div
                        key={index}
                        className="flex flex-col w-[70%] border-[#00232A] border rounded-2xl ml-44 text-small font-roboto font-light bg-[#206094] "
                      >
                        <p className="p-2">{item.text}</p>
                      </div>
                    ) : (
                      <div key={index} className="flex w-[70%] gap-2 ">
                        <Avatar>
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p className="border border-[#00232A] rounded-md w-full p-2 text-sm font-light font-roboto bg-gray-500">
                          {item.text}
                        </p>
                      </div>
                    )
                  )
                : null}
            </CardContent>
            <CardFooter className="flex gap-2 border-t p-2 text-[#FFFFFA] border-[#00232A] bg-[#00232A]">
              {focusUser ? (
                <div className="flex gap-2 w-full items-center px-2">
                  <Textarea
                    placeholder="Enter to chat"
                    className="border-gray-500 resize-none overflow-hidden leading-5"
                    rows={1}
                  />
                  <SendHorizonal />
                </div>
              ) : null}
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatCard;
