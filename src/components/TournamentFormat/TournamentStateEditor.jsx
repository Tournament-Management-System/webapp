import { DataStore } from "aws-amplify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import {
  EventFormat,
  EventState,
  RoundState,
  TournamentFormat,
  TournamentState
} from "../../models";
import { NonEditJsonArrayTable } from "../util/FormUtils";
import liveLogo from "./live.png";
import "./TournamentFormat.scss";
import {
  mapCompetitorEntryName,
  mapJudgesNameFromId
} from "../util/FunctionUtils";

dayjs.extend(relativeTime);

export default function TournamentStateEditor(props) {
  const navigate = useNavigate();

  const [competitorStates, setCompetitorStates] = useState({});
  const [activeTab, setActiveTab] = useState("judges");
  const [timeElapsed, setTimeElapsed] = useState("");
  const [tournamentState, setTournamentState] = useState({});
  const [eventStates, setEventStates] = useState([]);
  const [judgesName, setJudgesName] = useState([]);

  useEffect(() => {
    (async () => {
      const competitorCopy = [];
      for (const key in tournamentState.competitors) {
        const name = await mapCompetitorEntryName(
          tournamentState.competitors[key].competitorEntryId
        );
        competitorCopy.push({
          active: tournamentState.competitors[key].active,
          name
        });
      }
      setCompetitorStates(competitorCopy);
    })();
  }, [tournamentState]);

  useEffect(() => {
    let timeElapsedInterval;
    (async () => {
      const tstate = await DataStore.query(TournamentState, props.id);
      if (tstate) {
        setTournamentState(tstate);
        setTimeElapsed(dayjs(tstate.createdAt).fromNow());
        timeElapsedInterval = setInterval(
          () => setTimeElapsed(dayjs(tstate.createdAt).fromNow()),
          1000
        );
        const judgesWithName = [];
        for (const judge of tstate.judges) {
          const judgeName = await mapJudgesNameFromId(judge.judgeId, true);
          const newJudgeObject = { judgeName, active: judge.assigned };
          judgesWithName.push(newJudgeObject);
        }
        setJudgesName(judgesWithName);
      }
      const [eventStatesQuery, eventFormatQuery] = await Promise.all([
        DataStore.query(EventState, (es) => es.tournamentStateId.eq(props.id)),
        DataStore.query(EventFormat)
      ]);
      const eventStateQueryCopy = [];
      eventStatesQuery.forEach((esq) => {
        const efMatch = eventFormatQuery.find(
          (efq) => efq.id === esq.eventFormatId
        );
        const esqObject = {
          eventFormatName: efMatch.name,
          eventStateObject: esq
        };
        eventStateQueryCopy.push(esqObject);
      });
      setEventStates(eventStateQueryCopy);
    })();
    return () => clearInterval(timeElapsedInterval);
  }, [props.id, tournamentState.id]);

  if (!tournamentState) {
    return <></>;
  }

  let bodyContent;
  switch (activeTab) {
    case "judges":
      bodyContent = <NonEditJsonArrayTable json={judgesName} />;
      break;
    case "rooms":
      bodyContent = <NonEditJsonArrayTable json={tournamentState.rooms} />;
      break;
    case "competitors":
      bodyContent = <NonEditJsonArrayTable json={competitorStates} />;
      break;
    case "events":
      bodyContent = (
        <div>
          {(!eventStates || eventStates.length === 0) && (
            <div style={{ width: "100%", textAlign: "center", marginTop: 40 }}>
              <div style={{ fontSize: 100 }}>🤖</div>
              <div>We're assigning rounds right now, but we're almost done</div>
            </div>
          )}
          {eventStates.map((es) => (
            <div className="event-picker">
              <h6
                style={{ margin: 0, width: "100%" }}
                onClick={() => navigate(`es/${es.eventStateObject.id}`)}
              >
                {es.eventFormatName}
              </h6>
              {es?.eventStateObject?.awards?.length > 0 ? (
                <Badge bg="success">Completed</Badge>
              ) : (
                <Badge bg="primary">Ongoing</Badge>
              )}
            </div>
          ))}
        </div>
      );
      break;
    default:
      bodyContent = <h4>🍃 Nothings here, pick a tab</h4>;
  }

  return (
    <Container style={{ padding: 0 }}>
      <Col xs={12}>
        <h5>{props.tournamentFormat?.name}</h5>
      </Col>
      <Col
        xs={12}
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <div>
          <img
            src={liveLogo}
            style={{ height: 25 }}
            alt="Live Logo"
            className="animate-flicker"
          />
        </div>
        <p style={{ width: "100%", textAlign: "right", margin: 0 }}>
          Started {timeElapsed}
        </p>
      </Col>
      <Col xs={12}>
        <p>{props.tournamentFormat?.description}</p>
      </Col>
      <Col xs={12} style={{ display: "flex", marginBottom: 20 }}>
        <Button style={{ width: "50%", margin: 5 }}>Complete tournament</Button>
        <Button
          style={{ width: "50%", margin: 5 }}
          variant="outline-danger"
          onClick={async () => {
            const [tournamentFormat] = await Promise.all([
              DataStore.query(TournamentFormat, (tf) =>
                tf.tournamentFormatTournamentStateId.eq(props.id)
              ),
              DataStore.delete(TournamentState, (ts) => ts.id.eq(props.id)),
              DataStore.delete(EventState, (es) =>
                es.tournamentStateId.eq(props.id)
              ),
              DataStore.delete(RoundState, (rs) =>
                rs.tournamentStateId.eq(props.id)
              )
            ]);
            await DataStore.save(
              TournamentFormat.copyOf(
                tournamentFormat[0],
                (updated) => (updated.tournamentFormatTournamentStateId = "")
              )
            );
            props.onTournamentReset();
          }}
        >
          Reset tournament
        </Button>
      </Col>
      <Nav variant="tabs" fill activeKey={activeTab}>
        <Nav.Item>
          <Nav.Link eventKey="judges" onClick={() => setActiveTab("judges")}>
            Judges
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="rooms" onClick={() => setActiveTab("rooms")}>
            Rooms
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="competitors"
            onClick={() => setActiveTab("competitors")}
          >
            Competitors
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="events" onClick={() => setActiveTab("events")}>
            Events
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {bodyContent}
    </Container>
  );
}
