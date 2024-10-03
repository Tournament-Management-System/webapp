import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { Venue } from "../../models";
import { DataDelete } from "../util/FormUtils";
import VenueEditor from "./VenueEditor";

import "./VenueList.scss";

const VENUE_TYPE = {
  virtual_location: "Virtual Location",
  physical_location: "Physical Location"
};

export default function VenueList(props) {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState();
  const handleVenueSelect = (id) => () => setSelectedVenue(id);

  useEffect(() => {
    (async () => {
      const venue = await DataStore.query(Venue);
      setVenues(venue);
    })();
  }, []);

  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            <th>Venue name</th>
            <th>Venue type</th>
            <th>Venue address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {venues.map((venue) => (
            <tr className="venue-row">
              <td onClick={handleVenueSelect(venue.id)}>{venue.name}</td>
              <td onClick={handleVenueSelect(venue.id)}>
                {VENUE_TYPE[venue.venueType]}
              </td>
              <td onClick={handleVenueSelect(venue.id)}>{venue.address}</td>
              <td>
                <DataDelete model={Venue} id={venue.id} onSet={setVenues} />
              </td>
            </tr>
          ))}
          <tr className="venue-row" onClick={() => setSelectedVenue(null)}>
            <td colSpan={4} className="venue-row">
              <div style={{ display: "flex", justifyContent: "center" }}>
                + Add a new venue
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
      <Modal
        show={selectedVenue !== undefined}
        fullscreen
        onHide={() => setSelectedVenue(undefined)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedVenue === null ? "Add a new venue" : "Editing a venue"}
          </Modal.Title>
        </Modal.Header>
        <div className="venue-editor_modal-container">
          <div className="venue-editor_minimum-width">
            {typeof selectedVenue === "string" && (
              <VenueEditor
                operation="update"
                id={selectedVenue}
                onDone={() => setSelectedVenue(undefined)}
                onError={() => setSelectedVenue(undefined)}
              />
            )}
            {selectedVenue === null && (
              <VenueEditor
                operation="create"
                onDone={(response) => {
                  setSelectedVenue(() => {
                    setVenues((v) => [response, ...v]);
                  });
                }}
                onError={() => setSelectedVenue(undefined)}
              />
            )}
            <div className="venue-editor_bottom-padding" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
