import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { EventFormat } from "../../models";
import { DataDelete } from "../util/FormUtils";
import EventFormatEditor from "./EventFormatEditor";

import "./EventFormatList.scss";

export default function EventFormatList(props) {
  const [eventFormats, setEventFormats] = useState([]);
  const [selectedEventFormat, setSelectedEventFormat] = useState();
  const handleEventFormatSelect = (id) => () => setSelectedEventFormat(id);

  useEffect(() => {
    (async () => {
      const evetnFormatsQuery = await DataStore.query(EventFormat);
      setEventFormats(evetnFormatsQuery);
    })();
  }, []);

  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            <th>Event name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {eventFormats.map((eventFormat) => (
            <tr className="event-format-row">
              <td onClick={handleEventFormatSelect(eventFormat.id)}>
                {eventFormat.name}
              </td>
              <td>
                <DataDelete
                  model={EventFormat}
                  id={eventFormat.id}
                  onSet={setEventFormats}
                />
              </td>
            </tr>
          ))}
          <tr
            className="event-format-row"
            onClick={handleEventFormatSelect(null)}
          >
            <td colSpan={3} className="event-format-row">
              <div style={{ display: "flex", justifyContent: "center" }}>
                + Add a new venue
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
      <Modal
        show={selectedEventFormat !== undefined}
        fullscreen
        onHide={() => setSelectedEventFormat(undefined)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEventFormat === null
              ? "Add a new event format"
              : "Editing an event format"}
          </Modal.Title>
        </Modal.Header>
        <div className="event-format-editor_modal-container">
          <div className="event-format-editor_minimum-width">
            {typeof selectedEventFormat === "string" && (
              <EventFormatEditor
                operation="update"
                id={selectedEventFormat}
                onDone={() => setSelectedEventFormat(undefined)}
                onError={() => setSelectedEventFormat(undefined)}
              />
            )}
            {selectedEventFormat === null && (
              <EventFormatEditor
                operation="create"
                onDone={(response) =>
                  setSelectedEventFormat(() => {
                    setEventFormats((ef) => [response, ...ef]);
                  })
                }
                onError={() => setSelectedEventFormat(undefined)}
              />
            )}
            <div className="event-format-editor_bottom-padding" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
