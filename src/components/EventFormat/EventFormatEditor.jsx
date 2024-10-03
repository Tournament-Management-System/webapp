import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { EventFormat } from "../../models";
import { FormInput, JSONArrayEditor } from "../util/FormUtils";
import { ConfirmationModal, FatalError } from "../util/MessageUtils";

export default function EventFormatEditor(props) {
  const [fatalError, setFatalError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState();

  const [awards, setAwards] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [name, setName] = useState("");

  const eventFormatObject = {
    name,
    awards,
    rounds
  };

  useEffect(() => {
    (async () => {
      // Throw fatal error if invalid operation
      if (props.operation !== "update" && props.operation !== "create") {
        console.log(`Error: "${props.operation}" is an invalid operation`);
        setFatalError(true);
      }

      if (props.operation === "update") {
        try {
          setLoading(true);
          const eventFormat = await DataStore.query(EventFormat, props.id);
          setName(eventFormat.name ?? "");
          setAwards(JSON.parse(eventFormat.awards) ?? []);
          setRounds(JSON.parse(eventFormat.rounds) ?? []);
        } catch (error) {
          console.log(error);
          setFatalError(true);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [props.id, props.operation]);

  if (fatalError) {
    return <FatalError />;
  }

  if (loading) {
    return <Spinner animation="border" variant="success" />;
  }

  return (
    <>
      <Container>
        <Row>
          <Col xs={12}>
            <FormInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Event name"
            />
          </Col>
          <Col xs={12}>
            <JSONArrayEditor
              label="Awards"
              jArray={awards}
              setJArray={setAwards}
              defaultJson={{
                awardName: "",
                numWinners: "",
                awardCriteria: null
              }}
              fieldConfig={{
                name: "Award",
                primaryField: "awardName",
                awardCriteria: {
                  label: "Award criteria",
                  selectOptions: [
                    {
                      id: "highest_last_round",
                      label: "Highest score of final round"
                    },
                    {
                      id: "highest_all_rounds",
                      label: "Highest cumulative score"
                    }
                  ]
                },
                awardName: {
                  label: "Award name"
                },
                numWinners: {
                  label: "Number of winners allowed"
                }
              }}
            />
          </Col>
          <Col xs={12}>
            <JSONArrayEditor
              label="Rounds"
              jArray={rounds}
              setJArray={setRounds}
              defaultJson={{
                competitorLimit: "",
                groupLimit: "",
                judgesPerRound: "",
                judgingCriteria: null
              }}
              fieldConfig={{
                name: "Round",
                judgingCriteria: {
                  label: "Who gets to move to the next round",
                  selectOptions: [
                    {
                      id: "highest_all_rounds",
                      label: "Highest score from all rounds"
                    },
                    {
                      id: "highest_this_round",
                      label: "Highest score from this round"
                    }
                  ]
                },
                competitorLimit: {
                  label: "Competitors per group"
                },
                groupLimit: {
                  label: "Total number of competition groups"
                },
                judgesPerRound: {
                  label: "Judges per group"
                }
              }}
            />
          </Col>
          <Col
            xs={12}
            style={{ display: "flex", justifyContent: "center", marginTop: 30 }}
          >
            <Button
              onClick={async () => {
                try {
                  if (props.operation === "update") {
                    const original = await DataStore.query(
                      EventFormat,
                      props.id
                    );
                    await DataStore.save(
                      EventFormat.copyOf(original, (updated) => {
                        updated.name = eventFormatObject.name;
                        updated.awards = eventFormatObject.awards;
                        updated.rounds = eventFormatObject.rounds;
                      })
                    );
                  } else if (props.operation === "create") {
                    const newEventFormat = await DataStore.save(
                      new EventFormat(eventFormatObject)
                    );
                    props.onDone(newEventFormat);
                  }
                  setConfirmation("success");
                } catch (e) {
                  console.log(e);
                  setConfirmation("error");
                }
              }}
            >
              <span style={{ margin: "0px 10px 0px 10px" }}>
                Submit event format
              </span>
            </Button>
          </Col>
        </Row>
      </Container>
      <ConfirmationModal
        show={!!confirmation}
        decision={confirmation}
        onClose={() => {
          setConfirmation(undefined);
          if (confirmation === "success") props.onDone();
          else props.onError(eventFormatObject);
        }}
      />
    </>
  );
}
