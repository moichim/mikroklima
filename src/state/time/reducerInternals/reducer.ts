import { differenceInDays, differenceInHours, differenceInMonths, differenceInYears } from "date-fns";
import { Reducer } from "react";
import { ActivatePresetAction, EndSelectionAction, RangeFromModificationAction, RangePickAction, RangeToModificationAction, SelectionFromModificationAction, SelectionPickAction, SelectionToModificationAction, SetRangeAction, SetSelectionAction, StartSelectionAction, TimeEvents, TimeEventsType, TimePeriod } from "./actions";
import { TimeStorageType } from "./storage";
import { TimeRound } from "./timeUtils/rounding";
import { TimeFormat } from "./timeUtils/formatting";


const difference = (
    a: number,
    b: number
) => {
    return differenceInHours( a, b );
}


export const correct = (storage: TimeStorageType) => {

    // Correct order of the primary range
    if (storage.from > storage.to) {
        const tmp = storage.from;
        storage.from = storage.to;
        storage.to = tmp;
    }

    // Make sure both selections are empty when need to be
    if (storage.selectionFrom === undefined || storage.selectionTo === undefined) {
        storage.selectionFrom = undefined;
        storage.selectionTo = undefined;
    }

    else {

        // Make sure that selection is corrected properly
        if (storage.selectionFrom > storage.selectionTo) {
            const tmp = storage.selectionTo;
            storage.selectionFrom = storage.selectionTo;
            storage.selectionTo = tmp;
        }

        // Clamp the selection within the default range
        if (storage.selectionFrom < storage.defaultFrom) {
            storage.selectionFrom = storage.defaultFrom;
        }
        if (storage.selectionTo > storage.defaultTo) {
            storage.selectionTo = storage.defaultTo;
        }
    }

    // Clamp the cursor within the range
    if (storage.selectionCursor) {
        if (storage.selectionCursor < storage.defaultFrom) {
            storage.selectionCursor = storage.defaultFrom;
        }
        if (storage.selectionCursor > storage.defaultTo) {
            storage.selectionCursor = storage.defaultTo;
        }
    }

    // Calculate the lower & rise distances
    storage.fromLowerHours = difference( storage.from, storage.defaultFrom );
    storage.fromRiseHours = difference( storage.to, storage.from );
    storage.toLowerHours = difference( storage.to, storage.from );
    storage.toRiseHours = difference( storage.defaultTo, storage.to );

    return storage;

}

const orderTimestamps = (a: number, b: number) => {
    if (a < b) return [a, b];
    return [b, a];
}

const clampSelectionWithinRange = (
    rangeFrom: number,
    rangeTo: number,
    selectionFrom?: number,
    selectionTo?: number
) => {

    if (selectionFrom === undefined || selectionTo === undefined) {
        return {
            selectionFrom,
            selectionTo
        }
    }

    if (selectionFrom < rangeFrom)
        selectionFrom = rangeFrom;
    if (selectionTo > rangeTo)
        selectionTo = rangeTo;

    return {
        selectionFrom,
        selectionTo
    }

}

// Applying presets
const activatePreset = (
    storage: TimeStorageType,
    action: ActivatePresetAction
): TimeStorageType => {

    const preset = typeof action.payload.preset === "string"
        ? storage.presets[action.payload.preset]
        : action.payload.preset;

    return correct({

        ...storage,

        from: preset.from,
        to: preset.to,

        selectionCursor: undefined,
        ...clampSelectionWithinRange(
            preset.from,
            preset.to,
            storage.selectionFrom,
            storage.selectionTo
        ),

        currentPreset: preset,

    });

}

const reset = (
    storage: TimeStorageType
): TimeStorageType => {
    return activatePreset(storage, {
        type: TimeEvents.ACTIVATE_PRESET,
        payload: {
            preset: storage.presets.WHOLE
        }
    })
}

const setRange = (
    storage: TimeStorageType,
    action: SetRangeAction
): TimeStorageType => {


    const [f, t] = orderTimestamps(action.payload.to, action.payload.from);

    const from = Math.max(TimeRound.down(f, action.payload.roundTo).getTime(), storage.defaultFrom);
    const to = Math.min(TimeRound.up(t, action.payload.roundTo).getTime(), storage.defaultTo);


    return correct({

        ...storage,
        from,
        to,

        selectionCursor: undefined,
        ...clampSelectionWithinRange(
            from,
            to,
            storage.selectionFrom,
            storage.selectionTo
        ),

        currentPreset: undefined

    });

}

const setSelection = (
    storage: TimeStorageType,
    action: SetSelectionAction
): TimeStorageType => {

    const [f, t] = orderTimestamps(action.payload.to, action.payload.from);

    const selectionFrom = Math.max(TimeRound.down(f, action.payload.roundTo).getTime(), storage.defaultFrom);
    const selectionTo = Math.min(TimeRound.up(t, action.payload.roundTo).getTime(), storage.defaultTo);

    const newSelections = clampSelectionWithinRange(
        storage.from,
        storage.to,
        selectionFrom,
        selectionTo
    )

    return correct({

        ...storage,

        selectionCursor: undefined,
        selectionFrom: newSelections.selectionFrom,
        selectionTo: newSelections.selectionTo !== undefined
            ? TimeRound.up( newSelections.selectionTo, TimePeriod.HOUR ).getTime()
            : undefined,
        hasSelection: true,

        currentPreset: undefined

    });

}

const pickRange = (
    storage: TimeStorageType,
    action: RangePickAction
): TimeStorageType => {

    const [from, to] = TimeRound.pick(action.payload.value, action.payload.period);

    const { selectionFrom, selectionTo } = clampSelectionWithinRange(
        from.getTime(),
        to.getTime(),
        storage.selectionFrom,
        storage.selectionTo
    );

    return correct({
        ...storage,

        currentPreset: undefined,

        from: Math.max(from.getTime(), storage.defaultFrom),
        to: Math.min(to.getTime(), storage.defaultTo),

        selectionFrom: selectionFrom,
        selectionTo,
        selectionCursor: undefined
    });

}


const pickSelection = (
    storage: TimeStorageType,
    action: SelectionPickAction
): TimeStorageType => {

    const [pickedFrom, pickedTo] = TimeRound.pick(action.payload.value, action.payload.period);

    const { selectionFrom, selectionTo } = clampSelectionWithinRange(
        storage.from,
        storage.to,
        pickedFrom.getTime(),
        pickedTo.getTime()
    );

    return correct({
        ...storage,

        currentPreset: undefined,

        selectionFrom,
        selectionTo,

        selectionCursor: undefined,
        hasSelection: true,
        isSelecting: false
    });

}

const clearSelection = (
    storage: TimeStorageType
): TimeStorageType => {

    return correct({
        ...storage,
        selectionCursor: undefined,
        selectionFrom: undefined,
        selectionTo: undefined,
        hasSelection: false,
        isSelecting: false
    });

}

const startSelecting = (
    storage: TimeStorageType,
    action: StartSelectionAction
): TimeStorageType => {
    return correct({
        ...storage,
        selectionCursor: action.payload.value,
        isSelecting: true,
        selectionFrom: undefined,
        selectionTo: undefined,
        hasSelection: false
    });
}

const endSelecting = (
    storage: TimeStorageType,
    action: EndSelectionAction
): TimeStorageType => {

    if (storage.selectionCursor === undefined) {
        return storage;
    } else {

        const [from, to] = orderTimestamps(storage.selectionCursor, action.payload.value);

        const { selectionFrom, selectionTo } = clampSelectionWithinRange(
            storage.from,
            storage.to,
            TimeRound.down(from, action.payload.roundTo).getTime(),
            TimeRound.up(to, action.payload.roundTo).getTime()
        );

        const result = {
            ...storage,
            selectionFrom,
            selectionTo: selectionTo !== undefined
                ? TimeRound.up( selectionTo, TimePeriod.HOUR ).getTime()
                : undefined,
            hasSelection: true,
            selectionCursor: undefined,
            isSelecting: false
        };

        return correct(result);


    }

}

const modifyRangeFrom = (
    storage: TimeStorageType,
    action: RangeFromModificationAction
): TimeStorageType => {


    const modifiedDate = TimeRound.modify(storage.from, action.payload.amount, action.payload.period);

    const from = Math.max(modifiedDate.getTime(), storage.defaultFrom);

    return correct({
        ...storage,
        from,
        currentPreset: undefined,
        ...clampSelectionWithinRange(
            from,
            storage.to,
            storage.selectionFrom,
            storage.selectionTo
        )
    });

}

const modifyRangeTo = (
    storage: TimeStorageType,
    action: RangeToModificationAction
): TimeStorageType => {


    const modifiedDate = TimeRound.modify(storage.to, action.payload.amount, action.payload.period);

    const to = Math.min(modifiedDate.getTime(), storage.defaultTo);

    return correct({
        ...storage,
        to,
        currentPreset: undefined,
        ...clampSelectionWithinRange(
            storage.from,
            to,
            storage.selectionFrom,
            storage.selectionTo
        )
    });

}


const modifySelectionFrom = (
    storage: TimeStorageType,
    action: SelectionFromModificationAction
): TimeStorageType => {

    if (storage.selectionFrom === undefined) {
        return storage;
    } else {

        const modifiedDate = TimeRound.modify(storage.selectionFrom, action.payload.amount, action.payload.period);

        const modifiedSelectionFrom = Math.max(modifiedDate.getTime(), storage.defaultFrom);

        return correct({
            ...storage,
            ...clampSelectionWithinRange(
                storage.from,
                storage.to,
                modifiedSelectionFrom,
                storage.selectionTo
            )
        });

    }

}

const modifySelectionTo = (
    storage: TimeStorageType,
    action: SelectionToModificationAction
): TimeStorageType => {

    if (storage.selectionTo === undefined) {
        return storage;
    } else {

        const modifiedDate = TimeRound.modify(storage.selectionTo, action.payload.amount, action.payload.period);

        const modifiedSelectionTo = Math.min(modifiedDate.getTime(), storage.defaultTo);

        return correct({
            ...storage,
            ...clampSelectionWithinRange(
                storage.from,
                storage.to,
                storage.selectionFrom,
                modifiedSelectionTo
            )
        });

    }

}


export const timeReducer: Reducer<TimeStorageType, TimeEventsType> = (
    state,
    action
) => {

    switch (action.type) {

        case TimeEvents.ACTIVATE_PRESET:
            return activatePreset(state, action);

        case TimeEvents.RESET:
            return reset(state);

        case TimeEvents.SET_RANGE:
            return setRange(state, action);

        case TimeEvents.SET_SELECTION:
            return setSelection(state, action);

        case TimeEvents.PICK_RANGE:
            return pickRange(state, action);

        case TimeEvents.PICK_SELECTION:
            return pickSelection(state, action);

        case TimeEvents.CLEAR_SELECTION:
            return clearSelection(state);

        case TimeEvents.START_SELECTING:
            return startSelecting(state, action);

        case TimeEvents.END_SELECTING:
            return endSelecting(state, action);

        case TimeEvents.MODIFY_RANGE_FROM:
            return modifyRangeFrom(state, action);

        case TimeEvents.MODIFY_RANGE_TO:
            return modifyRangeTo(state, action);

        case TimeEvents.MODIFY_SELECTION_FROM:
            return modifySelectionFrom(state, action);

        case TimeEvents.MODIFY_SELECTION_TO:
            return modifySelectionTo(state, action);

        default:
            return state;

    }

}
