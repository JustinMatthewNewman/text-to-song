"use client";

import { DocumentData } from "firebase/firestore";
import { motion } from "framer-motion";
import React from "react";

type Props = {
  message: DocumentData;
  audioUrl?: string;
};


function Message({ message }: Props) {
  const isChatGPT = message.user.name === "ChatGPT";
  const audioUrl = message.audioUrl; // Get audioUrl from the message object
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`py-5 text-white ${isChatGPT && "bg-[#434654]"}`}
    >
      <div className="flex space-x-5 px-10 max-w-2xl mx-auto">
        <img src={message.user.avatar} alt="" className="h-8 w-8" />
        <div>
          <p className="pt-1 text-sm">{message.text}</p>
          {console.log(audioUrl)}
          {audioUrl && (
            <audio controls>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Message;
