"use client";

import AI from "@/components/AI";
import Chat from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { motion } from "framer-motion";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

function ChatPage({ params: { id } }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-col h-screen overflow-y-hidden items-center justify-center"
    >
      <Card className="max-w-[90vw]  md:max-w-[70vw] min-w-[70vw] m-2 mt-24">
        {/* <CardHeader className="flex justify-center items-center text-center">
          <ChatInput chatId={id} />
        </CardHeader>
        <CardBody className="flex justify-center items-center text-center">
          <Chat chatId={id} />
        </CardBody> */}
        <AI chatId={id}/>
      </Card>
    </motion.div>
  );
}

export default ChatPage;
