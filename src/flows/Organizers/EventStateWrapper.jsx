import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Accordion, Badge, Modal, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { NonEditJsonArrayTable } from "../../components/util/FormUtils";
import { EventFormat, EventState, RoundState } from "../../models";
import { mapCompetitorEntryName } from "../../components/util/FunctionUtils";

function GroupObject(props) {
  const { rs, status } = props;
  const navigate = useNavigate();
  const [competitorNames, setCompetitorNames] = useState({});

  useEffect(() => {
    rs[status].forEach((jsonParse) => {
      const json = JSON.parse(jsonParse);
      Object.entries(json.ranking)
        .sort((a, b) => (a[1] > b[1] ? 1 : -1))
        .forEach(async ([cid]) => {
          const output = await mapCompetitorEntryName(cid);
          setCompetitorNames((cn) => {
            const cnCopy = { ...cn };
            cnCopy[cid] = output;
            return cnCopy;
          });
        });
    });
  }, [rs, status]);

  if (rs[status].length === 0) {
    return <></>;
  }

  return (
    <>
      <h6 style={{ marginTop: 25 }}>
        <b>{status.toUpperCase()}</b>
      </h6>
      {rs[status].map((jsonParse) => {
        const json = JSON.parse(jsonParse);
        return (
          <div style={{ marginTop: 15 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 15
              }}
            >
              <h6 style={{ margin: 0, width: "100%" }}>
                <b>
                  Group ID: {json.groupId} - Room ID: "{json.roomId}"
                </b>
              </h6>
              <Button
                size="sm"
                onClick={() =>
                  navigate(`/judges/${rs.id}/${json.groupId}/start`)
                }
              >
                Judge
              </Button>
            </div>
            {Object.entries(json.ranking)
              .sort((a, b) => (a[1] > b[1] ? 1 : -1))
              .map(([cid, rank]) => {
                return (
                  <div>
                    <div style={{ display: "flex" }}>
                      <div style={{ width: "100%" }}>
                        {competitorNames[cid]}
                      </div>
                      <div style={{ textAlign: "right" }}>{rank ?? "rank"}</div>
                    </div>
                    <div>{json.comments[cid]}</div>
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );
}

export default function EventStateWrapper(props) {
  const navigate = useNavigate();
  const { eventStateId } = useParams();
  const [eventFormat, setEventFormat] = useState({});
  const [eventState, setEventState] = useState({});
  const [roundStates, setRoundStates] = useState([]);
  const [competitorNames, setCompetitorNames] = useState({});

  useEffect(() => {
    eventState?.awards?.forEach?.(async (award) => {
      const json = JSON.parse(award);

      for (const winnerId of json.winners) {
        console.log(winnerId);
        const output = await mapCompetitorEntryName(winnerId);
        setCompetitorNames((cn) => {
          const cnCopy = { ...cn };
          cnCopy[winnerId] = output;
          return cnCopy;
        });
      }
    });
  }, [eventState]);

  useEffect(() => {
    (async () => {
      const [eventStateQuery, roundStateQuery] = await Promise.all([
        DataStore.query(EventState, eventStateId),
        DataStore.query(RoundState, (rs) => rs.eventStateId.eq(eventStateId))
      ]);
      setEventState(eventStateQuery);
      setRoundStates(roundStateQuery);
      const eventFormatQuery = await DataStore.query(EventFormat, (ef) =>
        ef.id.eq(eventStateQuery.eventFormatId)
      );
      setEventFormat(eventFormatQuery[0]);
    })();
  }, [eventStateId]);

  return (
    <Modal show fullscreen onHide={() => navigate(-2)}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: 750 }}>
          <Link to={-1}>{"< Go back to tournament"}</Link>
          <h3 style={{ marginTop: 20 }}>{eventFormat.name} </h3>
          {eventState.awards?.length > 0 ? (
            <Badge bg="success">Completed</Badge>
          ) : (
            <Badge bg="primary">Ongoing</Badge>
          )}
          {eventState.awards?.length > 0 && (
            <h5 style={{ marginTop: 30 }}>Awards</h5>
          )}
          {eventState?.awards?.map?.((award) => {
            const awardJson = JSON.parse(award);
            return (
              <div>
                <h6>{awardJson.awardName}</h6>
                <NonEditJsonArrayTable
                  json={awardJson.winners.map((winnerId, idx) => ({
                    position: idx + 1,
                    winner: competitorNames[winnerId]
                  }))}
                />
              </div>
            );
          })}
          <h5 style={{ marginTop: 30 }}>Round States</h5>
          <Accordion defaultActiveKey="0">
            {roundStates
              .sort((a) => (a.completed.length === 0 ? -1 : 1))
              .map((rs, idx) => {
                return (
                  <Accordion.Item eventKey={`${idx}`}>
                    <Accordion.Header>
                      <span style={{ width: "100%" }}>Round ID: "{rs.id}"</span>{" "}
                      {rs.completed.length}/
                      {rs.completed.length +
                        rs.started.length +
                        rs.assigned.length +
                        rs.queued.length}{" "}
                      groups completed
                    </Accordion.Header>
                    <Accordion.Body>
                      <div style={{ marginBottom: 30 }}>
                        <GroupObject rs={rs} status="completed" />
                        <GroupObject rs={rs} status="started" />
                        <GroupObject rs={rs} status="assigned" />
                        <GroupObject rs={rs} status="queued" />
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
          </Accordion>
          <div style={{ marginBottom: 50 }} />
        </div>
      </Modal.Body>
    </Modal>
  );
}
