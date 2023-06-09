import { DocumentData } from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { FiPlay, FiPause } from "react-icons/fi";


type Props = {
  message: DocumentData;
  audioUrl?: string;
};

const storage = getStorage();

function Message({ message }: Props) {
  const [song1Url, setSong1Url] = useState("");
  const [song2Url, setSong2Url] = useState("");
  const [randomInt, setRandomInt] = useState(Math.floor(Math.random() * 37) + 1);
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);

  const isChatGPT = message.user.name === "ChatGPT";
  const audioUrl = message.audioUrl;

  useEffect(() => {
    const fetchSongUrls = async () => {
      const song1Ref = ref(storage, `music/start${randomInt}.mp3`);
      const song2Ref = ref(storage, `music/start${randomInt + 1}.mp3`);
      const url1 = await getDownloadURL(song1Ref);
      const url2 = await getDownloadURL(song2Ref);
      setSong1Url(url1);
      setSong2Url(url2);
    };

    fetchSongUrls();
  }, [randomInt]);

  const handleLeftArrowClick = () => {
    setRandomInt((randomInt - 1 + 5) % 5 + 1);
  };

  const handleRightArrowClick = () => {
    setRandomInt((randomInt + 1) % 5 + 1);
  };

  const handlePlay = () => {
    if (audioRef1.current && audioRef2.current) {
      if (audioRef1.current.paused && audioRef2.current.paused) {
        audioRef1.current.currentTime = 20;
        audioRef1.current.play();
        audioRef2.current.play();
      } else {
        audioRef1.current.pause();
        audioRef1.current.currentTime = 0;
        audioRef2.current.pause();
        audioRef2.current.currentTime = 0;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`py-5 text-white ${isChatGPT} w-full bg-gray-700/50`}
    >
      <div className="flex space-x-5 px-4 md:px-10 max-w-2xl mx-auto">
        <img src={message.user.avatar} alt="" className="h-8 w-8" />
        <div className="w-full">
          <p className="pt-1 text-sm max-w-[95%]">{message.text}</p>

          <div className="flex justify-center items-center py-5 text-white"></div>

          <div className="py-5 text-white">
            <div className="p-1">
              {(song1Url && audioUrl) && (
                <div className="w-full hidden">
                  <audio ref={audioRef2} controls className="w-full">
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
            <div className="p-1">
              {(song1Url && audioUrl) && (
                <div className="flex flex-wrap justify-center">
                  <div className="flex items-center space-x-5 w-full hidden">
                    <audio ref={audioRef1} controls src={song1Url} className="w-full">
                      Your browser does not support the <code>audio</code> element.
                    </audio>
   
                  </div>
                  <button className="w-10 h-10 button rounded-full flex items-center justify-center" onClick={handlePlay}>
                      {audioRef1.current && !audioRef1.current.paused ? (
                        <FiPause className="text-white text-xl" />
                      ) : (
                        <FiPlay className="text-white text-xl" />
                      )}
                    </button>
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
