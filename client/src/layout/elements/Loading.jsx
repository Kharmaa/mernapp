import { useEffect, useState } from "react";
import "./Loading.css";

const Loading = ({ asOverlay }) => {
  const text = "Loading...";
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setVisibleText(text.slice(0, index + 1));
      index = (index + 1) % (text.length + 1);
    }, 150);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className={`loading ${asOverlay ? "loading__overlay" : ""}`}>
      <p className="loading-text">{visibleText}</p>
    </div>
  );
};

export default Loading;
