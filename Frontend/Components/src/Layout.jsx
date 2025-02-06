import { Outlet } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";

const Layout = ({ pageClass }) => {
  return (
    <div>
      {/* temporary Bootstrap Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Dino Dash</Navbar.Brand>
        </Container>
      </Navbar>

      <div className={`container-fluid ${pageClass}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
