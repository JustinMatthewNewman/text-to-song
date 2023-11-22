"use client";

import Chat from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
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
        <CardHeader className="flex justify-center items-center text-center">
          <ChatInput chatId={id} />
        </CardHeader>
        <CardBody>
          <Chat chatId={id} />
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default ChatPage;
