import { Modal, Table } from "react-bootstrap";
import { TournamentFormat } from "../../models";
import TournamentFormatEditor from "./TournamentFormatEditor";
import dayjs from "dayjs";

import EventStateWrapper from "../../flows/Organizers/EventStateWrapper";
import liveLogo from "./live.png";
import { DataDelete } from "../util/FormUtils";
import "./TournamentFormat.scss";
import "../EventFormat/EventFormatList.scss";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DATA_TYPE, selectData } from "../../redux/dataSlice";

function AddTournamentFormat() {
  const navigate = useNavigate();
  return (
    <Modal show fullscreen onHide={() => navigate(-1)}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body style={{ marginBottom: 20 }}>
        <div className="event-format-editor_modal-container">
          <div className="event-format-editor_minimum-width">
            <TournamentFormatEditor operation="create" />
            <div className="event-format-editor_bottom-padding" />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export function EditTournamentFormat() {
  const { tournamentFormatId } = useParams();
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="es/:eventStateId/*" element={<EventStateWrapper />} />
      <Route
        path="*"
        element={
          <Modal show fullscreen onHide={() => navigate(-1)}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body style={{ marginBottom: 20 }}>
              <div className="event-format-editor_modal-container">
                <div className="event-format-editor_minimum-width">
                  <TournamentFormatEditor
                    operation="update"
                    id={tournamentFormatId}
                  />
                  <div className="event-format-editor_bottom-padding" />
                </div>
              </div>
            </Modal.Body>
          </Modal>
        }
      />
    </Routes>
  );
}

export default function TournamentFormatList(props) {
  const navigate = useNavigate();
  const eventFormats = useSelector((state) =>
    selectData(state, DATA_TYPE.tournamentFormats)
  );

  const TableContent = (
    <Table hover>
      <thead>
        <tr>
          <th>Format name</th>
          <th>Start time</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {[...eventFormats]
          .sort((a) => (a.tournamentFormatTournamentStateId ? -1 : 1))
          .map((eventFormat) => (
            <tr className="event-format-row">
              <td onClick={() => navigate(eventFormat.id)}>
                {eventFormat.name}
              </td>
              <td onClick={() => navigate(eventFormat.id)}>
                {dayjs(eventFormat.startTime).format("MM/DD/YYYY h:mm A")}
              </td>
              <td onClick={() => navigate(eventFormat.id)}>
                {eventFormat.tournamentFormatTournamentStateId ? (
                  <img
                    src={liveLogo}
                    style={{ height: 20 }}
                    alt="Live Logo"
                    className="animate-flicker"
                  />
                ) : (
                  "Not started"
                )}
              </td>
              <td>
                <DataDelete model={TournamentFormat} id={eventFormat.id} />
              </td>
            </tr>
          ))}
        <tr className="event-format-row" onClick={() => navigate("new")}>
          <td colSpan={4} className="event-format-row">
            <div style={{ display: "flex", justifyContent: "center" }}>
              + Add a new tournament
            </div>
          </td>
        </tr>
      </tbody>
    </Table>
  );

  return (
    <Routes>
      <Route path="new" element={<AddTournamentFormat />} />
      <Route path=":tournamentFormatId/*" element={<EditTournamentFormat />} />
      <Route path="*" element={TableContent} />
    </Routes>
  );
}
