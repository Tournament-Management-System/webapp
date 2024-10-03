import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Competitor } from "../../models";
import { FormInput } from "../util/FormUtils";
import { ConfirmationModal, FatalError } from "../util/MessageUtils";

export default function CompetitorEditor(props) {
  const [fatalError, setFatalError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [confirmation, setConfirmation] = useState();
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
          const competitorObject = await DataStore.query(Competitor, props.id);
          setName(competitorObject.name);
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
              label="Competitor name (First , Last)"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Button
              onClick={async () => {
                try {
                  const competitorObject = {
                    name
                  };
                  if (props.operation === "update") {
                    const original = await DataStore.query(
                      Competitor,
                      props.id
                    );
                    await DataStore.save(
                      Competitor.copyOf(original, (updated) => {
                        updated.name = competitorObject.name;
                      })
                    );
                  } else if (props.operation === "create") {
                    const newCompetitor = await DataStore.save(
                      new Competitor(competitorObject)
                    );
                    props.onDone(newCompetitor);
                  }
                  setConfirmation("success");
                } catch (error) {
                  console.log(error);
                  setConfirmation("error");
                }
              }}
            >
              <span style={{ margin: "0px 10px 0px 10px" }}>
                {props.operation === "create"
                  ? "Create Competitor"
                  : "Update Competitor"}
              </span>
            </Button>
          </Col>
        </Row>
      </Container>
      <ConfirmationModal
        show={!!confirmation}
        decision={confirmation}
        onClose={() => {
          const competitorObject = {
            name
          };
          setConfirmation(undefined);
          if (confirmation === "success") props.onDone();
          else props.onError(competitorObject);
        }}
      />
    </>
  );
}
