"use client";

import { GoogleScope } from "@/graphql/google/google";
import { AvailableWeatherProperties } from "@/graphql/weather/definitions/properties";
import { ToolsToolbar } from "@/modules/graph/components/toolbar/toolbar";
import { TimeSelectionBar } from "@/modules/time/components/timeSelectionBar";
import { TimeEventsType } from "@/modules/time/reducerInternals/actions";
import { TimeStorageType } from "@/modules/time/reducerInternals/storage";
import { Button, Tooltip } from "@nextui-org/react";
import { Dispatch } from "react";
import { useGraphCollection } from "../../hooks/useGraphCollection";
import { GraphInstanceNew } from "../instance/GraphInstanceNew";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { ExportButton } from "../../export/ExportButton";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { TemperatureHighlightType } from "@/modules/thermal/components/views/group/groupController";

export type GraphCommonProps = {
    defaultGraphs: AvailableWeatherProperties[],
    hasZoom?: boolean,
    scope: GoogleScope,
    temperatureHighlight?: TemperatureHighlightType
}

type GraphProps = GraphCommonProps & {
    state: TimeStorageType,
    dispatch: Dispatch<TimeEventsType>
}

export const GraphInternal: React.FC<GraphProps> = ({
    state,
    dispatch,
    hasZoom = false,
    temperatureHighlight,
    ...props
}) => {

    const collection = useGraphCollection(
        props.defaultGraphs,
        props.scope,
        hasZoom,
        state,
        dispatch,
        temperatureHighlight
    );

    return <div className="relative">

        <div className="pl-4 pt-4 fixed bottom-4 z-40" style={{ width: "4rem" }}>
            <ToolsToolbar hasZoom={hasZoom}>

                <Tooltip content="Stáhnout meteorologická data jako XLS"><ExportButton data={collection.graphData.data} getFileName={ () => `data_${props.scope.name}_${TimeFormat.human( state.from )}-${ TimeFormat.human( state.to )}` }/></Tooltip>

            </ToolsToolbar>
        </div>

        <div className=" top-0 w-full pt-4">
            {
                collection.instances.map(instance => {
                    return <GraphInstanceNew
                        {...instance}
                        key={instance.state.property.slug}
                        timeState={state}
                        timeDispatch={dispatch}
                        temperatureHighlight={temperatureHighlight}
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