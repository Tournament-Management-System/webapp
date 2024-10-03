import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { Competitor } from "../../models";
import { DataDelete } from "../util/FormUtils";
import CompetitorEditor from "./CompetitorEditor";
import "./CompetitorList.scss";

export default function CompetitorList(props) {
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState();
  useEffect(() => {
    (async () => {
      const competitor = await DataStore.query(Competitor);
      setCompetitors(competitor);
    })();
  }, []);
  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            <th>Competitor Name (First , Last)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((competitor) => (
            <tr className="competitor-row">
              <td onClick={() => setSelectedCompetitor(competitor.id)}>
                {competitor.name}
              </td>
              <td>
                <DataDelete
                  model={Competitor}
                  id={competitor.id}
                  onSet={setCompetitors}
                />
              </td>
            </tr>
          ))}
          <tr
            className="competitor-row"
            onClick={() => setSelectedCompetitor(null)}
          >
            <td className="competitor-row" colSpan={2}>
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
          <Modal.Title>
            {selectedCompetitor === null
              ? "Add a new competitor"
              : "Editing a competitor"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="competitor-editor_modal-container">
            <div className="competitor-editor_minimum-width">
              {typeof selectedCompetitor === "string" && (
                <CompetitorEditor
                  operation="update"
                  id={selectedCompetitor}
                  onDone={() => setSelectedCompetitor(undefined)}
                  onError={() => setSelectedCompetitor(undefined)}
                />
              )}
              {selectedCompetitor === null && (
                <CompetitorEditor
                  operation="create"
                  onDone={(newCompetitor) =>
                    setSelectedCompetitor(() => {
                      setCompetitors((c) => [newCompetitor, ...c]);
                    })
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
