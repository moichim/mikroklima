"use client"

import { createContext, useContext } from "react";
import { GraphStateFactory } from "./reducerInternals/storage"
import { UseGraphStackValues, useGraphInternal } from "./useGraphInternal"

type GraphContextType = UseGraphStackValues


const initialData: GraphContextType = {
    graphState: GraphStateFactory.defaultState(),
    graphDispatch: () => { }
};

const GraphContext = createContext(initialData);

export const GraphContextProvider: React.FC<React.PropsWithChildren> = props => {

    const value = useGraphInternal();

    return <GraphContext.Provider value={value}>
        {props.children}
    </GraphContext.Provider>

}

/** Use graph display settings stored  in global context. */
export const useGraphContext = () => {
    return useContext(GraphContext);
}