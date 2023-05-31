import "./Header.scss";

const Logo = require("../../assets/icons/Logo.svg");

const Header = () => {
  return (
    <header className="header">
      <nav>
        <img src={Logo.default} alt="The intro logo" />
      </nav>
    </header>
  );
};

export default Header;
