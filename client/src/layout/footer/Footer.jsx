import { useState } from "react";

import Button from "../formelements/Button";
import Modal from "../elements/Modal";
import { texts } from "../../content/texts";
import "./Footer.css";

const Footer = () => {
  const [openKey, setOpenKey] = useState(null);

  const close = () => setOpenKey(null);

  // Hakee valitun sisällön texts-objektista
  const data = openKey ? texts.legal[openKey] : null;

  return (
    <>
      <footer className="footer">
        <div className="footer__links">
          {/* Napit modaalien avaamiseen */}
          <button type="button" onClick={() => setOpenKey("contact")}>
            OTA YHTEYTTÄ
          </button>
          <button type="button" onClick={() => setOpenKey("privacy")}>
            TIETOSUOJA
          </button>
          <button type="button" onClick={() => setOpenKey("terms")}>
            EHDOT
          </button>
        </div>

        <div className="footer__right">
          <p className="footer__barcode">progressing...</p>
        </div>
      </footer>

      {/* Näyttää valitun sisällön modaalissa */}
      <Modal
        show={!!data}
        onCancel={close}
        header={data?.title}
        footer={
          <Button type="button" variant="ghost" onClick={close}>
            Sulje
          </Button>
        }
      >
        {/* Näytetään teksti rivinvaihdot säilyttäen */}
        <div style={{ whiteSpace: "pre-line" }}>{data?.content}</div>
      </Modal>
    </>
  );
};

export default Footer;
