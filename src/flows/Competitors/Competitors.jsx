// Competitor
import NavBarWrapper from "../../components/util/NavBarWrapper";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Auth, DataStore } from "aws-amplify";
import {
  TournamentFormat,
  CompetitorCompetitorEntry,
  TournamentState,
  EventFormat
} from "../../models";
import { handleUserTypeRedirection } from "../../components/util/FunctionUtils";
import { USER_TYPES } from "../../App";
import { EditTournamentFormat } from "../../components/TournamentFormat/TournamentFormatList";
import { NothingHere } from "../../components/util/FormUtils";

export function CompetitorWrapper(props) {
  const { competitorId } = useParams();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    (async () => {
      const competitorEntries = await DataStore.query(
        CompetitorCompetitorEntry,
        (cce) => cce.competitor.id.eq(competitorId)
      );

      const associatedTournaments = {};
      for (const cce of Object.values(competitorEntries)) {
        const response = await cce.competitorEntry;
        const tfId = response.tournamentFormatId;
        const efId = response.eventFormatIds;
        const [tournamentFormat, eventFormat, tournamentState] =
          await Promise.all([
            await DataStore.query(TournamentFormat, tfId),
            await DataStore.query(EventFormat, efId),
            await DataStore.query(TournamentState, (rs) =>
              rs.tournamentFormatId.eq(tfId)
            )
          ]);
        if (tournamentState[0]) {
          associatedTournaments[tfId] = {
            tournamentFormat,
            eventFormat
          };
        }
      }
      setTournaments(associatedTournaments);
    })();
  }, [competitorId]);

  const tournamentListJSX = (
    <Container style={{ marginTop: 30 }}>
      <h4 style={{ marginBottom: 30 }}>Your Tournaments</h4>
      {Object.values(tournaments).length === 0 && <NothingHere />}
      {Object.values(tournaments).map(({ tournamentFormat, eventFormat }) => {
        return (
          <Card
            style={{ width: "100%", marginBottom: 15 }}
            onClick={() => navigate(`${tournamentFormat.id}`)}
          >
            <Card.Body>
              <Card.Title style={{ fontSize: "1.1rem" }}>
                {tournamentFormat?.name} - {eventFormat?.name}
              </Card.Title>
              <Card.Text>{tournamentFormat?.description}</Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );

  return (
    <Routes>
      <Route path=":tournamentFormatId/*" element={<EditTournamentFormat />} />
      <Route index element={tournamentListJSX} />
    </Routes>
  );
}

function CompetitorRedirection() {
  const { competitorId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!competitorId) {
        const currentUser = await Auth.currentAuthenticatedUser();
        if (
          currentUser?.attributes?.profile === USER_TYPES.COMPETITOR &&
          currentUser?.attributes?.nickname
        ) {
          navigate(`${currentUser.attributes.nickname}`);
        }
      }
    })();
  }, [competitorId, navigate]);

  return <></>;
}

export default function Competitor() {
  const navigate = useNavigate();

  useEffect(() => {
    handleUserTypeRedirection(navigate);
  }, [navigate]);

  return (
    <>
      <NavBarWrapper appType="Competitor" />
      <Routes>
        <Route path=":competitorId/*" element={<CompetitorWrapper />} />
        <Route path="*" element={<CompetitorRedirection />} />
      </Routes>
    </>
  );
}
