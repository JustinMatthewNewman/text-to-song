import { DocumentData } from "firebase/firestore";
import { motion } from "framer-motion";
import React from "react";
import { useState, useEffect } from "react";

import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { TbArrowBigLeftLineFilled, TbArrowBigRightLineFilled } from "react-icons/tb";

type Props = {
  message: DocumentData;
  audioUrl?: string;
};

const storage = getStorage();

function Message({ message }: Props) {
  const [songUrl, setSongUrl] = useState("");
  const [randomInt, setRandomInt] = useState(Math.floor(Math.random() * 37) + 1);

  const isChatGPT = message.user.name === "ChatGPT";
  const audioUrl = message.audioUrl;

  useEffect(() => {
    const fetchSongUrl = async () => {
      const songRef = ref(storage, `music/start${randomInt}.mp3`);
      const url = await getDownloadURL(songRef);
      setSongUrl(url);
    };

    fetchSongUrl();
  }, [randomInt]);

  const handleLeftArrowClick = () => {
    setRandomInt((randomInt - 1 + 5) % 5 + 1);
  };

  const handleRightArrowClick = () => {
    setRandomInt((randomInt + 1) % 5 + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`py-5 text-white ${isChatGPT && "bg-[#434654]"} w-full`}
    >
      <div className="flex space-x-5 px-4 md:px-10 max-w-2xl mx-auto">
        <img src={message.user.avatar} alt="" className="h-8 w-8" />
        <div className="w-full">
          <p className="pt-1 text-sm max-w-[95%]">{message.text}</p>

          <div className="flex justify-center items-center py-5 text-white">
          </div>

          <div className="py-5 text-white">
            <div className="p-1">
              {audioUrl && (
                <div className="w-full">
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
              <div className="p-1">
            {(audioUrl && songUrl) && (
              <div className="flex flex-wrap justify-center">
                <div className="flex items-center space-x-5 w-full">
                  <audio controls src={songUrl} className="w-full">
                    Your browser does not support the <code>audio</code> element.
                  </audio>
                  <TbArrowBigRightLineFilled className="w-10 h-10 button rounded-xl" onClick={handleRightArrowClick}/>
                </div>
              </div>
            )}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default Message;
