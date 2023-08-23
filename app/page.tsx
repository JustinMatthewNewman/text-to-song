"use client";
import { SiMusicbrainz } from "react-icons/si";
import { DiCode } from "react-icons/di";
import { AiOutlineWarning } from "react-icons/ai";




import { motion } from "framer-motion";
import React from "react";

export default function Home() {
 return (
  <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center h-screen px-2 text-white"
    >
      <div className="flex flex-col items-center pt-8 md:pt-16 h-screen px-2 text-white overflow-x-auto">
        <h1 className="text-3xl font-bold mb-20 md:mb-28">MelodifyLabs</h1>

        <div className="rounded-lg bg-gray-800 bg-opacity-70 p-6 text-center mb-10">
          <p className="text-md">
            Welcome to one of the world's first text to song based platforms!
          </p>
        </div>
        <div className="rounded-lg bg-gray-800 bg-opacity-70 p-6 text-center mb-10">
        <p className="text-md">
          Melodify is a text-to-song web application that utilizes your input prompt to query the OpenAI API for lyrics. 
        </p>
      </div>


      <div className="rounded-lg bg-gray-800 bg-opacity-70 p-6 text-center mb-10">
        <p className="text-md">
          The obtained lyrics are then passed to our text-to-speech API to generate vocals, which are merged with an existing background audio track to create a song. 
        </p>
      </div>
      <div className="rounded-lg bg-gray-800 bg-opacity-70 p-6 text-center mb-10">
        <p className="text-md">
        The process usually takes around 30 seconds to 1.5 minutes. Please be patient and enjoy. 
        </p>
      </div>
      <div className="rounded-lg bg-gray-800 bg-opacity-70 p-6 text-center mb-10">
        <p className="text-md">
        Once the play button appears, you can refresh the page to select a new backing track.
        </p>
      </div>

      <div className="rounded-lg bg-gray-800 bg-opacity-70 p-6 text-center mb-10">
        <p className="text-md">
          To get started press new iPod.
        </p>
      </div>
    </div>
  </motion.div>
);

}
