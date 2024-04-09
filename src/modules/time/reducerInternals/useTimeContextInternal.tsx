"use client";

import { GoogleScope } from "@/graphql/google/google";
import { useReducer } from "react";
import { timeReducer } from "./reducer";
import { getDefaultsFromScope, timeStorageDefaults } from "./storage";

/** Internal hook using the reducer. Needs to be used only in the `TimeContext` */
export const useTimeContextInternal = (
    scope: GoogleScope
) => {

    const [timeState, timeDispatch] = useReducer(
        timeReducer,
        getDefaultsFromScope(scope)
    );

    return {
        timeState,
        timeDispatch
    }

}

type UseTimeContextInternalType = ReturnType<typeof useTimeContextInternal>;

export const useTimeContextInternalDefaults: UseTimeContextInternalType = {
    timeState: timeStorageDefaults,
    timeDispatch: () => { }
}