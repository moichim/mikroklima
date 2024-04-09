"use client";

import { GoogleScope } from "@/graphql/google/google";
import { createContext, useContext } from "react";
import { getContextDefaults, useScopeInternal } from "./useScopeInternal";

const def = getContextDefaults();

const ScopeContext = createContext(def);

type ScopeContextProviderProps = React.PropsWithChildren & {
    activeScope: GoogleScope,
    allScopes: GoogleScope[]
}

export const ScopeContextProvider: React.FC<ScopeContextProviderProps> = props => {

    const value = useScopeInternal( props.activeScope, props.allScopes );

    return <ScopeContext.Provider value={value}>
        {props.children}
    </ScopeContext.Provider>

}

export const useScopeContext = () => {

    return useContext( ScopeContext );

}