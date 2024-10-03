import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Venue } from "../../models";
import { FormInput, FormTypeahead, ListEditor } from "../util/FormUtils";
import { ConfirmationModal, FatalError } from "../util/MessageUtils";

const venueTypeOptions = [
  { id: "physical_location", label: "Physical Location" },
  { id: "virtual_location", label: "Virtual Location" }
];

export default function VenueEditor(props) {
  const [validationError, setValidationError] = useState(null);
  const [fatalError, setFatalError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [confirmation, setConfirmation] = useState();

  const [name, setName] = useState("");
  const [nameIsValid, setNameIsValid] = useState(null);

  const [venueType, setVenueType] = useState([]);
  const [venueTypeIsValid, setVenueTypeIsValid] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [roomsAreValid, setRoomsAreValid] = useState(true);

  const [address, setAddress] = useState("");
  const [addressIsValid, setAddressIsValid] = useState(true);

  const computeInvalidMsg = (isValid, message) =>
    isValid === false ? message : undefined;

  useEffect(() => {
    (async () => {
      // Throw fatal error if invalid operation
      if (props.operation !== "update" && props.operation !== "create") {
        console.log(`Error: "${props.operation}" is an invalid operation`);
        setFatalError(true);
      }

      if (props.operation === "update") {
        try {
          setLoading(true);
          const venueObject = await DataStore.query(Venue, props.id);
          setName(venueObject.name);
          setVenueType(
            venueTypeOptions.filter(
              (option) => option.id === venueObject.venueType
            )
          );
          setRooms(venueObject.rooms);
          setAddress(venueObject.address);

          setNameIsValid(true);
          setVenueTypeIsValid(true);
          setRoomsAreValid(true);
          setAddressIsValid(true);
        } catch (error) {
          console.log(error);
          setFatalError(true);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [props.id, props.operation]);

  if (fatalError) {
    return <FatalError />;
  }

  if (loading) {
    return <Spinner animation="border" variant="success" />;
  }

  return (
    <>
      <Container>
        <Row>
          <Col xs={6}>
            <FormInput
              label="Venue name"
              invalidMessage={computeInvalidMsg(
                nameIsValid,
                "Please enter a name 20 characters or less"
              )}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameIsValid(/^.{0,50}$/i.test(e.target.value));
              }}
            />
          </Col>
          <Col xs={6}>
            <FormTypeahead
              label="Venue type"
              options={venueTypeOptions}
              invalidMessage={computeInvalidMsg(
                venueTypeIsValid,
                "Please enter a name 20 characters or less"
              )}
              selected={venueType}
              onChange={(e) => {
                setVenueType(e);
                setVenueTypeIsValid(e?.length > 0);
              }}
            />
          </Col>
          <Col xs={12}>
            <ListEditor
              label="Venue rooms"
              addNewText="Add another room"
              validator={/^.{0,20}$|^$/i}
              invalidMessage="Sorry, the length must be 20 or less"
              value={rooms}
              onChange={(operation, index, value) =>
                setRooms((vn) => {
                  let vnCopy = [...vn];
                  if (operation === "add") vnCopy[index] = value;
                  else if (operation === "remove")
                    vnCopy = vnCopy.filter((_, idx) => index !== idx);
                  // Consider valid if it is empty or every entry comforms to the validator
                  setRoomsAreValid(
                    vnCopy.every((room) => /^.{1,20}$/i.test(room))
                  );
                  return vnCopy;
                })
              }
            />
          </Col>
          <Col xs={12}>
            <FormInput
              label="Location information (optional)"
              subtext="Let your competitors know where you are, i.e. address, zoom, etc. "
              rows={3}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setAddressIsValid(true);
              }}
            />
          </Col>
          {validationError && (
            <Col xs={12}>
              <div style={{ color: "#dc3545" }}>
                <p>
                  The following fields are invalid, please double check your
                  entry
                </p>
                <ul>
                  {!nameIsValid && <li>Invalid name</li>}
                  {!venueTypeIsValid && <li>Invalid venue type</li>}
                  {!roomsAreValid && <li>Invalid room</li>}
                  {!addressIsValid && <li>Invalid address</li>}
                </ul>
              </div>
            </Col>
          )}
          <Col xs={12} style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={async () => {
                if (
                  nameIsValid &&
                  venueTypeIsValid &&
                  roomsAreValid &&
                  addressIsValid
                ) {
                  try {
                    const venueObject = {
                      name,
                      venueType: venueType[0].id,
                      rooms,
                      address
                    };
                    if (props.operation === "update") {
                      const original = await DataStore.query(Venue, props.id);
                      await DataStore.save(
                        Venue.copyOf(original, (updated) => {
                          updated.name = venueObject.name;
                          updated.venueType = venueObject.venueType;
                          updated.rooms = venueObject.rooms;
                          updated.address = venueObject.address;
                        })
                      );
                    } else if (props.operation === "create") {
                      const response = await DataStore.save(
                        new Venue(venueObject)
                      );
                      props.onDone(response);
                    }
                    setConfirmation("success");
                  } catch (error) {
                    console.log(error);
                    setConfirmation("error");
                  }
                } else {
                  setValidationError(true);
                }
              }}
            >
              <span style={{ margin: "0px 10px 0px 10px" }}>Submit venue</span>
            </Button>
          </Col>
        </Row>
      </Container>
      <ConfirmationModal
        show={!!confirmation}
        decision={confirmation}
        onClose={() => {
          const venueObject = {
            name,
            venueType: venueType[0].id,
            rooms,
            address
          };
          setConfirmation(undefined);
          if (confirmation === "success") props.onDone();
          else props.onError(venueObject);
        }}
      />
    </>
  );
}
