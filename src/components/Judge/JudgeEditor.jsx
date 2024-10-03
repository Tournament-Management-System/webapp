// Patrick
import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Judge } from "../../models";
import { FormInput } from "../util/FormUtils";
import { ConfirmationModal, FatalError } from "../util/MessageUtils";

export default function JudgeEditor(props) {
  const [validationError, setValidationError] = useState(null);
  const [fatalError, setFatalError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [confirmation, setConfirmation] = useState();

  const [name, setName] = useState("");
  const [nameIsValid, setNameIsValid] = useState(null);

  const computeInvalidMsg = (isValid, message) =>
    isValid === false ? message : undefined;

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
          const judgeObject = await DataStore.query(Judge, props.id);
          setName(judgeObject.name);
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
              label="Judge name"
              invalidMessage={computeInvalidMsg(
                nameIsValid,
                "Please enter a name of 20 chars or less"
              )}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameIsValid(/^.{0,20}$/i.test(e.target.value));
              }}
            />
          </Col>
          {validationError && (
            <Col xs={12}>
              <div style={{ color: "#dc3545" }}>
                <p>
                  The following fields are invalid, please double check your
                  entry
                </p>
                <ul>{!nameIsValid && <li>Invalid name</li>}</ul>
              </div>
            </Col>
          )}
          <Col xs={12} style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={async () => {
                if (nameIsValid) {
                  try {
                    const judgeObject = {
                      name
                    };
                    if (props.operation === "update") {
                      const original = await DataStore.query(Judge, props.id);
                      await DataStore.save(
                        Judge.copyOf(original, (updated) => {
                          updated.name = judgeObject.name;
                        })
                      );
                    } else if (props.operation === "create") {
                      const newJudge = await DataStore.save(
                        new Judge(judgeObject)
                      );
                      props.onDone(newJudge);
                    }
                    setConfirmation("success");
                  } catch (error) {
                    console.log(error);
                    setConfirmation("error");
                  }
                } else {
                  setValidationError(true);
                }
              }}
            >
              <span style={{ margin: "0px 10px 0px 10px" }}>Submit judge</span>
            </Button>
          </Col>
        </Row>
      </Container>
      <ConfirmationModal
        show={!!confirmation}
        decision={confirmation}
        onClose={() => {
          const judgeObject = {
            name
          };
          setConfirmation(undefined);
          if (confirmation === "success") props.onDone();
          else props.onError(judgeObject);
        }}
      />
    </>
  );
}
