"use client";

import { graphInstanceHeights } from "@/state/graph/reducerInternals/storage";
import { GraphInstanceProps } from "../../context/useDataContextInternal";
import { GraphinstanceSelector } from "./inner/graphInstanceSelector";
import { GraphInstanceSizes } from "./inner/graphInstanceSizes";
import { useMemo } from "react";
import { Statistics } from "./inner/statistics";
import { GraphView } from "./inner/view/graphView";
import { TimeFormat } from "@/state/time/reducerInternals/timeUtils/formatting";
import { useTimeContext } from "@/state/time/timeContext";
import { TimeEventsFactory } from "@/state/time/reducerInternals/actions";

export const GraphInstance: React.FC<GraphInstanceProps> = props => {

    const height = useMemo(() => graphInstanceHeights[props.state.scale], [props.state.scale]);

    const { timeState, timeDispatch } = useTimeContext();

    return <div
        className="w-full pb-4"
    >

        <div className="flex flex-wrap w-full" style={{ minHeight: `${height}px` }}>

            <div className="w-full md:w-1/3 lg:w-1/6 flex flex-wrap flex-col gap-4 justify-cener items-center md:items-end md:pr-4">

                <GraphinstanceSelector
                    setter={props.setProperty}
                    property={props.state.property}
                    availableProperties={props.availableProperties}
                    loading={props.loadingData}
                />

                <GraphInstanceSizes
                    setter={props.setHeight}
                    height={props.state.scale}
                    loading={props.loadingData}
                />

            </div>

            <div className="w-full lg:w-3/6">
                <GraphView
                    {...props}
                    height={height}
                />
            </div>

            <div className="w-full lg:w-1/3 md:pl-4">
                {timeState.hasSelection === true
                    ? <Statistics
                        data={props.selectionStats}
                        label={`${props.state.property.name} ve vyznačeném rozmezí`}
                        loading={props.selectionStatsLoading}
                        onClose={() => {
                            timeDispatch( TimeEventsFactory.clearSelection() );
                        }}
                    />
                    : <Statistics
                        data={props.viewStats}
                        label={`${props.state.property.name} v oddobí ${TimeFormat.humanRangeDates(timeState.from, timeState.to)}`}
                        loading={props.viewStatsLoading}
                    />
                }

            </div>

        </div>

    </div>

}