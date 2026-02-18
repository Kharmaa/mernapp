import ReactDOM from "react-dom";
import "./Backdrop.css";

// Luo taustapeitteen modaalien taakse
// ja renderöi sen React-portaalin avulla erilliseen DOM-elementtiin
const Backdrop = (props) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById("backdrop-hook"),
  );
};

export default Backdrop;
