import { TimeStoragePresetType } from "./storage";


export enum TimeEvents {
    RESET = 2,

    SET_RANGE = 3,
    PICK_RANGE = 4,

    SET_SELECTION = 5,
    START_SELECTING = 6,
    END_SELECTING = 7,
    CLEAR_SELECTION = 8,
    PICK_SELECTION = 9,

    ACTIVATE_PRESET = 11,

    MODIFY_SELECTION_FROM = 12,
    MODIFY_SELECTION_TO = 13,
    MODIFY_RANGE_FROM = 14,
    MODIFY_RANGE_TO = 15,


}

export enum TimePeriod {
    HOUR = "jednu hodinu",
    DAY = "jeden den",
    WEEK = "jeden týden",
    MONTH = "jeden měsíc",
    YEAR = "jeden rok"

}

type TimePayloadBase = {};
type TimeEventBase<T extends TimePayloadBase> = {
    type: TimeEvents,
    payload: T
}


// Reset

export type ResetAction = TimeEventBase<TimePayloadBase> & {
    type: TimeEvents.RESET
}

const reset = (): ResetAction => {
    return {
        type: TimeEvents.RESET,
        payload: {}
    }
}



// Activate preset

type ActivatePresetType = TimePayloadBase & {
    preset: string | TimeStoragePresetType
}

export type ActivatePresetAction = TimeEventBase<ActivatePresetType> & {
    type: TimeEvents.ACTIVATE_PRESET
}

const activatePreset = (presetSlug: string): ActivatePresetAction => {
    return {
        type: TimeEvents.ACTIVATE_PRESET,
        payload: {
            preset: presetSlug
        }
    }
}


// Selection


type SlectionPayload = TimePayloadBase & {
    value: number,
    roundTo: TimePeriod
}

// Start selection

export type StartSelectionAction = TimeEventBase<SlectionPayload> & {
    type: TimeEvents.START_SELECTING
}

const startSelection = (
    value: number,
    roundTo: TimePeriod
): StartSelectionAction => {
    return {
        type: TimeEvents.START_SELECTING,
        payload: {
            value,
            roundTo
        }
    }
}

// End selection

export type EndSelectionAction = TimeEventBase<SlectionPayload> & {
    type: TimeEvents.END_SELECTING
}

const endSelection = (
    value: number,
    roundTo: TimePeriod
): EndSelectionAction => {
    return {
        type: TimeEvents.END_SELECTING,
        payload: {
            value,
            roundTo
        }
    }
}


// Clear selection

type ClearSelectionAction = TimeEventBase<TimePayloadBase> & {
    type: TimeEvents.CLEAR_SELECTION
}

const clearSelection = (): ClearSelectionAction => {
    return {
        type: TimeEvents.CLEAR_SELECTION,
        payload: {}
    }
}


// Seting


type SetPayload = TimePayloadBase & {
    from: number,
    to: number,
    roundTo: TimePeriod
}

// Set selection

export type SetSelectionAction = TimeEventBase<SetPayload> & {
    type: TimeEvents.SET_SELECTION
}

const setSelection = (
    from: number,
    to: number,
    roundTo: TimePeriod
): SetSelectionAction => {
    return {
        type: TimeEvents.SET_SELECTION,
        payload: {
            from,
            to,
            roundTo
        }
    }
}

// Pick a period of time

type SelectionPickPayload = TimePayloadBase & {
    value: number,
    period: TimePeriod
}

export type SelectionPickAction = TimeEventBase<SelectionPickPayload> & {
    type: TimeEvents.PICK_SELECTION,
}

const pickSelection = (
    value: number,
    period: TimePeriod
): SelectionPickAction => {
    return {
        type: TimeEvents.PICK_SELECTION,
        payload: {
            value,
            period
        }
    }
}



// Set range

export type SetRangeAction = TimeEventBase<SetPayload> & {
    type: TimeEvents.SET_RANGE
}

const setRange = (
    from: number,
    to: number,
    roundTo: TimePeriod
): SetRangeAction => {
    return {
        type: TimeEvents.SET_RANGE,
        payload: {
            from,
            to,
            roundTo
        }
    }
}

// Pick a period of time

type RangePickPayload = TimePayloadBase & {
    value: number,
    period: TimePeriod
}

export type RangePickAction = TimeEventBase<RangePickPayload> & {
    type: TimeEvents.PICK_RANGE
}

const pickRange = (
    value: number,
    period: TimePeriod
): RangePickAction => {
    return {
        type: TimeEvents.PICK_RANGE,
        payload: {
            value,
            period
        }
    }
}


// Modification

type ModificationPayload = TimePayloadBase & {
    amount: number,
    period: TimePeriod
}

export type RangeFromModificationAction = TimeEventBase<ModificationPayload> & {
    type: TimeEvents.MODIFY_RANGE_FROM
}

export type RangeToModificationAction = TimeEventBase<ModificationPayload> & {
    type: TimeEvents.MODIFY_RANGE_TO
}

export type SelectionFromModificationAction = TimeEventBase<ModificationPayload> & {
    type: TimeEvents.MODIFY_SELECTION_FROM
}

export type SelectionToModificationAction = TimeEventBase<ModificationPayload> & {
    type: TimeEvents.MODIFY_SELECTION_TO
}

type ModificationEvents = RangeFromModificationAction
    | RangeToModificationAction
    | SelectionFromModificationAction
    | SelectionToModificationAction;

type ModificationEventsKeys = TimeEvents.MODIFY_RANGE_FROM | TimeEvents.MODIFY_RANGE_TO | TimeEvents.MODIFY_SELECTION_FROM | TimeEvents.MODIFY_SELECTION_TO;





const modificationActionFactory = <T extends ModificationEvents>(
    eventType: ModificationEventsKeys
) => {
    return (value: number, period: TimePeriod) => ({
        type: eventType as ModificationEventsKeys,
        payload: {
            amount: value,
            period: period
        }
    } as T)
}


/** Dispatch time events from the data */
export class TimeEventsFactory {

    public static reset = reset;

    public static activatePreset = activatePreset;

    public static startSelection = startSelection;
    public static endSelection = endSelection;
    public static clearSelection = clearSelection;

    public static setSelection = setSelection;
    public static setRange = setRange;
    public static pickSelection = pickSelection;
    public static pickRange = pickRange;

    public static modifyRangeFrom = modificationActionFactory<RangeFromModificationAction>(TimeEvents.MODIFY_RANGE_FROM);

    public static modifyRangeTo = modificationActionFactory<RangeToModificationAction>(TimeEvents.MODIFY_RANGE_TO);

    public static modifySelectionFrom = modificationActionFactory<SelectionFromModificationAction>(TimeEvents.MODIFY_RANGE_FROM);

    public static modifySelectionTo = modificationActionFactory<SelectionToModificationAction>(TimeEvents.MODIFY_RANGE_TO);



}


/** All available time actions */
export type TimeEventsType = ResetAction
    | ActivatePresetAction
    | StartSelectionAction
    | EndSelectionAction
    | ClearSelectionAction
    | SetSelectionAction
    | SetRangeAction
    | SelectionPickAction
    | RangePickAction
    | RangeFromModificationAction
    | RangeToModificationAction
    | SelectionFromModificationAction
    | SelectionToModificationAction;