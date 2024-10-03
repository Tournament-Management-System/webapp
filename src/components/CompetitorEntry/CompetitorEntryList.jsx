import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { CompetitorEntry, EventFormat, TournamentFormat } from "../../models";
import CompetitorEntryEditor from "./CompetitorEntryEditor";
import "../Competitor/CompetitorList.scss";
import { DataDelete } from "../util/FormUtils";
import { mapCompetitorEntryName } from "../util/FunctionUtils";

export default function CompetitorEntryList(props) {
  const [eventFormats, setEventFormats] = useState([]);
  const [tournamentFormats, setTournamentFormats] = useState([]);
  const [competitorEntires, setCompetitorEntries] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState();
  const [competitorIdNameMapper, setCompetitorIdNameMapper] = useState();
  useEffect(() => {
    (async () => {
      const eventFormat = await DataStore.query(EventFormat);
      setEventFormats(eventFormat);
      const competitorEntriesQry = await DataStore.query(CompetitorEntry);
      setCompetitorEntries(competitorEntriesQry);

      const mapper = {};
      for (const entry of competitorEntriesQry) {
        mapper[entry.id] = await mapCompetitorEntryName(entry.id);
      }
      setCompetitorIdNameMapper(mapper);
    })();
    (async () => {
      const tournamentFormatsQuery = await DataStore.query(TournamentFormat);
      setTournamentFormats(tournamentFormatsQuery);
    })();
  }, [props.tournamentFormatId]);

  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Event</th>
            <th>Tournament</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {competitorEntires.map((competitor) => (
            <tr className="competitor-row">
              <td>{competitorIdNameMapper?.[competitor?.id]}</td>
              <td>
                {
                  eventFormats?.find?.(
                    (ef) => ef.id === competitor.eventFormatIds
                  ).name
                }
              </td>
              <td>
                {
                  tournamentFormats?.find?.(
                    (tf) => tf.id === competitor.tournamentFormatId
                  ).name
                }
              </td>
              <td>
                <DataDelete
                  model={CompetitorEntry}
                  id={competitor.id}
                  onSet={setCompetitorEntries}
                />
              </td>
            </tr>
          ))}
          <tr
            className="competitor-row"
            onClick={() => setSelectedCompetitor(null)}
          >
            <td colSpan={4} className="competitor-row">
              <div style={{ display: "flex", justifyContent: "center" }}>
                + Add a new competitor
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
      <Modal
        show={selectedCompetitor !== undefined}
        fullscreen
        onHide={() => setSelectedCompetitor(undefined)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a new competitor entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="competitor-editor_modal-container">
            <div className="competitor-editor_minimum-width">
              {selectedCompetitor === null && (
                <CompetitorEntryEditor
                  operation="create"
                  tournamentFormatId={props.tournamentFormatId}
                  onDone={(response) =>
                    setSelectedCompetitor(() =>
                      setCompetitorEntries((ce) => [...ce, response])
                    )
                  }
                  onError={() => setSelectedCompetitor(undefined)}
                />
              )}
              <div className="competitor-editor_bottom-padding" />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
