import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchCompetitorNameFromRoundState,
  requestApiGateway
} from "../../components/util/FunctionUtils";
import { uiAction } from "../../redux/uiSlice";

export default function JudgesStratGroup(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [competitorNames, setCompetitorNames] = useState([]);
  const navigate = useNavigate();

  async function handleStartCompetition() {
    await requestApiGateway(
      "https://oxsta0zfij.execute-api.us-east-1.amazonaws.com/prod/startCompetition",
      { roundStateId: props.roundStateId, groupId: props.groupIndx },
      "POST"
    );
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [competitorNameQuery] = await fetchCompetitorNameFromRoundState(
          props.roundStateId,
          props.groupIndx,
          "assigned"
        );
        setCompetitorNames(competitorNameQuery);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [props.roundStateId, props.groupIndx]);

  return (
    <>
      <div>
        {loading ? (
          <div>Loading competitors...</div>
        ) : (
          <div>
            {competitorNames.length > 0 && (
              <div>
                <h2>Competitor Names:</h2>
                {competitorNames.map((name) => (
                  <div key={name}>{name}</div>
                ))}
              </div>
            )}
          </div>
        )}
        {competitorNames.length > 0 ? (
          <Button
            onClick={async () => {
              dispatch(uiAction.setLoading(true));
              await handleStartCompetition(props.roundStateId, props.groupIndx);
              setTimeout(() => {
                navigate(
                  `/judges/${props.roundStateId}/${props.groupIndx}/result`
                );
                dispatch(uiAction.setLoading(false));
              }, 2000);
            }}
          >
            Start Competition
          </Button>
        ) : (
          <div>
            Group already started. Click{" "}
            <Link
              to={`/judges/${props.roundStateId}/${props.groupIndx}/result`}
            >
              here
            </Link>{" "}
            to judge result
          </div>
        )}
      </div>
      <div className="footer">
        <p>If you have any issues, Please contact us abc@email.com</p>
      </div>
    </>
  );
}
