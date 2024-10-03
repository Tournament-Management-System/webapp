import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import {
  Competitor,
  CompetitorCompetitorEntry,
  CompetitorEntry,
  EventFormat
} from "../../models";
import { FormTypeahead } from "../util/FormUtils";

export default function CompetitorEntryEditor(props) {
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitors] = useState([]);

  const [eventFormats, setEventFormats] = useState([]);
  const [selectedEventFormat, setSelectedEventFormat] = useState([]);

  useEffect(() => {
    (async () => {
      const competitorQuery = await DataStore.query(Competitor);
      setCompetitors(competitorQuery);
    })();
    (async () => {
      const evetnFormatsQuery = await DataStore.query(EventFormat);
      setEventFormats(evetnFormatsQuery);
    })();
  }, []);

  return (
    <>
      <Container>
        <Row>
          <span>Competitors</span>
          {selectedCompetitor.map((sc) => (
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                margin: "5px 0px 5px 0px"
              }}
            >
              <div style={{ width: "100%", color: "gray" }}>{sc.label}</div>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() =>
                  setSelectedCompetitors((_sc) =>
                    _sc.filter((__sc) => __sc.id !== sc.id)
                  )
                }
              >
                Remove
              </Button>
            </div>
          ))}
        </Row>
        <Row style={{ marginTop: 8 }}>
          <FormTypeahead
            selected={[]}
            options={
              competitors
                .map((c) => ({
                  label: c.name,
                  id: c.id
                }))
                .filter(
                  (c) => !selectedCompetitor.map((sc) => sc.id).includes(c.id)
                ) ?? []
            }
            onChange={(e) => setSelectedCompetitors((sc) => [...sc, ...e])}
          />
        </Row>
        <Row style={{ marginTop: 20 }}>
          <FormTypeahead
            label="Event Format"
            selected={selectedEventFormat}
            options={
              eventFormats.map((c) => ({
                label: c.name,
                id: c.id
              })) ?? []
            }
            onChange={(e) => setSelectedEventFormat(e)}
          />
        </Row>
        <Row>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={async () => {
                try {
                  const newCompetitorEntry = await DataStore.save(
                    new CompetitorEntry({
                      eventFormatIds: selectedEventFormat.map((ef) => ef.id)[0],
                      tournamentFormatId: props.tournamentFormatId
                    })
                  );
                  selectedCompetitor.forEach(async (sc) => {
                    const competitorObject = competitors.find(
                      (c) => c.id === sc.id
                    );
                    if (competitorObject) {
                      await DataStore.save(
                        new CompetitorCompetitorEntry({
                          competitor: competitorObject,
                          competitorEntry: newCompetitorEntry
                        })
                      );
                    }
                  });
                  props.onDone(newCompetitorEntry);
                } catch (e) {}
              }}
            >
              Create competitor entry
            </Button>
          </div>
        </Row>
      </Container>
    </>
  );
}
