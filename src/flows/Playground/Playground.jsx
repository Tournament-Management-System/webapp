import { useState } from "react";
import { Button } from "react-bootstrap";
import EventFormatEditor from "../../components/EventFormat/EventFormatEditor";
import EventFormatList from "../../components/EventFormat/EventFormatList";
import JudgeEditor from "../../components/Judge/JudgeEditor";
import JudgeList from "../../components/Judge/JudgeList";
import TournamentFormatEditor from "../../components/TournamentFormat/TournamentFormatEditor";
import VenueEditor from "../../components/Venue/VenueEditor";
import VenueList from "../../components/Venue/VenueList";
import CompetitorEditor from "../../components/Competitor/CompetitorEditor";
import CompetitorList from "../../components/Competitor/CompetitorList";
import TournamentFormatList from "../../components/TournamentFormat/TournamentFormatList";
import CompetitorEntryEditor from "../../components/CompetitorEntry/CompetitorEntryEditor";
import CompetitorEntryList from "../../components/CompetitorEntry/CompetitorEntryList";
import { useLocation } from "react-router-dom";

const playgroundRender = {
  hr_venue_list: true,
  "Venue List": <VenueList />,
  "Venue Editor (Update)": (
    <VenueEditor operation="update" id="635e0df0-ee6e-4752-98f1-06307c1a2145" />
  ),
  "Venue Editor (Create)": <VenueEditor operation="create" />,
  hr_event_format: true,
  "Event Format List": <EventFormatList />,
  "Event Format Editor (Update)": (
    <EventFormatEditor
      operation="update"
      id="4bb839a0-4335-426e-b118-51d01822f5c2"
    />
  ),
  "Event Format Editor (Create)": <EventFormatEditor operation="create" />,
  hr_competitor: true,
  "Competitor List": <CompetitorList />,
  "Competitor Editor (Update)": (
    <CompetitorEditor
      operation="update"
      id="249309f2-cd3d-4af2-96bb-2941ad439890"
    />
  ),
  "Competitor Editor (Create)": <CompetitorEditor operation="create" />,
  hr_judge: true,
  "Judge List": <JudgeList />,
  "Judge Editor (Update)": (
    <JudgeEditor operation="update" id="63a634dc-3b3c-4502-84ca-634c4cba16dd" />
  ),
  "Judge Editor (Create)": <JudgeEditor operation="create" />,
  hr_competitor_entry: true,
  "Competitor Entry List": (
    <CompetitorEntryList tournamentFormatId="7d1415bf-3ef1-44a2-939c-205f749cc0a4" />
  ),
  "Competitor Entry Editor (Create)": (
    <CompetitorEntryEditor operation="create" />
  ),
  hr_tournament_format: true,
  "Tournament Format List": <TournamentFormatList />,
  "Tournament Format Editor (Update)": (
    <TournamentFormatEditor
      operation="update"
      id="01ba3933-336c-42c8-a40d-c25a2bcd7386"
    />
  ),
  "Tournament Format Editor (Create)": (
    <TournamentFormatEditor operation="create" />
  )
};

export default function Playground() {
  const [componentToRender, setComponentToRender] = useState();
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  if (query.get("password") !== "Password1!") {
    return <div>Insufficient privilege</div>;
  }

  const renderComponent = () => {
    const component = playgroundRender[componentToRender];
    if (component) {
      return component;
    }
    return <></>;
  };

  return (
    <>
      {Object.keys(playgroundRender).map((label) => {
        if (label.includes("hr")) {
          return <hr />;
        }
        return (
          <Button
            style={{ margin: "0px 10px 0px 10px" }}
            onClick={() => setComponentToRender(label)}
          >
            {label}
          </Button>
        );
      })}
      <hr />
      {renderComponent()}
      <div style={{ marginTop: 100 }} />
    </>
  );
}
