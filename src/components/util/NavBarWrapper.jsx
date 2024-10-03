import { Auth } from "aws-amplify";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBarWrapper(props) {
  return (
    <Navbar expand="lg" variant="light" bg="light">
      <Container>
        <Navbar.Brand>
          <b style={{ color: "#539692", fontWeight: 900 }}>Teems</b>
          {props.appType}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            {props.routes &&
              Object.entries(props.routes).map(([label, path]) => (
                <Nav.Link>
                  <Link
                    style={{ textDecoration: "inherit", color: "inherit" }}
                    to={path}
                  >
                    {label}
                  </Link>
                </Nav.Link>
              ))}
          </Nav>
          <Nav>
            <Button onClick={async () => await Auth.signOut()}>Sign out</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
