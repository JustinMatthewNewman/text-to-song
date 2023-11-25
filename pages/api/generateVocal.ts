// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { adminDb } from "@/firebase/firebaseAdmin";
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
        "Basic cHViX3J3c2Rva3R5bnJ3YXFvbHB1ejpwa19kZjJlYWUyNy0wNWFmLTQ2NDktOTQwNi05MTZlZDA3ZjhiODc=",
    },
    body: JSON.stringify({
      pace: 1,
      voice: selectedArtist.name,
      speech: removeSongStructureLabels(text).slice(0, 999),
    }),
  };

  
  const response = await fetch("https://api.uberduck.ai/speak", requestOptions);
  console.log(response);
  const data = await response.json();
  console.log(data);
  const uuid = data.uuid;

  let status = null;
  while (status === null || status.path === null) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const statusResponse = await fetch(
      `https://api.uberduck.ai/speak-status?uuid=${uuid}`,
      { headers: { accept: "application/json" } }
    );
    const statusData = await statusResponse.json();
    console.log(statusData);
    status = statusData;
  }

  return status.path;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, session, selectedArtist } = req.body;
  console.log(req.body)
  if (!prompt) {
    res.status(400).json({ answer: "Please Provide a prompt" });
    return;
  }

  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat Id" });
    return;
  }


  const message: archivedLyric = {
    text: prompt || "We had some trouble creating those lyrics, please try again!",
    createdAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "Melodify",
      name: "Melodify",
      email: "Melodify",
      avatar:
        "https://drive.google.com/uc?export=download&id=1OrdAuQD_iWnqLUv1yerPwkvqvgHyw-al",
    },
  };


  const audioUrl = await sendTextToUberduck(message.text, selectedArtist);
  console.log(audioUrl);
  console.log('\n')
  console.log('users/'+session?.user?.uid+'/chats/'+chatId+'/messages')
  await adminDb
    .collection("users")
    .doc(session?.user?.uid)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);

    res.status(200).json({ answer: message.text, audioUrl: audioUrl });
  }
