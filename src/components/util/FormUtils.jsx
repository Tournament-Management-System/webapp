import {
  Accordion,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table
} from "react-bootstrap";
import PropTypes from "prop-types";
import { Typeahead } from "react-bootstrap-typeahead";

import "./FormUtils.scss";
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify";
import { useDispatch } from "react-redux";
import { DATA_TYPE, fetchAWSData } from "../../redux/dataSlice";

export function NothingHere(props) {
  return (
    <div className="empty-text">
      🏜️ There's nothing here
      {props.addNewText && `, click "${props.addNewText}"`}
    </div>
  );
}

export function FormInput(props) {
  return (
    <Form.Group className="mb-3">
      {props.label && <Form.Label>{props.label}</Form.Label>}
      {props.readOnly ? (
        <div>
          <Form.Text>{props.value}</Form.Text>
        </div>
      ) : (
        <>
          <InputGroup>
            {props.prefix && <InputGroup.Text>{props.prefix}</InputGroup.Text>}
            <Form.Control
              placeholder={props.placeholder}
              value={props.value ?? ""}
              onChange={props.onChange}
              onBlur={props.onBlur}
              disabled={props.disabled}
              isInvalid={!!props.invalidMessage}
              {...(props.rows ? { as: "textarea", rows: props.rows } : {})}
            />
            {props.suffix && <InputGroup.Text>{props.suffix}</InputGroup.Text>}
            {props.invalidMessage && (
              <Form.Control.Feedback type="invalid">
                {props.invalidMessage}
              </Form.Control.Feedback>
            )}
          </InputGroup>
          {props.subtext && (
            <Form.Text className="text-muted">{props.subtext}</Form.Text>
          )}
        </>
      )}
    </Form.Group>
  );
}
FormInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  subtext: PropTypes.string,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  rows: PropTypes.number,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func
};

export function ListEditor(props) {
  if (!Array.isArray(props.value)) {
    return <div>Error: value is not an array</div>;
  }

  const handleChangeCurry = (index) => (e) =>
    props.onChange("add", index, e?.target?.value ?? "");
  const handleRemoveCurry = (index) => (e) =>
    props.onChange("remove", index, e?.target?.value ?? "");

  return (
    <div className="list-editor_container">
      <Form.Group className="mb-3">
        {props.label && <Form.Label>{props.label}</Form.Label>}
        {props?.value?.map?.((item, index) => (
          <InputGroup className="mb-3">
            <Form.Control
              placeholder={props.placeholder}
              value={item}
              onChange={handleChangeCurry(index)}
              isInvalid={!props?.validator?.test?.(item)}
            />
            <Button variant="outline-danger" onClick={handleRemoveCurry(index)}>
              Delete
            </Button>
            {!props?.validator?.test?.(item) && (
              <Form.Control.Feedback className="form-feedback" type="invalid">
                {props.invalidMessage}
              </Form.Control.Feedback>
            )}
          </InputGroup>
        ))}
        {props?.value?.length <= 0 && (
          <NothingHere addNewText={props.addNewText ?? "Add"} />
        )}
        {props.subtext && (
          <Form.Text className="text-muted">{props.subtext}</Form.Text>
        )}
      </Form.Group>
      <Button
        className="add-text-btn"
        onClick={handleChangeCurry(props.value.length)}
      >
        {props.addNewText ?? "Add"}
      </Button>
    </div>
  );
}
ListEditor.propTypes = {
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  invalidMessage: PropTypes.string,
  subtext: PropTypes.string,
  addNewText: PropTypes.string,
  validator: PropTypes.any
};

export function FormTypeahead(props) {
  const [edited, setEdited] = useState(false);
  const inputIsInvalid = props?.selected?.length <= 0 && edited;

  useEffect(() => {
    if (props.selected.length > 0 && !edited) {
      setEdited(true);
    }
  }, [props.selected, edited]);

  return (
    <div style={{ marginBottom: 16 }}>
      <Form.Group>
        {props.label && <Form.Label>{props.label}</Form.Label>}
        {props.readOnly ? (
          <div>
            <Form.Text>
              {props.selected
                ?.map?.((v) => `${v[props.labelKey ?? "label"]}`)
                .join(", ")}
            </Form.Text>
          </div>
        ) : (
          <>
            <InputGroup>
              <Typeahead
                isInvalid={inputIsInvalid}
                onChange={props.onChange}
                options={props.options}
                placeholder={props.placeholder}
                selected={props.selected}
                multiple={props.multiple}
                {...(props.labelKey ? { labelKey: props.labelKey } : {})}
              />
              {props.invalidMessage && inputIsInvalid && (
                <Form.Control.Feedback
                  className="form-feedback"
                  type="invalid"
                  style={{ display: "block" }}
                >
                  {props.invalidMessage}
                </Form.Control.Feedback>
              )}
            </InputGroup>
            {props.subtext && (
              <Form.Text className="text-muted">{props.subtext}</Form.Text>
            )}
          </>
        )}
      </Form.Group>
    </div>
  );
}
FormTypeahead.propTypes = {
  selected: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  invalidMessage: PropTypes.string
};

export function JSONFieldEditor(props) {
  const { jsonValue, onChange, fieldConfig } = props;

  if (!jsonValue || typeof jsonValue !== "object" || Array.isArray(jsonValue)) {
    return <div>Error: invalid jsonValue</div>;
  }

  const handleChangeCurry = (key, eventProcessor) => (e) => {
    const jsonValueCopy = { ...jsonValue };
    jsonValueCopy[key] = eventProcessor ? eventProcessor(e) : e;
    onChange?.(jsonValueCopy);
  };

  return (
    <Container>
      <Row>
        {Object.entries(jsonValue).map(([key, value]) => {
          const selectOptions = fieldConfig?.[key]?.selectOptions;

          return (
            <Col xs={12} sm={6}>
              {selectOptions ? (
                <FormTypeahead
                  label={fieldConfig?.[key]?.label || key}
                  options={selectOptions}
                  selected={
                    value
                      ? [
                          {
                            id: value,
                            label: selectOptions.find((opt) => opt.id === value)
                              .label
                          }
                        ]
                      : []
                  }
                  onChange={(e) => {
                    const jsonValueCopy = { ...jsonValue };
                    jsonValueCopy[key] = e?.[0]?.id;
                    onChange?.(jsonValueCopy);
                  }}
                />
              ) : (
                <FormInput
                  value={value}
                  label={fieldConfig?.[key]?.label || key}
                  onChange={handleChangeCurry(key, (e) => e.target.value)}
                />
              )}
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
JSONFieldEditor.propTypes = {
  jsonValue: PropTypes.object,
  labelMapper: PropTypes.object,
  onChange: PropTypes.func
};

export function JSONArrayEditor(props) {
  const { jArray, setJArray, defaultJson, fieldConfig } = props;
  const [accordionActive, setAccordionActive] = useState("0");

  return (
    <>
      <div className="json-array-editor">
        <h4 className="title">{props.label}</h4>
        <Button
          size="sm"
          onClick={() =>
            setJArray((awrd) => {
              const awrdCopy = [...awrd];
              awrdCopy.push(defaultJson);
              setTimeout(() => {
                setAccordionActive(awrdCopy.length - 1);
              }, 100);
              return awrdCopy;
            })
          }
        >
          Add
        </Button>
      </div>
      {jArray?.length === 0 ? (
        <NothingHere />
      ) : (
        <Accordion
          activeKey={accordionActive}
          onSelect={(e) => setAccordionActive(e)}
        >
          {jArray?.map?.((jsonObject, index) => (
            <Accordion.Item eventKey={index}>
              <Accordion.Header>
                {`${fieldConfig.name} #${index + 1} ${
                  jsonObject[fieldConfig.primaryField]
                    ? "- " + jsonObject[fieldConfig.primaryField]
                    : ""
                }`}
              </Accordion.Header>
              <Accordion.Body>
                <JSONFieldEditor
                  jsonValue={jsonObject}
                  fieldConfig={fieldConfig}
                  onChange={(e) => {
                    if (Array.isArray(jArray)) {
                      const awardCopy = [...jArray];
                      awardCopy[index] = e;
                      setJArray(awardCopy);
                    }
                  }}
                />
                <Button
                  style={{ marginLeft: 12 }}
                  variant="outline-primary"
                  onClick={() =>
                    setJArray((ja) => {
                      if (ja[index - 1]) {
                        setTimeout(() => {
                          setAccordionActive(index - 1);
                        }, 100);
                      }
                      return ja.filter((_, _index) => _index !== index);
                    })
                  }
                >
                  Remove
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </>
  );
}

export function DataDelete(props) {
  const dispatch = useDispatch();

  return (
    <Button
      onClick={async () => {
        const todelete = await DataStore.query(props.model, props.id);
        await DataStore.delete(todelete);
        fetchAWSData(dispatch, DATA_TYPE.tournamentFormats);
      }}
      variant="outline-danger"
    >
      Delete
    </Button>
  );
}

export function NonEditJsonArrayTable(props) {
  const { json } = props;
  if (!json) {
    return <></>;
  }
  return (
    <>
      <Table bordered hover style={{ marginTop: 20 }}>
        <thead>
          <tr>
            {Object.keys(json[0] ?? []).map((fieldName) => (
              <th>{fieldName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {json.map((jsonObject) => (
            <tr>
              {Object.values(jsonObject).map((jsonValue) => (
                <td>{`${jsonValue}`}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
