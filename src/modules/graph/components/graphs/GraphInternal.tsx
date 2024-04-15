"use client";

import { GoogleScope } from "@/graphql/google/google";
import { AvailableWeatherProperties } from "@/graphql/weather/definitions/properties";
import { Toolbar } from "@/modules/graph/components/toolbar/toolbar";
import { TimeSelectionBar } from "@/modules/time/components/timeSelectionBar";
import { TimeEventsType } from "@/modules/time/reducerInternals/actions";
import { TimeStorageType } from "@/modules/time/reducerInternals/storage";
import { Dispatch } from "react";
import { useGraphCollection } from "../../hooks/useGraphCollection";
import { GraphInstanceNew } from "../instance/GraphInstanceNew";

export type GraphCommonProps = {
    defaultGraphs: AvailableWeatherProperties[],
    hasZoom?: boolean,
    scope: GoogleScope,
}

type GraphProps = GraphCommonProps & {
    state: TimeStorageType,
    dispatch: Dispatch<TimeEventsType>
}

export const GraphInternal: React.FC<GraphProps> = ( {
    state,
    dispatch,
    hasZoom = false,
    ...props
} ) => {

    // const { state, dispatch } = useGraphTimeFixed( props.from, props.to );

    const collection = useGraphCollection(
        props.defaultGraphs,
        props.scope,
        hasZoom,
        state,
        dispatch
    );

    return <div className="relative">
        
        <div className="pl-4 pt-4 fixed bottom-4" style={{ width: "4rem" }}>
            <Toolbar hasZoom={hasZoom}/>
        </div>

        <div className=" top-0 w-full pt-4">
            {
                collection.instances.map(instance => {
                    return <GraphInstanceNew
                        {...instance}
                        key={instance.state.property.slug}
                        timeState={state}
                        timeDispatch={dispatch}
                    />
                })}
        </div>

        <TimeSelectionBar 
            hasZoom={hasZoom} 
            state={state} 
            dispatch={dispatch} 
        />

    </div>

}