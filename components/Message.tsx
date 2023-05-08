import { DocumentData } from "firebase/firestore";
import { motion } from "framer-motion";
import React from "react";
import { useState, useEffect } from "react";

import toWav from "audiobuffer-to-wav";


import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { TbArrowBigLeftLineFilled, TbArrowBigRightLineFilled } from "react-icons/tb";

type Props = {
  message: DocumentData;
  audioUrl?: string;
};

const storage = getStorage();

function Message({ message }: Props) {
  const [songUrl, setSongUrl] = useState("");
  const [randomInt, setRandomInt] = useState(Math.floor(Math.random() * 37) + 1);
  const [combinedAudioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);



  const isChatGPT = message.user.name === "Melodify";
  const audioUrl = message.audioUrl;

  useEffect(() => {
    const fetchSongUrl = async () => {
      const songRef = ref(storage, `music/start${randomInt}.mp3`);
      const url = await getDownloadURL(songRef);
      setSongUrl(url);
    };

    fetchSongUrl();
  }, [randomInt]);

  useEffect(() => {
    if (songUrl && audioUrl) {
      combineAndPlay(audioUrl, songUrl);
    }
  }, [songUrl, audioUrl]);

  const handleLeftArrowClick = () => {
    setRandomInt((randomInt - 1 + 5) % 5 + 1);
  };

  const handleRightArrowClick = () => {
    setRandomInt((randomInt + 1) % 5 + 1);
  };

  const combineAndPlay = async (url1: string, url2: string) => {
    setIsLoading(true);
    const progressIncrement = 100 / 4;
    // Create an online audio context to decode audio data
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    

    // Fetch the audio files
    const response1 = await fetch(url1);
    const response2 = await fetch(url2);

    console.log("GOT URLS:")
    console.log(response1, response2);
    setProgress((prevProgress) => prevProgress + progressIncrement);

    // Convert the fetched files to array buffers
    const arrayBuffer1 = await response1.arrayBuffer();
    const arrayBuffer2 = await response2.arrayBuffer();

    // Decode the audio data of url2 to get its duration
    const audioBuffer2 = await audioContext.decodeAudioData(arrayBuffer2);
    const durationInSeconds = audioBuffer2.duration;

    // Create an offline audio context with the duration of url2
    const offlineAudioContext = new OfflineAudioContext(
      2,
      44100 * durationInSeconds,
      44100
    );

    // Decode the audio data of url1 using the offline audio context
    const audioBuffer1 = await offlineAudioContext.decodeAudioData(
      arrayBuffer1
    );

    // Create audio buffer sources for both audio files
    const source1 = offlineAudioContext.createBufferSource();
    const source2 = offlineAudioContext.createBufferSource();

    // Set the audio buffer sources to the decoded audio data
    source1.buffer = audioBuffer1;
    source2.buffer = audioBuffer2;

    // Connect the audio buffer sources to the offline audio context's destination (output)
    source1.connect(offlineAudioContext.destination);
    source2.connect(offlineAudioContext.destination);

    // Play source2 immediately
    source2.start(0);

    // Calculate the delay in the OfflineAudioContext's time
    const delayInSeconds = 27;
    const startTime = delayInSeconds;

    // Start source1 after the delay
    source1.start(startTime);

    console.log("MERGING AUDIO")
    setProgress((prevProgress) => prevProgress + progressIncrement);

    // Render the combined audio buffer
    const combinedAudioBuffer = await offlineAudioContext.startRendering();

    // Export the combined audio buffer as a Blob
    const bufferToWavBlob = (buffer: AudioBuffer) => {
      const wav = toWav(buffer);
      return new Blob([new DataView(wav)], { type: "audio/wav" });
    };
    
    const combinedAudioBlob = bufferToWavBlob(combinedAudioBuffer);

    console.log("Combined successfully, sending to storage.")
    setProgress((prevProgress) => prevProgress + progressIncrement);

    // Upload the combined audio Blob to Firebase Storage
    const storageRef = ref(
      storage,
      `creations/MelodifyLabs-${Date.now()}.wav`
    );
    await uploadBytes(storageRef, combinedAudioBlob);

    console.log("Upload completed successfully.")
    setProgress((prevProgress) => prevProgress + progressIncrement);

    // Fetch the download URL of the uploaded combined audio
    const combinedAudioUrl = await getDownloadURL(storageRef);
      console.log(combinedAudioUrl);
    // Update the state with the fetched download URL
    setAudioUrl(combinedAudioUrl);
    setIsLoading(false);
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

          <div className="flex justify-center items-center py-5 text-white">
          </div>

          <div className="py-5 text-white">
            <div className="p-1">
            {combinedAudioUrl && (
              <>
                <div className="flex space-x-4">
                  <div className="">
                    <audio src={combinedAudioUrl} controls />
                    {/* Lyrics Button */}
                  </div>
                </div>
              
              </>
            )}
{isLoading && (
  <progress className="w-full progressBar" value={progress} max="100" />
)}

            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default Message;