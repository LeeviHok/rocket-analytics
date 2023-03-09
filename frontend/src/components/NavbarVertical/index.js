import { NavLink } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faChartPie, faRocket } from '@fortawesome/free-solid-svg-icons';

function NavbarVertical() {
  return (
    <Nav className="navbar-vertical">

      {/* Home */}
      <div className="nav-item brand">
        <Nav.Link as={NavLink} to="/">
          <FontAwesomeIcon icon={faRocket} size="xl" className="nav-icon" />
          Rocket Analytics
        </Nav.Link>
      </div>

      <hr className="divider mb-0" />

      {/* Flight analytics */}
      <div className="nav-item">
        <Nav.Link as={NavLink} to="flight-analytics">
          <FontAwesomeIcon icon={faChartLine} className="nav-icon" />
          Flight Analytics
        </Nav.Link>
      </div>

      {/* Thrust analytics */}
      <div className="nav-item">
        <Nav.Link as={NavLink} to="thrust-analytics">
          <FontAwesomeIcon icon={faChartPie} className="nav-icon" />
          Thrust Analytics
        </Nav.Link>
      </div>

    </Nav>
  );
}

export default NavbarVertical;
