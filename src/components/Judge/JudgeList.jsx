import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { Judge } from "../../models";
import { DataDelete } from "../util/FormUtils";
import JudgeEditor from "./JudgeEditor";

import "./JudgeList.scss";

export default function JudgeList(props) {
  const [judges, setJudges] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState();
  // undefined is hiding
  // null is create
  // id is update

  useEffect(() => {
    (async () => {
      const judge = await DataStore.query(Judge);
      setJudges(judge);
    })();
  }, []);

  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            <th>Judge Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {judges.map((judge) => (
            <tr className="judge-row">
              <td onClick={() => setSelectedJudge(judge.id)}>
                {judge.name ?? (
                  <span style={{ color: "gray" }}>
                    <i>No name judge</i>
                  </span>
                )}
              </td>
              <td>
                <DataDelete model={Judge} id={judge.id} onSet={setJudges} />
              </td>
            </tr>
          ))}
          <tr className="judge-row" onClick={() => setSelectedJudge(null)}>
            <td className="venue-row" colSpan={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                + Add a new Judge
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
      <Modal
        show={selectedJudge !== undefined}
        fullscreen
        onHide={() => setSelectedJudge(undefined)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedJudge === null ? "Add a new judge" : "Editing a judge"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="judge-editor_modal-container">
            <div className="judge-editor_minimum-width">
              {typeof selectedJudge === "string" && (
                <JudgeEditor
                  operation="update"
                  id={selectedJudge}
                  onDone={() => setSelectedJudge(undefined)}
                  onError={() => setSelectedJudge(undefined)}
                />
              )}
              {selectedJudge === null && (
                <JudgeEditor
                  operation="create"
                  onDone={(newJudge) =>
                    setSelectedJudge(() => {
                      setJudges((j) => [newJudge, ...j]);
                    })
                  }
                  onError={() => setSelectedJudge(undefined)}
                />
              )}
              <div className="judge-editor_bottom-padding" />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
