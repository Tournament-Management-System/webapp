import { createSlice } from "@reduxjs/toolkit";
import { DataStore } from "aws-amplify";
import {
  Competitor,
  CompetitorEntry,
  EventFormat,
  EventState,
  Judge,
  RoundState,
  TournamentFormat,
  TournamentState
} from "../models";

export const DATA_TYPE = {
  tournamentStates: "tournamentStates",
  tournamentFormats: "tournamentFormats",
  eventFormats: "eventFormats",
  eventStates: "eventStates",
  roundStates: "roundStates",
  competitorEntries: "competitorEntries",
  competitors: "competitors",
  judges: "judges"
};

export const AWS_DATA_TYPE = {
  tournamentStates: TournamentState,
  tournamentFormats: TournamentFormat,
  eventFormats: EventFormat,
  eventStates: EventState,
  roundStates: RoundState,
  competitorEntries: CompetitorEntry,
  competitors: Competitor,
  judges: Judge
};

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    tournamentStates: [],
    tournamentFormats: [],
    eventFormats: [],
    eventStates: [],
    roundStates: [],
    competitorEntries: [],
    competitors: [],
    judges: []
  },
  reducers: {
    updateData: (state, action) => {
      state[action.payload.dataType] = action.payload.data;
    }
  }
});

export const dataAction = dataSlice.actions;
export const dataReducer = dataSlice.reducer;

// Selectors
export const selectData = (state, dataType) => state?.data?.[dataType] ?? [];
export const selectDataById = (state, dataType, dataId) =>
  state?.[dataType]?.find?.((data) => data.id === dataId);

// Thunks
export async function fetchAWSData(dispatch, dataType) {
  const data = await DataStore.query(AWS_DATA_TYPE[dataType]);
  dispatch(
    dataAction.updateData({
      dataType,
      data
    })
  );
}
