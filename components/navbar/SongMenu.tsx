"use client";

import { firestore } from "@/firebase/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";

import ChatRow from "../ChatRow";
import NewChat from "../NewChat";
import { Button } from "@nextui-org/button";
import {
  Card,
  CardHeader,
  Avatar,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";

type Props = {};

export default function SongMenu({}: Props) {
  const { data: session } = useSession();
  const [chats, loading] = useCollection(
    session &&
      query(
        collection(firestore, `users/${session?.user?.uid!}/chats`),
        orderBy("createdAt", "asc")
      )
  );

  return (
    <div className="mt-6 mb-12">
      <Card className="w-[88vw]">
        {session && (
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={session?.user?.image!}
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  {session?.user.name!}
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  @{session?.user.name!}
                </h5>
              </div>
            </div>
          </CardHeader>
        )}
        <Divider />

        <CardBody className="px-3 py-0 text-small text-default-400 max-h-[60vh]">
          {loading && (
            <div className="animate-pulse text-center">
              <p> Loading iPods...</p>
            </div>
          )}
          {chats?.docs.map((chat) => (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              key={chat.id}
            >
              <ChatRow id={chat.id} session={session} />
            </motion.div>
          ))}
        </CardBody>
        <Divider />
        <CardFooter className="flex-row justify-between">
          <NewChat session={session} />
          <Button
            className="m-2"
            color="danger"
            radius="full"
            size="lg"
            onPress={() => signOut()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
