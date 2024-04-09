"use client";

import { createContext, useContext } from "react";
import { useThermalManagerInternal } from "./useThermalManagerInternal";
import { ThermalManager } from "../registry/ThermalManager";

const ThermalManagerContext = createContext<ReturnType<typeof useThermalManagerInternal>>( new ThermalManager );

export const ThermalManagerContextProvider: React.FC<React.PropsWithChildren> = props => {

    const value = useThermalManagerInternal();

    return <ThermalManagerContext.Provider value={value}>
        {props.children}
    </ThermalManagerContext.Provider>

}

export const useThermalManagerContext = () => {
    return useContext( ThermalManagerContext );
}