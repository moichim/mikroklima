"use client";

import { GoogleScope } from "@/graphql/google/google"
import { AvailableWeatherProperties } from "@/graphql/weather/definitions/properties"
import { useGraphCollection } from "../hooks/useGraphCollection"
import { Toolbar } from "@/modules/graph/components/toolbar/toolbar";
import { TimeSelectionBar } from "@/modules/time/components/timeSelectionBar";
import { useGraphTimeFixed } from "@/modules/graph/hooks/useGraphTime";
import { GraphInstance } from "@/modules/meteo/components/instance/graphInstance";
import { GraphInstanceNew } from "./instance/GraphInstanceNew";
import { useTimeContext } from "@/modules/time/timeContext";

type GraphProps = {
    defaultGraphs: AvailableWeatherProperties[],
    scope: GoogleScope,
    hasZoom?: boolean,
    from: number,
    to: number
}

export const Graph: React.FC<GraphProps> = ( {
    hasZoom = false,
    ...props
} ) => {

    const { state, dispatch } = useGraphTimeFixed( props.from, props.to );

    // const { timeState: state, timeDispatch: dispatch } = useTimeContext();

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