// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { adminDb } from "@/firebase/firebaseAdmin";
import query from "@/utils/queryApi";
import admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  answer: string;
  audioUrl?: string;

};

const removeSongStructureLabels = (text: string) => {
  const labelsToRemove = [
    "Intro:",
    "Verse 1:",
    "Verse 2:",
    "Verse 3:",
    "Verse 4:",
    "Verse 5:",
    "Verse 6:",
    "Verse 7:",
    "Chorus:",
    "Bridge:",
    "Hook:",
    "Outro:",
  ];

  let newText = text;

  labelsToRemove.forEach((label) => {
    newText = newText.replace(new RegExp(label, "g"), "");
  });

  newText = newText.replace(/(\[|\()(.*?)(\]|\))/g, "").trim();

  return newText;
};

async function sendTextToUberduck(text: string, selectedArtist: any) {
  console.log("Sending lyrics to text-to-speech..")
  const requestOptions = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization:
        "Basic cHViX2ZxandmcHlhbWlsa2NnbXV0Zzpwa19mYWYyZjNhZC04ZDBjLTRjNTktYjQyNi1jNWQ2ZGE4ODAwYmY=",
    },
    body: JSON.stringify({
      voice: "lj",
      pace: 1,
      voicemodel_uuid: selectedArtist.voicemodel_uuid,
      speech: removeSongStructureLabels(text),
    }),
  };

  const response = await fetch("https://api.uberduck.ai/speak", requestOptions);
  const data = await response.json();
  const uuid = data.uuid;

  let status = null;
  while (status === null || status.path === null) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const statusResponse = await fetch(
      `https://api.uberduck.ai/speak-status?uuid=${uuid}`,
      { headers: { accept: "application/json" } }
    );
    const statusData = await statusResponse.json();
    status = statusData;
  }

  return status.path;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session, selectedArtist } = req.body;
    console.log(prompt)
  if (!prompt) {
    res.status(400).json({ answer: "Please Provide a prompt" });
    return;
  }

  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat Id" });
    return;
  }

  // ChatGpt Query

  const response = await query(prompt, chatId, model);
  const message: Message = {
    text: response || "ChatGpt unable to answer that!",
    createdAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "ChatGPT",
      name: "ChatGPT",
      email: "ChatGPT",
      avatar:
        "https://drive.google.com/uc?export=download&id=1OrdAuQD_iWnqLUv1yerPwkvqvgHyw-al",
    },
  };
  const audioUrl = await sendTextToUberduck(message.text, selectedArtist);
  console.log(audioUrl);
  await adminDb
    .collection("users")
    .doc(session?.user?.uid)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);

    res.status(200).json({ answer: message.text, audioUrl: audioUrl });
  }
