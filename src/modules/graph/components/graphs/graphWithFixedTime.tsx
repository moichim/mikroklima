"use client";

import { AvailableWeatherProperties } from "@/graphql/weather/definitions/properties"
import { GraphCommonProps, GraphInternal } from "./GraphInternal"
import { useTimeContext } from "@/modules/time/timeContext"
import { useGraphTimeFixed } from "../../hooks/useGraphTime"

type GraphWithGlobalTimeProps = GraphCommonProps & {
    from: number,
    to: number
}

export const GraphWithFixedTime: React.FC<GraphWithGlobalTimeProps> = ({
    from,
    to,
    ...props
}) => {

    const context = useGraphTimeFixed( to, from );

    return <GraphInternal 
        {...props}
        state={context.state}
        dispatch={context.dispatch}
    />

}