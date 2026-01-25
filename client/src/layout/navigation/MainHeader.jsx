import "./MainHeader.css";

const MainHeader = (props) => {
  return (
    <header className="header-main">
      <div className="header-main__inner">{props.children}</div>
    </header>
  );
};

export default MainHeader;
