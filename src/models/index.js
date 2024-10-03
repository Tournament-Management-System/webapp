// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Competitor, CompetitorEntry, Judge, TournamentFormat, TournamentState, EventState, RoundState, Room, Venue, EventFormat, CompetitorCompetitorEntry, JudgeTournamentFormat } = initSchema(schema);

export {
  Competitor,
  CompetitorEntry,
  Judge,
  TournamentFormat,
  TournamentState,
  EventState,
  RoundState,
  Room,
  Venue,
  EventFormat,
  CompetitorCompetitorEntry,
  JudgeTournamentFormat
};