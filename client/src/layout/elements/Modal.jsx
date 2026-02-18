import ReactDOM from "react-dom";

import Backdrop from "./Backdrop";
import "./Modal.css";

// Varsinainen modaalin sisältö, joka renderöidään portaalin kautta
// Renderöidään modaalisisältö DOM-elementtiin
const ModalOverlay = (props) => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      {/* Otsikkoalue */}
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>

      {/* Sisältö ja footer */}
      <div>
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};
// Modal-komponentti hallitsee näkyvyyttä ja backdropia
const Modal = (props) => {
  if (!props.show) return null;

  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}

      {/* Itse modaalin sisältö */}
      <ModalOverlay {...props} />
    </>
  );
};

export default Modal;
