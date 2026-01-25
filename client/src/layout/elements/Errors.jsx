import Modal from "./Modal";
import Button from "../formelements/Button";

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="Virhe on tapahtunut"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Ok</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
