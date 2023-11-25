"use client";

import AI from "@/components/AI";
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
      className="flex flex-col items-center justify-center"
    >
      <div className="fixed top-0">
      <AI chatId={id} />
      </div>
    </motion.div>
  );
}

export default ChatPage;
