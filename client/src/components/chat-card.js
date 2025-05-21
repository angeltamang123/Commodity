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

const ChatCard = () => {
  const chat = [
    { text: "Heello", sender: "me" },
    { text: "Heyyyy", sender: "xx" },
    { text: "How you doing!!", sender: "me" },
  ];
  return (
    <Card className="relative min-h-screen flex justify-center items-center -mt-32">
      <div className="flex gap-0 border-black border-2 rounded-xl overflow-hidden">
        <Sidebar />
        <div>
          <CardHeader className="bg-slate-400 p-1 pl-6">
            <CardTitle>Hari</CardTitle>
            <CardDescription className="text-xs">
              End-to-End encrypted
            </CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex flex-col w-96">
            <p>Chat logs of hari</p>
            <div className="overflow-hidden">
              {chat.map((item) =>
                item.sender == "me" ? (
                  <div className="flex flex-col w-10/12 ml-16 bg-blue-700 ">
                    <p>me</p>
                    <p>{item.text}</p>
                  </div>
                ) : (
                  <div className="flex flex-col w-10/12 bg-gray-400">
                    <p>Hari</p>
                    <p>{item.text}</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
          <CardFooter className="gap-2 border-t-2 border-black">
            <Input placeholder="Enter your chat to Hari"></Input>
            <SendHorizonal />
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
