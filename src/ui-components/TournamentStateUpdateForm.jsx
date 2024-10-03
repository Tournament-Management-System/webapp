/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { TournamentState } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
}) {
  const labelElement = <Text>{label}</Text>;
  const { tokens } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button
            size="small"
            variation="link"
            color={tokens.colors.brand.primary[80]}
            isDisabled={hasError}
            onClick={addItem}
          >
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function TournamentStateUpdateForm(props) {
  const {
    id: idProp,
    tournamentState,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    tournamentFormatId: "",
    eventFormatIds: [],
    competitors: "",
    judges: "",
    rooms: "",
  };
  const [tournamentFormatId, setTournamentFormatId] = React.useState(
    initialValues.tournamentFormatId
  );
  const [eventFormatIds, setEventFormatIds] = React.useState(
    initialValues.eventFormatIds
  );
  const [competitors, setCompetitors] = React.useState(
    initialValues.competitors
  );
  const [judges, setJudges] = React.useState(initialValues.judges);
  const [rooms, setRooms] = React.useState(initialValues.rooms);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = tournamentStateRecord
      ? { ...initialValues, ...tournamentStateRecord }
      : initialValues;
    setTournamentFormatId(cleanValues.tournamentFormatId);
    setEventFormatIds(cleanValues.eventFormatIds ?? []);
    setCurrentEventFormatIdsValue("");
    setCompetitors(
      typeof cleanValues.competitors === "string"
        ? cleanValues.competitors
        : JSON.stringify(cleanValues.competitors)
    );
    setJudges(
      typeof cleanValues.judges === "string"
        ? cleanValues.judges
        : JSON.stringify(cleanValues.judges)
    );
    setRooms(
      typeof cleanValues.rooms === "string"
        ? cleanValues.rooms
        : JSON.stringify(cleanValues.rooms)
    );
    setErrors({});
  };
  const [tournamentStateRecord, setTournamentStateRecord] =
    React.useState(tournamentState);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(TournamentState, idProp)
        : tournamentState;
      setTournamentStateRecord(record);
    };
    queryData();
  }, [idProp, tournamentState]);
  React.useEffect(resetStateValues, [tournamentStateRecord]);
  const [currentEventFormatIdsValue, setCurrentEventFormatIdsValue] =
    React.useState("");
  const eventFormatIdsRef = React.createRef();
  const validations = {
    tournamentFormatId: [],
    eventFormatIds: [],
    competitors: [{ type: "JSON" }],
    judges: [{ type: "JSON" }],
    rooms: [{ type: "JSON" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value = getDisplayValue
      ? getDisplayValue(currentValue)
      : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          tournamentFormatId,
          eventFormatIds,
          competitors,
          judges,
          rooms,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(
            TournamentState.copyOf(tournamentStateRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "TournamentStateUpdateForm")}
      {...rest}
    >
      <TextField
        label="Tournament format id"
        isRequired={false}
        isReadOnly={false}
        value={tournamentFormatId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              tournamentFormatId: value,
              eventFormatIds,
              competitors,
              judges,
              rooms,
            };
            const result = onChange(modelFields);
            value = result?.tournamentFormatId ?? value;
          }
          if (errors.tournamentFormatId?.hasError) {
            runValidationTasks("tournamentFormatId", value);
          }
          setTournamentFormatId(value);
        }}
        onBlur={() =>
          runValidationTasks("tournamentFormatId", tournamentFormatId)
        }
        errorMessage={errors.tournamentFormatId?.errorMessage}
        hasError={errors.tournamentFormatId?.hasError}
        {...getOverrideProps(overrides, "tournamentFormatId")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              tournamentFormatId,
              eventFormatIds: values,
              competitors,
              judges,
              rooms,
            };
            const result = onChange(modelFields);
            values = result?.eventFormatIds ?? values;
          }
          setEventFormatIds(values);
          setCurrentEventFormatIdsValue("");
        }}
        currentFieldValue={currentEventFormatIdsValue}
        label={"Event format ids"}
        items={eventFormatIds}
        hasError={errors.eventFormatIds?.hasError}
        setFieldValue={setCurrentEventFormatIdsValue}
        inputFieldRef={eventFormatIdsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Event format ids"
          isRequired={false}
          isReadOnly={false}
          value={currentEventFormatIdsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.eventFormatIds?.hasError) {
              runValidationTasks("eventFormatIds", value);
            }
            setCurrentEventFormatIdsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("eventFormatIds", currentEventFormatIdsValue)
          }
          errorMessage={errors.eventFormatIds?.errorMessage}
          hasError={errors.eventFormatIds?.hasError}
          ref={eventFormatIdsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "eventFormatIds")}
        ></TextField>
      </ArrayField>
      <TextAreaField
        label="Competitors"
        isRequired={false}
        isReadOnly={false}
        value={competitors}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              tournamentFormatId,
              eventFormatIds,
              competitors: value,
              judges,
              rooms,
            };
            const result = onChange(modelFields);
            value = result?.competitors ?? value;
          }
          if (errors.competitors?.hasError) {
            runValidationTasks("competitors", value);
          }
          setCompetitors(value);
        }}
        onBlur={() => runValidationTasks("competitors", competitors)}
        errorMessage={errors.competitors?.errorMessage}
        hasError={errors.competitors?.hasError}
        {...getOverrideProps(overrides, "competitors")}
      ></TextAreaField>
      <TextAreaField
        label="Judges"
        isRequired={false}
        isReadOnly={false}
        value={judges}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              tournamentFormatId,
              eventFormatIds,
              competitors,
              judges: value,
              rooms,
            };
            const result = onChange(modelFields);
            value = result?.judges ?? value;
          }
          if (errors.judges?.hasError) {
            runValidationTasks("judges", value);
          }
          setJudges(value);
        }}
        onBlur={() => runValidationTasks("judges", judges)}
        errorMessage={errors.judges?.errorMessage}
        hasError={errors.judges?.hasError}
        {...getOverrideProps(overrides, "judges")}
      ></TextAreaField>
      <TextAreaField
        label="Rooms"
        isRequired={false}
        isReadOnly={false}
        value={rooms}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              tournamentFormatId,
              eventFormatIds,
              competitors,
              judges,
              rooms: value,
            };
            const result = onChange(modelFields);
            value = result?.rooms ?? value;
          }
          if (errors.rooms?.hasError) {
            runValidationTasks("rooms", value);
          }
          setRooms(value);
        }}
        onBlur={() => runValidationTasks("rooms", rooms)}
        errorMessage={errors.rooms?.errorMessage}
        hasError={errors.rooms?.hasError}
        {...getOverrideProps(overrides, "rooms")}
      ></TextAreaField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || tournamentState)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || tournamentState) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
