import { useEffect, useReducer, useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  Row,
  Spinner
} from "react-bootstrap";
import { FormInput, FormTypeahead } from "../util/FormUtils";
import PropTypes from "prop-types";
import { DataStore } from "aws-amplify";
import {
  CompetitorEntry,
  EventFormat,
  Judge,
  JudgeTournamentFormat,
  TournamentFormat,
  TournamentState,
  Venue
} from "../../models";
import { ConfirmationModal, FatalError } from "../util/MessageUtils";
import dayjs from "dayjs";
import TournamentStateEditor from "./TournamentStateEditor";
import {
  mapCompetitorEntryName,
  requestApiGateway
} from "../util/FunctionUtils";
import { DATA_TYPE, fetchAWSData } from "../../redux/dataSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uiAction } from "../../redux/uiSlice";
import CompetitorEntryEditor from "../CompetitorEntry/CompetitorEntryEditor";

const FIELDS = {
  NAME: "name",
  DESCRIPTION: "description",
  EVENT_FEE: "eventFee",
  START_DATE: "startDate",
  START_TIME: "startTime",
  EVENT_FORMAT: "eventFormatIds",
  VENUE: "venueId"
};

const FIELD_VALIDATORS = {
  [FIELDS.NAME]: /^$|^.{0,30}$/i,
  [FIELDS.EVENT_FEE]: /^$|^[0-9]{0,3}$/i,
  [FIELDS.START_DATE]: /^$|^.{0,9}$|^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/i,
  [FIELDS.START_TIME]: /^$|^.{0,6}$|^[0-9]{1,2}:[0-9]{2}\s(AM|PM)$/i
};

export default function TournamentFormatEditor(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allVenues, setAllVenues] = useState([]);
  const [allEventFormats, setAllEventFormats] = useState([]);
  const [allJudges, setAllJudges] = useState([]);
  const [allCompetitors, setAllCompetitors] = useState([]);

  const [fatalError, setFatalError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState();
  const [tournamentState, setTournamentState] = useState({});
  const [tournamentFormatQuery, setTournamentFormat] = useState({});
  const [judges, setJudges] = useState([]);
  const [compIdNameMapper, setCompetitorIdNameMapper] = useState({});
  const [venue, setVenue] = useState([]);
  const [eventFormat, setEventFormat] = useState([]);
  const [fields, dispatchFields] = useReducer((state, action) => {
    return action.field
      ? {
          ...state,
          [action.field]: {
            ...state[action.field],
            [action.characteristic]: action.value
          }
        }
      : { ...state };
  }, {});

  const tournamentFormatObject = {
    [FIELDS.NAME]: fields[FIELDS.NAME]?.value,
    [FIELDS.DESCRIPTION]: fields[FIELDS.DESCRIPTION]?.value,
    [FIELDS.START_TIME]: dayjs(
      `${fields[FIELDS.START_DATE]?.value} ${fields[FIELDS.START_TIME]?.value}`
    ).format(),
    [FIELDS.EVENT_FEE]: parseFloat(fields[FIELDS.EVENT_FEE]?.value),
    [FIELDS.EVENT_FORMAT]: eventFormat.map((eventFormat) => eventFormat.id),
    [FIELDS.VENUE]: venue.reduce(
      (accumulator, curVenue) => accumulator + curVenue.id,
      ""
    )
  };

  const handleFieldChangeCurry = (field) => (e) => {
    const inputIsValid = FIELD_VALIDATORS[field]
      ? FIELD_VALIDATORS[field]?.test(e.target.value)
      : true;
    dispatchFields({ field, characteristic: "value", value: e.target.value });
    dispatchFields({ field, characteristic: "isValid", value: inputIsValid });
  };

  const computeInvalidMsg = (field, invalidMessage) =>
    fields?.[field]?.isValid === false ? invalidMessage : undefined;

  useEffect(() => {
    (async () => {
      if (props.operation === "update" && props.id) {
        try {
          setLoading(true);
          const tournamentFormat = await DataStore.query(
            TournamentFormat,
            props.id
          );
          const tstate = await DataStore.query(
            TournamentState,
            tournamentFormat.tournamentFormatTournamentStateId
          );
          setTournamentState(tstate ?? {});
          setTournamentFormat(tournamentFormat);
          handleFieldChangeCurry(FIELDS.DESCRIPTION)({
            target: { value: tournamentFormat[FIELDS.DESCRIPTION] }
          });
          handleFieldChangeCurry(FIELDS.NAME)({
            target: { value: tournamentFormat[FIELDS.NAME] }
          });
          handleFieldChangeCurry(FIELDS.EVENT_FEE)({
            target: { value: `${tournamentFormat[FIELDS.EVENT_FEE]}` }
          });
          handleFieldChangeCurry(FIELDS.START_TIME)({
            target: {
              value: dayjs(`${tournamentFormat[FIELDS.START_TIME]}`).format(
                "hh:mm A"
              )
            }
          });
          handleFieldChangeCurry(FIELDS.START_DATE)({
            target: {
              value: dayjs(`${tournamentFormat[FIELDS.START_TIME]}`).format(
                "MM/DD/YYYY"
              )
            }
          });
          setVenue(
            allVenues.filter(
              (venueObject) => venueObject.id === tournamentFormat.venueId
            )
          );
          setEventFormat(
            allEventFormats.filter((eventFormatObject) =>
              tournamentFormat.eventFormatIds.includes(eventFormatObject.id)
            )
          );
          (async () => {
            const judges = (await tournamentFormat.judges.toArray()).map(
              (judge) => judge.judgeID
            );
            setJudges(allJudges.filter((judge) => judges.includes(judge.id)));
          })();
          (async () => {
            if (!allCompetitors) {
              const query = await DataStore.query(CompetitorEntry);
              setAllCompetitors(query);
            }
            const competitorEntriesQry = allCompetitors.filter(
              (comp) => comp.tournamentFormatId === props.id
            );
            const mapper = {};
            for (const entry of competitorEntriesQry) {
              mapper[entry.id] = await mapCompetitorEntryName(entry.id);
            }
            setCompetitorIdNameMapper(mapper);
          })();
        } catch (error) {
          console.log(error);
          setFatalError(true);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [
    props.operation,
    props.id,
    allVenues,
    allEventFormats,
    allJudges,
    allCompetitors
  ]);

  useEffect(() => {
    (async () => {
      const query = await DataStore.query(EventFormat);
      setAllEventFormats(
        query.map((format) => ({
          id: format.id,
          label: format.name
        }))
      );
    })();
    (async () => {
      const query = await DataStore.query(Venue);
      setAllVenues(query.map((venue) => ({ id: venue.id, label: venue.name })));
    })();
    (async () => {
      const query = await DataStore.query(CompetitorEntry);
      setAllCompetitors(query);
    })();
    (async () => {
      const query = await DataStore.query(Judge);
      setAllJudges(query);
    })();
  }, []);

  if (fatalError) {
    return <FatalError />;
  }

  if (loading) {
    return <Spinner animation="border" variant="success" />;
  }

  return (
    <div style={{ minWidth: 650 }}>
      <Container>
        {tournamentState.id && (
          <Row>
            <Col xs={12}>
              <TournamentStateEditor
                tournamentFormat={tournamentFormatQuery}
                id={tournamentState.id}
                onTournamentReset={async () => {
                  const tstate = await DataStore.query(
                    TournamentState,
                    tournamentFormatQuery.tournamentFormatTournamentStateId
                  );
                  setTournamentState(tstate ?? {});
                }}
              />
            </Col>
          </Row>
        )}
        {!tournamentState.id && (
          <Row>
            {props.operation === "update" && (
              <Col
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 30
                }}
              >
                <Button
                  style={{ width: "100%" }}
                  onClick={async () => {
                    dispatch(uiAction.setLoading(true));
                    const response = await requestApiGateway(
                      "https://ao99deqz5i.execute-api.us-east-1.amazonaws.com/prod/startTournament",
                      {
                        tournamentFormatId: props.id
                      },
                      "POST"
                    );
                    const tstate = await DataStore.query(
                      TournamentState,
                      response.tournamentStateId
                    );
                    setTournamentState(tstate ?? {});
                    dispatch(uiAction.setLoading(false));
                  }}
                >
                  Start Tournament
                </Button>
              </Col>
            )}
            <Col xs={12}>
              <FormInput
                label="Tournament name"
                subtext="This is the name that competitors will use to find you"
                value={fields?.[FIELDS.NAME]?.value}
                invalidMessage={computeInvalidMsg(
                  FIELDS.NAME,
                  "Make sure the tournament name is less than 30 characters long"
                )}
                onChange={handleFieldChangeCurry(FIELDS.NAME)}
              />
            </Col>
            <Col xs={12}>
              <FormInput
                label="Description"
                rows={3}
                value={fields?.[FIELDS.DESCRIPTION]?.value}
                onChange={handleFieldChangeCurry(FIELDS.DESCRIPTION)}
              />
            </Col>
            <Col xs={12}>
              <FormInput
                label="Tournament fee"
                subtext="Put $0 for no tournament fee"
                prefix="$"
                suffix=".00"
                invalidMessage={computeInvalidMsg(
                  FIELDS.EVENT_FEE,
                  "Please enter a valid tournament fee. Note that we are unable to process tournament fees above $9999"
                )}
                value={fields?.[FIELDS.EVENT_FEE]?.value}
                onChange={handleFieldChangeCurry(FIELDS.EVENT_FEE)}
              />
            </Col>
            <Col xs={6}>
              <FormInput
                label="Start date"
                subtext="Format as MM/DD/YYYY"
                invalidMessage={computeInvalidMsg(
                  FIELDS.START_DATE,
                  "Sorry, please double check the format"
                )}
                value={fields?.[FIELDS.START_DATE]?.value}
                onChange={handleFieldChangeCurry(FIELDS.START_DATE)}
              />
            </Col>
            <Col xs={6}>
              <FormInput
                label="Start time"
                subtext="Format as 9:00 AM"
                invalidMessage={computeInvalidMsg(
                  FIELDS.START_TIME,
                  "Sorry, please double check the format"
                )}
                value={fields?.[FIELDS.START_TIME]?.value}
                onChange={handleFieldChangeCurry(FIELDS.START_TIME)}
              />
            </Col>
            <Col xs={12}>
              <FormTypeahead
                label="Select the tournament venue"
                onChange={(e) => setVenue(e)}
                invalidMessage="Please choose an venue"
                selected={venue}
                options={allVenues}
                subtext="This is where the tournament will take place"
              />
            </Col>
            <Col xs={12}>
              <FormTypeahead
                label="Select the event formats"
                multiple
                onChange={(e) => setEventFormat(e)}
                invalidMessage="Please choose an event format"
                selected={eventFormat}
                options={allEventFormats}
              />
            </Col>
            {props.operation === "update" && (
              <>
                <Col xs={12}>
                  <FormTypeahead
                    label="Select judges"
                    multiple
                    onChange={(newJudges) =>
                      setJudges((existingJudges) => {
                        const existingJudgeIds = existingJudges.map(
                          (judge) => judge.id
                        );
                        const newJudgeIds = newJudges.map((judge) => judge.id);
                        newJudgeIds.forEach(async (judgeId) => {
                          if (!existingJudgeIds.includes(judgeId)) {
                            await DataStore.save(
                              new JudgeTournamentFormat({
                                judge: { id: judgeId },
                                tournamentFormat: { id: props.id }
                              })
                            );
                          }
                        });
                        existingJudgeIds.forEach(async (judgeId) => {
                          if (!newJudgeIds.includes(judgeId)) {
                            const allJTFs = await DataStore.query(
                              JudgeTournamentFormat
                            );
                            const toBeDeletedJTFs = allJTFs.find(
                              (jtf) =>
                                jtf.judgeID === judgeId &&
                                jtf.tournamentFormatID === props.id
                            );
                            if (toBeDeletedJTFs)
                              await DataStore.delete(toBeDeletedJTFs);
                          }
                        });
                        return newJudges;
                      })
                    }
                    invalidMessage="Please choose an judges"
                    selected={judges}
                    options={allJudges}
                    labelKey="name"
                  />
                </Col>
                <Col xs={12}>
                  <p>Competitor Entries</p>
                  {allCompetitors
                    .filter((comp) => comp.tournamentFormatId === props.id)
                    .map((c) => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 5
                        }}
                      >
                        <div style={{ width: "100%" }}>
                          {compIdNameMapper?.[c.id]}
                        </div>
                        <div>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={async () => {
                              await DataStore.delete(CompetitorEntry, (ce) =>
                                ce.id.eq(c.id)
                              );
                              const query = await DataStore.query(
                                CompetitorEntry
                              );
                              setAllCompetitors(query);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item>
                      <Accordion.Header>
                        Add a new competitor entry
                      </Accordion.Header>
                      <Accordion.Body>
                        <CompetitorEntryEditor
                          tournamentFormatId={props.id}
                          onDone={async () => {
                            const query = await DataStore.query(
                              CompetitorEntry
                            );
                            setAllCompetitors(query);
                          }}
                        />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
              </>
            )}
            <Col
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 30
              }}
            >
              <Button
                style={{ width: "100%" }}
                onClick={async () => {
                  try {
                    let dataStoreResponse;
                    if (props.operation === "update") {
                      const original = await DataStore.query(
                        TournamentFormat,
                        props.id
                      );
                      dataStoreResponse = await DataStore.save(
                        TournamentFormat.copyOf(original, (updated) => {
                          updated.name = tournamentFormatObject.name;
                          updated.description =
                            tournamentFormatObject.description;
                          updated.startTime = tournamentFormatObject.startTime;
                          updated.eventFee = tournamentFormatObject.eventFee;
                          updated.eventFormatIds =
                            tournamentFormatObject.eventFormatIds;
                          updated.venueId = tournamentFormatObject.venueId;
                        })
                      );
                    } else if (props.operation === "create") {
                      dataStoreResponse = await DataStore.save(
                        new TournamentFormat(tournamentFormatObject)
                      );
                    }
                    if (props.onDone) {
                      props.onDone(dataStoreResponse);
                    } else {
                      navigate("/organizer/tournaments");
                    }
                  } catch (e) {
                    console.log(e);
                    setConfirmation("error");
                  } finally {
                    fetchAWSData(dispatch, DATA_TYPE.tournamentFormats);
                  }
                }}
              >
                {props.operation === "update"
                  ? "Update tournament format"
                  : "Add new tournament format"}
              </Button>
            </Col>
          </Row>
        )}
      </Container>
      <ConfirmationModal
        show={!!confirmation}
        decision={confirmation}
        onClose={() => {
          setConfirmation(undefined);
          if (confirmation === "success") {
            if (props.onDone) {
              props.onDone();
            } else {
              navigate("/organizer/tournaments");
            }
          } else props.onError();
        }}
      />
    </div>
  );
}

TournamentFormatEditor.propTypes = {
  initialTournamentFormat: PropTypes.object
};
