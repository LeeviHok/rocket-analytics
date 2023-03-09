import { Outlet } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Footer from '../components/Footer';
import NavbarHorizontal from '../components/NavbarHorizontal';
import NavbarVertical from '../components/NavbarVertical';

function MainLayout() {
  return (
    <div id="page-wrapper">
      <NavbarVertical />

      <div id="main-wrapper">
        <NavbarHorizontal />

        <Container id="content">
          <Row>
            <Col>
              <Outlet />
            </Col>
          </Row>
        </Container>

        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
