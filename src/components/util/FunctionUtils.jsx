import { Auth, DataStore } from "aws-amplify";
import {
  RoundState,
  Competitor,
  CompetitorCompetitorEntry,
  Judge,
  JudgeTournamentFormat
} from "../../models";
import fetch from "node-fetch";
import { USER_TYPES } from "../../App";

export const fetchCompetitorNameFromRoundState = async (
  roundStateId,
  groupIndx,
  step
) => {
  const [roundState, competitorNamesQuery, competitors] = await Promise.all([
    DataStore.query(RoundState, (rs) => rs.id.eq(roundStateId)),
    DataStore.query(CompetitorCompetitorEntry),
    DataStore.query(Competitor)
  ]);

  const roundCompetitorEntries = roundState[0][step]
    .map((group) => JSON.parse(group))
    .find((gs) => gs.groupId === groupIndx).competitors;
  const competitorNames = competitorNamesQuery.reduce((prevVal, curVal) => {
    if (prevVal[curVal.competitorEntryID]) {
      prevVal[curVal.competitorEntryID].push(curVal.competitorID);
    } else {
      prevVal[curVal.competitorEntryID] = [curVal.competitorID];
    }
    return prevVal;
  }, {});

  return [
    roundCompetitorEntries.map((competitorEntryId) => {
      const competitorIds = competitorNames?.[competitorEntryId];
      if (!competitorIds) {
        return "EMPTY NAME";
      }
      return competitorIds
        .map((c) => {
          const competitorObject = competitors.find((_c) => _c.id === c);
          return competitorObject.name;
        })
        .join(", ");
    }),
    roundCompetitorEntries
  ];
};
export function getMatches(roundState, competitorIds) {
  const matches = [];

  const lookForCompetitorIdInGroup = (groupArray) =>
    groupArray.find((groupState) =>
      groupState.competitors.some((compEntryId) =>
        competitorIds.includes(compEntryId)
      )
    );

  roundState.forEach((rs) => {
    ["completed", "assigned", "queued", "started"].forEach((state) => {
      const relevantGroupState = lookForCompetitorIdInGroup(rs[state]);
      if (relevantGroupState) {
        matches.push(relevantGroupState);
      }
    });
  });

  return matches;
}

export async function getneededCompetitorEntries(competitorId) {
  const comcompetitorEntires = await DataStore.query(CompetitorCompetitorEntry);
  const neededCompetitorEntries = comcompetitorEntires
    .filter((ce) => ce.competitor.id === competitorId)
    .map((ce) => ce.competitorEntryID);
  return neededCompetitorEntries;
}
export async function requestApiGateway(endpointURL, data, method) {
  console.log("data in requestAPIGATEWAY " + JSON.stringify(data));
  const response = await fetch(endpointURL, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    },
    mode: "cors"
  });
  const result = await response.json();
  return result;
}

export async function mapCompetitorEntryName(competitorEntryId) {
  const cceObject = await DataStore.query(CompetitorCompetitorEntry, (cce) =>
    cce.competitorEntry.id.eq(competitorEntryId)
  );
  const competitorNames = [];
  for (const cce of cceObject) {
    const competitorId = cce.competitorID;
    const ceObject = await DataStore.query(Competitor, (c) =>
      c.id.eq(competitorId)
    );
    competitorNames.push(ceObject[0].name);
  }
  if (competitorNames.length > 0) {
    return competitorNames.join(", ");
  }
  return "<Empty Name>";
}

export async function mapJudgesNameFromId(judgeId, isJudgeMapperId) {
  if (isJudgeMapperId) {
    const realJudgeId = (
      await (
        await DataStore.query(JudgeTournamentFormat, judgeId)
      ).judge
    ).id;
    const judgeObj = await DataStore.query(Judge, realJudgeId);
    return judgeObj?.name ?? "<Empty Name>";
  }
  const judgeObj = await DataStore.query(Judge, judgeId);
  return judgeObj?.name ?? "<Empty Name>";
}

export async function handleUserTypeRedirection(navigate) {
  const currentUser = await Auth.currentAuthenticatedUser();
  const type = currentUser?.attributes?.profile;
  const curHref = window?.location?.href;
  if (curHref.includes("preventRedirect")) {
    return;
  }
  if (type) {
    if (type === USER_TYPES.COMPETITOR && !curHref.includes("competitor"))
      navigate("/competitor");
    else if (type === USER_TYPES.JUDGE && !curHref.includes("judges"))
      navigate("/judges");
    else if (type === USER_TYPES.ORGANIZER && !curHref.includes("organizer"))
      navigate("/organizer");
  }
}
