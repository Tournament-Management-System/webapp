import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

type CompetitorMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CompetitorEntryMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type JudgeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TournamentFormatMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TournamentStateMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EventStateMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RoundStateMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RoomMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type VenueMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EventFormatMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CompetitorCompetitorEntryMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type JudgeTournamentFormatMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerCompetitor = {
  readonly id: string;
  readonly name?: string | null;
  readonly competitorEntries?: (CompetitorCompetitorEntry | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCompetitor = {
  readonly id: string;
  readonly name?: string | null;
  readonly competitorEntries: AsyncCollection<CompetitorCompetitorEntry>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Competitor = LazyLoading extends LazyLoadingDisabled ? EagerCompetitor : LazyCompetitor

export declare const Competitor: (new (init: ModelInit<Competitor, CompetitorMetaData>) => Competitor) & {
  copyOf(source: Competitor, mutator: (draft: MutableModel<Competitor, CompetitorMetaData>) => MutableModel<Competitor, CompetitorMetaData> | void): Competitor;
}

type EagerCompetitorEntry = {
  readonly id: string;
  readonly competitors?: (CompetitorCompetitorEntry | null)[] | null;
  readonly tournamentFormatId: string;
  readonly eventFormatIds?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCompetitorEntry = {
  readonly id: string;
  readonly competitors: AsyncCollection<CompetitorCompetitorEntry>;
  readonly tournamentFormatId: string;
  readonly eventFormatIds?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CompetitorEntry = LazyLoading extends LazyLoadingDisabled ? EagerCompetitorEntry : LazyCompetitorEntry

export declare const CompetitorEntry: (new (init: ModelInit<CompetitorEntry, CompetitorEntryMetaData>) => CompetitorEntry) & {
  copyOf(source: CompetitorEntry, mutator: (draft: MutableModel<CompetitorEntry, CompetitorEntryMetaData>) => MutableModel<CompetitorEntry, CompetitorEntryMetaData> | void): CompetitorEntry;
}

type EagerJudge = {
  readonly id: string;
  readonly name?: string | null;
  readonly tournamentFormats?: (JudgeTournamentFormat | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyJudge = {
  readonly id: string;
  readonly name?: string | null;
  readonly tournamentFormats: AsyncCollection<JudgeTournamentFormat>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Judge = LazyLoading extends LazyLoadingDisabled ? EagerJudge : LazyJudge

export declare const Judge: (new (init: ModelInit<Judge, JudgeMetaData>) => Judge) & {
  copyOf(source: Judge, mutator: (draft: MutableModel<Judge, JudgeMetaData>) => MutableModel<Judge, JudgeMetaData> | void): Judge;
}

type EagerTournamentFormat = {
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly startTime?: string | null;
  readonly eventFee?: number | null;
  readonly eventFormatIds?: (string | null)[] | null;
  readonly venueId?: string | null;
  readonly tournamentState?: TournamentState | null;
  readonly competitionEntries?: (CompetitorEntry | null)[] | null;
  readonly judges?: (JudgeTournamentFormat | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly tournamentFormatTournamentStateId?: string | null;
}

type LazyTournamentFormat = {
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly startTime?: string | null;
  readonly eventFee?: number | null;
  readonly eventFormatIds?: (string | null)[] | null;
  readonly venueId?: string | null;
  readonly tournamentState: AsyncItem<TournamentState | undefined>;
  readonly competitionEntries: AsyncCollection<CompetitorEntry>;
  readonly judges: AsyncCollection<JudgeTournamentFormat>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly tournamentFormatTournamentStateId?: string | null;
}

export declare type TournamentFormat = LazyLoading extends LazyLoadingDisabled ? EagerTournamentFormat : LazyTournamentFormat

export declare const TournamentFormat: (new (init: ModelInit<TournamentFormat, TournamentFormatMetaData>) => TournamentFormat) & {
  copyOf(source: TournamentFormat, mutator: (draft: MutableModel<TournamentFormat, TournamentFormatMetaData>) => MutableModel<TournamentFormat, TournamentFormatMetaData> | void): TournamentFormat;
}

type EagerTournamentState = {
  readonly id: string;
  readonly tournamentFormatId?: string | null;
  readonly eventFormatIds?: (string | null)[] | null;
  readonly competitors?: string | null;
  readonly judges?: string | null;
  readonly eventState?: (EventState | null)[] | null;
  readonly rooms?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTournamentState = {
  readonly id: string;
  readonly tournamentFormatId?: string | null;
  readonly eventFormatIds?: (string | null)[] | null;
  readonly competitors?: string | null;
  readonly judges?: string | null;
  readonly eventState: AsyncCollection<EventState>;
  readonly rooms?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type TournamentState = LazyLoading extends LazyLoadingDisabled ? EagerTournamentState : LazyTournamentState

export declare const TournamentState: (new (init: ModelInit<TournamentState, TournamentStateMetaData>) => TournamentState) & {
  copyOf(source: TournamentState, mutator: (draft: MutableModel<TournamentState, TournamentStateMetaData>) => MutableModel<TournamentState, TournamentStateMetaData> | void): TournamentState;
}

type EagerEventState = {
  readonly id: string;
  readonly tournamentFormatId?: string | null;
  readonly eventFormatId?: string | null;
  readonly awards?: (string | null)[] | null;
  readonly currentRoundIdx?: number | null;
  readonly tournamentStateId: string;
  readonly roundState?: (RoundState | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyEventState = {
  readonly id: string;
  readonly tournamentFormatId?: string | null;
  readonly eventFormatId?: string | null;
  readonly awards?: (string | null)[] | null;
  readonly currentRoundIdx?: number | null;
  readonly tournamentStateId: string;
  readonly roundState: AsyncCollection<RoundState>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type EventState = LazyLoading extends LazyLoadingDisabled ? EagerEventState : LazyEventState

export declare const EventState: (new (init: ModelInit<EventState, EventStateMetaData>) => EventState) & {
  copyOf(source: EventState, mutator: (draft: MutableModel<EventState, EventStateMetaData>) => MutableModel<EventState, EventStateMetaData> | void): EventState;
}

type EagerRoundState = {
  readonly id: string;
  readonly queued?: (string | null)[] | null;
  readonly started?: (string | null)[] | null;
  readonly completed?: (string | null)[] | null;
  readonly assigned?: (string | null)[] | null;
  readonly tournamentFormatId?: string | null;
  readonly tournamentStateId?: string | null;
  readonly eventFormatId?: string | null;
  readonly eventStateId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRoundState = {
  readonly id: string;
  readonly queued?: (string | null)[] | null;
  readonly started?: (string | null)[] | null;
  readonly completed?: (string | null)[] | null;
  readonly assigned?: (string | null)[] | null;
  readonly tournamentFormatId?: string | null;
  readonly tournamentStateId?: string | null;
  readonly eventFormatId?: string | null;
  readonly eventStateId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type RoundState = LazyLoading extends LazyLoadingDisabled ? EagerRoundState : LazyRoundState

export declare const RoundState: (new (init: ModelInit<RoundState, RoundStateMetaData>) => RoundState) & {
  copyOf(source: RoundState, mutator: (draft: MutableModel<RoundState, RoundStateMetaData>) => MutableModel<RoundState, RoundStateMetaData> | void): RoundState;
}

type EagerRoom = {
  readonly id: string;
  readonly status?: string | null;
  readonly venueId?: string | null;
  readonly competitorEntryIds?: (string | null)[] | null;
  readonly judges?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRoom = {
  readonly id: string;
  readonly status?: string | null;
  readonly venueId?: string | null;
  readonly competitorEntryIds?: (string | null)[] | null;
  readonly judges?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Room = LazyLoading extends LazyLoadingDisabled ? EagerRoom : LazyRoom

export declare const Room: (new (init: ModelInit<Room, RoomMetaData>) => Room) & {
  copyOf(source: Room, mutator: (draft: MutableModel<Room, RoomMetaData>) => MutableModel<Room, RoomMetaData> | void): Room;
}

type EagerVenue = {
  readonly id: string;
  readonly name?: string | null;
  readonly venueType?: string | null;
  readonly rooms?: (string | null)[] | null;
  readonly address?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyVenue = {
  readonly id: string;
  readonly name?: string | null;
  readonly venueType?: string | null;
  readonly rooms?: (string | null)[] | null;
  readonly address?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Venue = LazyLoading extends LazyLoadingDisabled ? EagerVenue : LazyVenue

export declare const Venue: (new (init: ModelInit<Venue, VenueMetaData>) => Venue) & {
  copyOf(source: Venue, mutator: (draft: MutableModel<Venue, VenueMetaData>) => MutableModel<Venue, VenueMetaData> | void): Venue;
}

type EagerEventFormat = {
  readonly id: string;
  readonly awards?: (string | null)[] | null;
  readonly rounds?: (string | null)[] | null;
  readonly name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyEventFormat = {
  readonly id: string;
  readonly awards?: (string | null)[] | null;
  readonly rounds?: (string | null)[] | null;
  readonly name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type EventFormat = LazyLoading extends LazyLoadingDisabled ? EagerEventFormat : LazyEventFormat

export declare const EventFormat: (new (init: ModelInit<EventFormat, EventFormatMetaData>) => EventFormat) & {
  copyOf(source: EventFormat, mutator: (draft: MutableModel<EventFormat, EventFormatMetaData>) => MutableModel<EventFormat, EventFormatMetaData> | void): EventFormat;
}

type EagerCompetitorCompetitorEntry = {
  readonly id: string;
  readonly competitor: Competitor;
  readonly competitorEntry: CompetitorEntry;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCompetitorCompetitorEntry = {
  readonly id: string;
  readonly competitor: AsyncItem<Competitor>;
  readonly competitorEntry: AsyncItem<CompetitorEntry>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CompetitorCompetitorEntry = LazyLoading extends LazyLoadingDisabled ? EagerCompetitorCompetitorEntry : LazyCompetitorCompetitorEntry

export declare const CompetitorCompetitorEntry: (new (init: ModelInit<CompetitorCompetitorEntry, CompetitorCompetitorEntryMetaData>) => CompetitorCompetitorEntry) & {
  copyOf(source: CompetitorCompetitorEntry, mutator: (draft: MutableModel<CompetitorCompetitorEntry, CompetitorCompetitorEntryMetaData>) => MutableModel<CompetitorCompetitorEntry, CompetitorCompetitorEntryMetaData> | void): CompetitorCompetitorEntry;
}

type EagerJudgeTournamentFormat = {
  readonly id: string;
  readonly judge: Judge;
  readonly tournamentFormat: TournamentFormat;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyJudgeTournamentFormat = {
  readonly id: string;
  readonly judge: AsyncItem<Judge>;
  readonly tournamentFormat: AsyncItem<TournamentFormat>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type JudgeTournamentFormat = LazyLoading extends LazyLoadingDisabled ? EagerJudgeTournamentFormat : LazyJudgeTournamentFormat

export declare const JudgeTournamentFormat: (new (init: ModelInit<JudgeTournamentFormat, JudgeTournamentFormatMetaData>) => JudgeTournamentFormat) & {
  copyOf(source: JudgeTournamentFormat, mutator: (draft: MutableModel<JudgeTournamentFormat, JudgeTournamentFormatMetaData>) => MutableModel<JudgeTournamentFormat, JudgeTournamentFormatMetaData> | void): JudgeTournamentFormat;
}