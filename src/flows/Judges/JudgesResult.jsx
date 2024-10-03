import React, { useState, useEffect } from "react";
import { FormInput } from "../../components/util/FormUtils";
import { Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import {
  fetchCompetitorNameFromRoundState,
  requestApiGateway
} from "../../components/util/FunctionUtils";
import { useDispatch } from "react-redux";
import { uiAction } from "../../redux/uiSlice";

export default function JudgesResult(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [competitorNames, setCompetitorNames] = useState([]);
  const [grades, setGrades] = useState("");
  const [competitorIds, setCompetitorId] = useState([]);
  const [done, setDone] = useState(false);

  const handleGradeChange = (index, event) => {
    const newGrades = [...grades];
    newGrades[index] = event.target.value;
    setGrades(newGrades);
  };

  const handleSubmit = (event) => {
    dispatch(uiAction.setLoading(true));
    event.preventDefault();
    console.log(`Submitted grades: ${grades}`);
    // submit grades to server or perform other logic
    console.log("grads in handleSubmit " + grades);
    console.log("competitorIds in handleSubmit " + competitorIds);
    const gradesObj = competitorIds.reduce((obj, id, index) => {
      obj[id] = typeof grades[index] === "undefined" ? null : grades[index];
      return obj;
    }, {});
    requestApiGateway(
      "https://oxsta0zfij.execute-api.us-east-1.amazonaws.com/prod/result",
      {
        roundStateId: props.roundStateId,
        groupId: props.groupIndx,
        ranking: gradesObj
      },
      "POST"
    ).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response);
      }
      setDone(true);
      dispatch(uiAction.setLoading(false));
    });
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [competitorNameQuery, roundCompetitorEntries] =
          await fetchCompetitorNameFromRoundState(
            props.roundStateId,
            props.groupIndx,
            "started"
          );
        setCompetitorId(roundCompetitorEntries);
        setCompetitorNames(competitorNameQuery);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [props.roundStateId, props.groupIndx]);

  const renderGradeInputs = (competitorNames) => {
    return competitorNames.map((name, i) => (
      <Col key={competitorIds[i]}>
        <FormInput
          key={competitorIds[i]}
          label={name}
          value={grades[i] ?? ""}
          onChange={(event) => handleGradeChange(i, event)}
        />
      </Col>
    ));
  };

  if (done) {
    return <div>Judging for this group has concluded.</div>;
  }

  return (
    <div>
      {loading ? (
        <div>Loading competitors...</div>
      ) : (
        <div>
          {competitorNames.length > 0 ? (
            <>
              {renderGradeInputs(competitorNames)}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Button onClick={handleSubmit}>Submit Score</Button>
              </div>
            </>
          ) : (
            <div>
              No competitors found. The round may have already been completed
            </div>
          )}
        </div>
      )}
    </div>
  );
}
