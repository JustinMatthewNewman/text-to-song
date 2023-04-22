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
      className="flex flex-col items-center justify-center h-screen px-2 text-white"
    >
      
    <div
      className="flex flex-col items-center justify-center h-screen
px-2 text-white"
    >
      <h1 className="text-5xl font-bold mb-20">SongGPT+</h1>
      <div className="flex space-x-2 text-center">

        <div>
          <div className="flex flex-col items-center justify-center mb-5">
            {" "}
            <SiMusicbrainz className="h-8 w-8" />
            <h2>Examples</h2>
          </div>
          <div className="space-y-2">
            <p className="infoText">"Write a song in the voice of J. Cole about global warming."</p>
            <p className="infoText">
              "Write a song in the voice of 2Pac about being still alive."
            </p>
            <p className="infoText">"Write a song in the voice of Jay. Z about programming in JavaScript."</p>
          </div>
        </div>

        <div>
          <div className="flex flex-col items-center justify-center mb-5">
            {" "}
            <DiCode className="h-8 w-8" />
            <h2>Capabilities</h2>
          </div>
          <div className="space-y-2">
            <p className="infoText">Connects to the OpenAi API and to create Lyrics.</p>
            <p className="infoText">
              Converts the results into text-to-speech with Uberduck API.
            </p>
            <p className="infoText">Merges the results into a song.</p>
          </div>
        </div>

        <div>
          <div className="flex flex-col items-center justify-center mb-5">
            {" "}
            <AiOutlineWarning className="h-8 w-8" />
            <h2>Limitations</h2>
          </div>
          <div className="space-y-2">
            <p className="infoText">Currently in early development.</p>
            <p className="infoText">
              Limits on the size of the song.
            </p>
            <p className="infoText">Only hip hop music available until next release.</p>{" "}
          </div>
      </div>

      </div>




    </div>
    </motion.div>
  );
}
