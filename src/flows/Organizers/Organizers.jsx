import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import CompetitorList from "../../components/Competitor/CompetitorList";
import EventFormatList from "../../components/EventFormat/EventFormatList";
import JudgeList from "../../components/Judge/JudgeList";
import TournamentFormatList from "../../components/TournamentFormat/TournamentFormatList";
import EventStateWrapper from "./EventStateWrapper";
import { Auth } from "aws-amplify";
import { useEffect } from "react";
import { handleUserTypeRedirection } from "../../components/util/FunctionUtils";
import VenueList from "../../components/Venue/VenueList";

export default function Organizers(props) {
  const navigate = useNavigate();

  useEffect(() => {
    handleUserTypeRedirection(navigate);
  }, [navigate]);

  return (
    <div>
      <Navbar expand="lg" variant="light" bg="light">
        <Container>
          <Navbar.Brand>
            <b style={{ color: "#539692", fontWeight: 900 }}>Teems</b>
            Organizer
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link>
                <Link
                  style={{ textDecoration: "inherit", color: "inherit" }}
                  to="/organizer/tournaments"
                >
                  Tournaments
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link
                  style={{ textDecoration: "inherit", color: "inherit" }}
                  to="/organizer/events"
                >
                  Events
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link
                  style={{ textDecoration: "inherit", color: "inherit" }}
                  to="/organizer/judges"
                >
                  Judges
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link
                  style={{ textDecoration: "inherit", color: "inherit" }}
                  to="/organizer/competitors"
                >
                  Competitors
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link
                  style={{ textDecoration: "inherit", color: "inherit" }}
                  to="/organizer/venues"
                >
                  Venues
                </Link>
              </Nav.Link>
            </Nav>
            <Nav>
              <Button
                onClick={async () => await Auth.signOut()}
                variant="outline-primary"
              >
                Sign out
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ marginTop: 30 }}>
        <Routes>
          <Route path="tournaments/*" element={<TournamentFormatList />} />
          <Route
            path="eventstates/:eventStateId/*"
            element={<EventStateWrapper />}
          />
          <Route path="events/*" element={<EventFormatList />} />
          <Route path="judges/*" element={<JudgeList />} />
          <Route path="competitors/*" element={<CompetitorList />} />
          <Route path="venues/*" element={<VenueList />} />
        </Routes>
      </Container>
    </div>
  );
}
