import { Card, Container } from "react-bootstrap";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import NavBarWrapper from "../../components/util/NavBarWrapper";
import JudgesResult from "./JudgesResult";
import JudgesStratGroup from "./JudgesStratGroup";
import { useEffect, useState } from "react";
import { handleUserTypeRedirection } from "../../components/util/FunctionUtils";
import { Auth, DataStore } from "aws-amplify";
import {
  JudgeTournamentFormat,
  RoundState,
  TournamentFormat
} from "../../models";
import { NothingHere } from "../../components/util/FormUtils";

function JudgeContent() {
  const { id, groupIdx } = useParams();
  const groupIndexInt = parseInt(groupIdx);
  return (
    <div style={{ marginTop: 30 }}>
      <Routes>
        <Route
          path="start"
          element={
            <JudgesStratGroup roundStateId={id} groupIndx={groupIndexInt} />
          }
        />
        <Route
          path="result"
          element={<JudgesResult roundStateId={id} groupIndx={groupIndexInt} />}
        />
      </Routes>
    </div>
  );
}

function JudgeList() {
  const { search } = useLocation();
  const [judgeMapperId, setJudgeMapperId] = useState([]);
  const [judgeId, setJudgeId] = useState(null);
  const [allRelatedRounds, setAllRelatedRounds] = useState({});
  const [allTours, setAllTours] = useState({});

  useEffect(() => {
    (async () => {
      if (!judgeId) {
        const currentUser = await Auth.currentAuthenticatedUser();
        if (currentUser?.attributes?.nickname) {
          const query = new URLSearchParams(search);
          const judgeIdInProfile =
            query.get("id") ?? currentUser.attributes.nickname;
          const judgeTf = await DataStore.query(JudgeTournamentFormat, (jtf) =>
            jtf.judge.id.eq(judgeIdInProfile)
          );
          const relatedTournamentFormatIds = judgeTf
            .map((jtf) => jtf.tournamentFormatID)
            .filter((jtf) => jtf);
          const tournamentRoundsObject = {};
          const tournamentObject = {};
          (
            await Promise.all(
              relatedTournamentFormatIds.map((tfId) =>
                DataStore.query(TournamentFormat, tfId)
              )
            )
          ).forEach((tf) => (tournamentObject[tf.id] = tf));
          (
            await Promise.all(
              relatedTournamentFormatIds.map((tfId) =>
                DataStore.query(RoundState, (rs) =>
                  rs.tournamentFormatId.eq(tfId)
                )
              )
            )
          )
            .filter((rs) => rs.length > 0)
            .forEach(
              (rs) => (tournamentRoundsObject[rs[0].tournamentStateId] = rs)
            );
          setAllTours(tournamentObject);
          setAllRelatedRounds(tournamentRoundsObject);
          setJudgeId(judgeIdInProfile);
          setJudgeMapperId(judgeTf.map((jtf) => jtf.id));
        }
      }
    })();
  }, [judgeId, search]);

  return (
    <Container style={{ marginTop: 30 }}>
      <h4 style={{ marginBottom: 30 }}>Your Tournaments</h4>
      {Object.values(allRelatedRounds).length === 0 && <NothingHere />}
      {Object.values(allRelatedRounds).map((rounds) => {
        const tournamentFormat = allTours[rounds[0].tournamentFormatId];
        return (
          <>
            <Card style={{ width: "100%", marginBottom: 15 }}>
              <Card.Body>
                <Card.Title style={{ fontSize: "1.1rem" }}>
                  {tournamentFormat?.name}
                </Card.Title>
                <Card.Text>{tournamentFormat?.description}</Card.Text>
                <h6>Judging assigned</h6>
                {rounds.map((round) => {
                  const completed = round.assigned[0]
                    ? JSON.parse(round.assigned[0])
                    : null;
                  if (
                    judgeMapperId?.some?.((jmId) =>
                      completed?.judges?.includes?.(jmId)
                    )
                  ) {
                    return (
                      <Link
                        to={`/judges/${round.id}/${completed.groupId}/start`}
                      >
                        Group {completed.groupId} in {completed.roomId}
                      </Link>
                    );
                  }
                  return <></>;
                })}
                <h6>Judging started</h6>
                {rounds.map((round) => {
                  const started = round.started[0]
                    ? JSON.parse(round.started[0])
                    : null;
                  if (
                    judgeMapperId?.some?.((jmId) =>
                      started?.judges?.includes?.(jmId)
                    )
                  ) {
                    return  (
                      <div>
                      <Link
                        to={`/judges/${round.id}/${started.groupId}/result`}
                      >
                        Group {started.groupId} in {started.roomId}
                      </Link>
                      <br>
                      </br>
                      </div>
                      
                    )
                  };
                  return <></>;
                })}
                <h6>Judging complete</h6>
                {rounds.map((round) => {
                  const completed = round.completed[0]
                    ? JSON.parse(round.completed[0])
                    : null;
                  if (
                    judgeMapperId?.some?.((jmId) =>
                      completed?.judges?.includes?.(jmId)
                    )
                  ) {
                    return (
                      <div>
                      <Link
                        to={`/judges/${round.id}/${completed.groupId}/result`}
                      >
                        Group {completed.groupId} in {completed.roomId}
                      </Link>
                      <br></br>
                      </div>
                    );
                  }
                  return <></>;
                })}
              </Card.Body>
            </Card>
          </>
        );
      })}
    </Container>
  );
}

// Nick
export default function Judges() {
  const navigate = useNavigate();

  useEffect(() => {
    handleUserTypeRedirection(navigate);
  }, [navigate]);

  return (
    <>
      <NavBarWrapper appType="Judges" />
      <Container>
        <Routes>
          <Route path=":id/:groupIdx/*" element={<JudgeContent />} />
          <Route index element={<JudgeList />} />
        </Routes>
      </Container>
    </>
  );
}
