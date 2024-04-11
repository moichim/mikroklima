"use client";

import { GraphInstanceProps } from "@/modules/meteo/context/useDataContextInternal";
import { TimeEventsFactory, TimeEventsType } from "@/modules/time/reducerInternals/actions";
import { TimeStorageType } from "@/modules/time/reducerInternals/storage";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { Dispatch, useMemo } from "react";
import { graphInstanceHeights } from "../../reducerInternals/storage";
import { GraphinstanceSelector } from "./internals/graphInstanceSelector";
import { GraphInstanceSizes } from "./internals/graphInstanceSizes";
import { Statistics } from "./statistics/statistics";
import { GraphView } from "./view/graphView";

type GraphInstanceNewProps = GraphInstanceProps & {
    timeState: TimeStorageType,
    timeDispatch: Dispatch<TimeEventsType>
}

export const GraphInstanceNew: React.FC<GraphInstanceNewProps> = props => {

    const height = useMemo( () => {
        return graphInstanceHeights[ props.state.scale ];
    }, [props.state.scale] );


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
                    timeState={props.timeState}
                    dispatch={props.timeDispatch}
                />
            </div>

            <div className="w-full lg:w-1/3 md:pl-4">
                {props.timeState.hasSelection === true
                    ? <Statistics
                        data={props.selectionStats}
                        label={`${props.state.property.name} ve vyznačeném rozmezí`}
                        loading={props.selectionStatsLoading}
                        onClose={() => {
                            props.timeDispatch( TimeEventsFactory.clearSelection() );
                        }}
                    />
                    : <Statistics
                        data={props.viewStats}
                        label={`${props.state.property.name} v oddobí ${TimeFormat.humanRangeDates(props.timeState.from, props.timeState.to)}`}
                        loading={props.viewStatsLoading}
                    />
                }

            </div>

        </div>

    </div>

}