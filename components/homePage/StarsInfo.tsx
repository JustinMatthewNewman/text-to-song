"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
} from "@nextui-org/react";

export default function StarsInfo() {
  return (
    <Card className="mt-6 mb-6">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">How is this possible?</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="py-2">
          The obtained lyrics are then passed to our text-to-speech API to
          generate vocals, which are merged with an existing background audio
          track to create a song.
        </p>
      </CardBody>
     
    </Card>
  );
}
