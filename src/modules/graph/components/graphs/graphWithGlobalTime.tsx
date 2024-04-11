"use client";

import { AvailableWeatherProperties } from "@/graphql/weather/definitions/properties"
import { GraphCommonProps, GraphInternal } from "./GraphInternal"
import { useTimeContext } from "@/modules/time/timeContext"

type GraphWithGlobalTimeProps = GraphCommonProps

export const GraphWithGlobalTime: React.FC<GraphWithGlobalTimeProps> = props => {

    const context = useTimeContext();

    return <GraphInternal 
        {...props}
        state={context.timeState}
        dispatch={context.timeDispatch}
    />

}