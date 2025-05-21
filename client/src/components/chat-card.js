"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Sidebar from "./sidebar";
import { Input } from "./ui/input";
import { SendHorizonal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";

const ChatCard = () => {
  const chat = [
    { text: "Heello", sender: "me" },
    { text: "Heyyyy", sender: "xx" },
    { text: "How you doing!!", sender: "me" },
  ];
  return (
    <div className="absolute min-h-screen w-full flex grow justify-center items-center ">
      <Card className=" flex justify-center items-center mt-12 h-[500px]">
        <div className="flex gap-0 border-black border-2 rounded-xl h-full overflow-hidden">
          <Sidebar />
          <div>
            <CardHeader className="flex flex-row bg-[#960000] border-b-1 borfer-black p-1 pl-6">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="mx-5">
                <CardTitle>Hari</CardTitle>
                <CardDescription className="text-xs text-gray-800">
                  End-to-End encrypted
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="h-[70%] flex flex-col w-[600px] overflow-x-hidden overflow-y-scroll gap-2 my-2">
              {chat.map((item, index) =>
                item.sender == "me" ? (
                  <div
                    key={index}
                    className="flex flex-col w-[75%] border-1 rounded-md ml-36 p-1 font-light bg-[#307ebe] "
                  >
                    <p>{item.text}</p>
                  </div>
                ) : (
                  <div key={index} className="flex w-[75%] gap-2 ">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="border-1 rounded-md w-full p-1 font-light bg-gray-500">
                      {item.text}
                    </p>
                  </div>
                )
              )}
            </CardContent>
            <CardFooter className="gap-2 border-t-1 p-2 border-black">
              <Textarea
                placeholder="Enter to chat"
                className="border-gray-500 resize-none overflow-hidden leading-5"
                rows={1}
              />

              <SendHorizonal />
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatCard;
