import React from "react";
export default function AppsText() {
  return (
    <div className="text-left">
      <h2
        style={{
          marginLeft: "12px",
          fontSize: "2rem",
          fontWeight: "700",
          fontFamily:
          "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
        }}
        className="leading-tight"
        >
        A {" "}
        <span
        className="hover:scale-110 ease-in duration-300"
          style={{
            backgroundImage:
            "linear-gradient(240deg, rgba(122,230,212,1) 0%, rgba(38,240,227,1) 27%, rgba(0,212,255,1) 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            display: "inline-block",
          }}
          >
          text-to-song 
        </span>
        {" "}web application that utilizes your
              {" "}
        <span
        className="hover:scale-110 ease-in duration-300"
          style={{
            backgroundImage:
            "linear-gradient(327deg, rgba(122,230,222,1) 0%, rgba(92,38,240,1) 50%, rgba(0,181,255,1) 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            display: "inline-block",
          }}
          >
            input prompt
        </span>
        {" "} to query the OpenAI API for {" "}
        <span
        className="hover:scale-110 ease-in duration-300"
          style={{
            backgroundImage:
            "linear-gradient(345deg, rgba(230,122,122,1) 0%, rgba(139,38,240,1) 50%, rgba(255,0,249,1) 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            display: "inline-block",
          }}
          >
            lyrics
        </span>
        .
      </h2>
    </div>
  );
}

