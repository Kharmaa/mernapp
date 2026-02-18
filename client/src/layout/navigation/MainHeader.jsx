import "./MainHeader.css";

// Sivuston pääheader-komponentti
// Toimii layout-wrapperina ja näyttää sisällön (children) header-alueella
const MainHeader = (props) => {
  return (
    <header className="header-main">
      <div className="header-main__inner">{props.children}</div>
    </header>
  );
};

export default MainHeader;
