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
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Room } from "../models";
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
export default function RoomUpdateForm(props) {
  const {
    id: idProp,
    room,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    status: "",
    venueId: "",
    competitorEntryIds: [],
    judges: [],
  };
  const [status, setStatus] = React.useState(initialValues.status);
  const [venueId, setVenueId] = React.useState(initialValues.venueId);
  const [competitorEntryIds, setCompetitorEntryIds] = React.useState(
    initialValues.competitorEntryIds
  );
  const [judges, setJudges] = React.useState(initialValues.judges);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = roomRecord
      ? { ...initialValues, ...roomRecord }
      : initialValues;
    setStatus(cleanValues.status);
    setVenueId(cleanValues.venueId);
    setCompetitorEntryIds(cleanValues.competitorEntryIds ?? []);
    setCurrentCompetitorEntryIdsValue("");
    setJudges(cleanValues.judges ?? []);
    setCurrentJudgesValue("");
    setErrors({});
  };
  const [roomRecord, setRoomRecord] = React.useState(room);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp ? await DataStore.query(Room, idProp) : room;
      setRoomRecord(record);
    };
    queryData();
  }, [idProp, room]);
  React.useEffect(resetStateValues, [roomRecord]);
  const [currentCompetitorEntryIdsValue, setCurrentCompetitorEntryIdsValue] =
    React.useState("");
  const competitorEntryIdsRef = React.createRef();
  const [currentJudgesValue, setCurrentJudgesValue] = React.useState("");
  const judgesRef = React.createRef();
  const validations = {
    status: [],
    venueId: [],
    competitorEntryIds: [],
    judges: [],
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
          status,
          venueId,
          competitorEntryIds,
          judges,
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
            Room.copyOf(roomRecord, (updated) => {
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
      {...getOverrideProps(overrides, "RoomUpdateForm")}
      {...rest}
    >
      <TextField
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status: value,
              venueId,
              competitorEntryIds,
              judges,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      ></TextField>
      <TextField
        label="Venue id"
        isRequired={false}
        isReadOnly={false}
        value={venueId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              venueId: value,
              competitorEntryIds,
              judges,
            };
            const result = onChange(modelFields);
            value = result?.venueId ?? value;
          }
          if (errors.venueId?.hasError) {
            runValidationTasks("venueId", value);
          }
          setVenueId(value);
        }}
        onBlur={() => runValidationTasks("venueId", venueId)}
        errorMessage={errors.venueId?.errorMessage}
        hasError={errors.venueId?.hasError}
        {...getOverrideProps(overrides, "venueId")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              status,
              venueId,
              competitorEntryIds: values,
              judges,
            };
            const result = onChange(modelFields);
            values = result?.competitorEntryIds ?? values;
          }
          setCompetitorEntryIds(values);
          setCurrentCompetitorEntryIdsValue("");
        }}
        currentFieldValue={currentCompetitorEntryIdsValue}
        label={"Competitor entry ids"}
        items={competitorEntryIds}
        hasError={errors.competitorEntryIds?.hasError}
        setFieldValue={setCurrentCompetitorEntryIdsValue}
        inputFieldRef={competitorEntryIdsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Competitor entry ids"
          isRequired={false}
          isReadOnly={false}
          value={currentCompetitorEntryIdsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.competitorEntryIds?.hasError) {
              runValidationTasks("competitorEntryIds", value);
            }
            setCurrentCompetitorEntryIdsValue(value);
          }}
          onBlur={() =>
            runValidationTasks(
              "competitorEntryIds",
              currentCompetitorEntryIdsValue
            )
          }
          errorMessage={errors.competitorEntryIds?.errorMessage}
          hasError={errors.competitorEntryIds?.hasError}
          ref={competitorEntryIdsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "competitorEntryIds")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              status,
              venueId,
              competitorEntryIds,
              judges: values,
            };
            const result = onChange(modelFields);
            values = result?.judges ?? values;
          }
          setJudges(values);
          setCurrentJudgesValue("");
        }}
        currentFieldValue={currentJudgesValue}
        label={"Judges"}
        items={judges}
        hasError={errors.judges?.hasError}
        setFieldValue={setCurrentJudgesValue}
        inputFieldRef={judgesRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Judges"
          isRequired={false}
          isReadOnly={false}
          value={currentJudgesValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.judges?.hasError) {
              runValidationTasks("judges", value);
            }
            setCurrentJudgesValue(value);
          }}
          onBlur={() => runValidationTasks("judges", currentJudgesValue)}
          errorMessage={errors.judges?.errorMessage}
          hasError={errors.judges?.hasError}
          ref={judgesRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "judges")}
        ></TextField>
      </ArrayField>
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
          isDisabled={!(idProp || room)}
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
              !(idProp || room) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
