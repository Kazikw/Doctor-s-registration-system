import "./navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <h1>HANKMED</h1>
      <div className="navbar-list">
        <a className="navbar-item" href="">
          <span>Odbierz wyniki badań</span>
        </a>
        <a className="navbar-item" href="">
          <span>Zapisz się na badanie</span>
        </a>
        <a className="navbar-item" href="">
          <span>Zapisz się na wizytę</span>
        </a>
        <a className="navbar-item" href="">
          <span>Odwołaj wizytę</span>
        </a>
        <a className="navbar-item" href="">
          <span>Odwołaj badanie</span>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
