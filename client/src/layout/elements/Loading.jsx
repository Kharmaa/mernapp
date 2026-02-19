import { useEffect, useState } from "react";
import "./Loading.css";

// Näyttää animoidun tekstin latauksissa
const Loading = ({ asOverlay }) => {
  const text = "Loading...";
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let index = 0;

    // Lisää tekstiä yksi kirjain kerrallaan intervallilla
    const interval = setInterval(() => {
      setVisibleText(text.slice(0, index + 1));
      index = (index + 1) % (text.length + 1);
    }, 150);

    return () => clearInterval(interval);
  }, []);
  return (
    // Voi toimia normaalina loaderina tai overlay-tilassa
    <div className={`loading ${asOverlay ? "loading__overlay" : ""}`}>
      <p className="loading-text">{visibleText}</p>
    </div>
  );
};

export default Loading;
