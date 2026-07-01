import React from "react";

export default function Marquee({
  children,
  vertical = false,
  reverse = false,
  pauseOnHover = false,
  repeat = 3,
  className = "",
}) {
  return (
    <div
      className={`group flex overflow-hidden p-2 gap-4 ${
        vertical ? "flex-col" : "flex-row"
      } ${className}`}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={`
            flex shrink-0 justify-around gap-4
            ${vertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee"}
            ${reverse ? "[animation-direction:reverse]" : ""}
            ${
              pauseOnHover
                ? "group-hover:[animation-play-state:paused]"
                : ""
            }
          `}
        >
          {children}
        </div>
      ))}
    </div>
  );
}