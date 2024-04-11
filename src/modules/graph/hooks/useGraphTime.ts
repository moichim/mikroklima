import { TimeEventsType } from "@/modules/time/reducerInternals/actions";
import { timeReducer } from "@/modules/time/reducerInternals/reducer";
import { TimeStorageType, getDefaultsFromScope, timeStorageDefaults } from "@/modules/time/reducerInternals/storage";
import { useTimeContextInternal } from "@/modules/time/reducerInternals/useTimeContextInternal";
import { useTimeContext } from "@/modules/time/timeContext";
import { Dispatch, useReducer, useState } from "react";

type UseGraphTimeType = {
    state: TimeStorageType,
    dispatch: Dispatch<TimeEventsType>
}

export const useGraphTimeGlobal = (): UseGraphTimeType => {

    const {timeState, timeDispatch} = useTimeContext();
    return {
        state: timeState,
        dispatch: timeDispatch
    }

}

export const useGraphTimeFixed = (
    from: number,
    to: number
): UseGraphTimeType => {


    const [timeState, timeDispatch] = useReducer(
        timeReducer,
        {
            ...timeStorageDefaults,
            from,
            to,
            defaultFrom: from,
            defaultTo: to
        } as TimeStorageType
    );

    return {
        state: timeState,
        dispatch: timeDispatch
    }

}