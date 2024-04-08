"use client";

import { GoogleScope } from "@/graphql/google/google";
import { createContext, useContext } from "react";
import { useTimeContextInternal, useTimeContextInternalDefaults } from "./reducerInternals/useTimeContextInternal";

const TimeContext = createContext(useTimeContextInternalDefaults);

type TimeContextProviderProps = React.PropsWithChildren & {
    scope: GoogleScope
}

export const TimeContextProvider: React.FC<TimeContextProviderProps> = (props) => {

    const reducer = useTimeContextInternal(props.scope);

    return <TimeContext.Provider value={reducer}>
        {props.children}
    </TimeContext.Provider>
}

export const useTimeContext = () => {
    return useContext(TimeContext);
}