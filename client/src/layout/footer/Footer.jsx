import { useState } from "react";

import Button from "../formelements/Button";
import Modal from "../elements/Modal";
import { legalTexts } from "../../content/importantTexts";
import "./Footer.css";

const Footer = () => {
  const [openKey, setOpenKey] = useState(null);

  const close = () => setOpenKey(null);
  const data = openKey ? legalTexts[openKey] : null;

  return (
    <>
      <footer className="footer">
        <div className="footer__links">
          <button type="button" onClick={() => setOpenKey("contact")}>
            CONTACT
          </button>
          <button type="button" onClick={() => setOpenKey("privacy")}>
            PRIVACY POLICY
          </button>
          <button type="button" onClick={() => setOpenKey("terms")}>
            TERMS
          </button>
        </div>

        <div className="footer__right">
          <p className="footer__barcode">progressing...</p>
        </div>
      </footer>

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
        <div style={{ whiteSpace: "pre-line" }}>{data?.content}</div>
      </Modal>
    </>
  );
};

export default Footer;
