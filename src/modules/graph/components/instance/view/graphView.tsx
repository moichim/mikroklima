"use client";

import { GraphInstanceProps } from "@/modules/meteo/context/useDataContextInternal";
import { useTimeContext } from "@/modules/time/timeContext";
import { stringLabelFromTimestamp } from "@/utils/time";
import { Progress } from "@nextui-org/react";
import { Dispatch, useCallback, useMemo } from "react";
import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useGraphViewDomain } from "./useGraphDomain";
import { useGraphViewInteractions } from "./useGraphViewInteractions";
import { useGraphViewTicks } from "./useGraphViewTicks";
import { TimeEventsType } from "@/modules/time/reducerInternals/actions";
import { TimeStorageType } from "@/modules/time/reducerInternals/storage";

type GraphViewProps = GraphInstanceProps & {
    height: number,
    timeState: TimeStorageType,
    dispatch: Dispatch<TimeEventsType>
}

export const GraphView: React.FC<GraphViewProps> = props => {

    const timeState = props.timeState;

    const domain = useGraphViewDomain(props.state.domain, props.state.domainMin);

    const ticks = useGraphViewTicks(props);

    const {
        onMouseMove,
        onClick,
        cursor,
        isSelectingLocal
    } = useGraphViewInteractions(props.timeState, props.dispatch);


    const formatLabel = useCallback((value: number) => stringLabelFromTimestamp(value), []);

    const formatTooltip = useCallback((value: number, property: any) => value.toFixed(3), []);


    const selectingCursor = useMemo(() => {

        if (timeState.isSelecting) {
            if (timeState.selectionCursor) {
                return <ReferenceLine
                    x={timeState.selectionCursor}
                    stroke="black"
                />
            }
        }

        if (timeState.selectionFrom !== undefined && timeState.selectionTo !== undefined) {
            return <ReferenceArea
                x1={timeState.selectionFrom}
                x2={timeState.selectionTo}
                fill="red"
            />
        }

        return <></>

    }, [timeState.isSelecting, timeState.selectionCursor, timeState.selectionFrom, timeState.selectionTo]);

    if (props.graphData === undefined) {
        return <div className="pl-[100px] pb-4 w-full h-full">
            <div className="flex w-full h-full border-2 border-gray-400 border-dashed items-center justify-center">
                <Progress
                    size="sm"
                    isIndeterminate
                    aria-label="Loading..."
                    className="max-w-md"
                />
            </div>
        </div>
    }

    return <div className="relative w-full">

        <ResponsiveContainer
            width="100%"
            height={props.height}
        >
            <LineChart
                data={props.graphData}
                margin={{ left: 50 }}
                syncId={"syncId"}
                onMouseMove={isSelectingLocal ? onMouseMove : undefined}
                onClick={onClick}

            >

                <CartesianGrid strokeDasharray={"2 2"} />

                {(timeState.selectionFrom !== undefined && timeState.selectionTo !== undefined)
                    && <ReferenceArea
                        x1={timeState.selectionFrom}
                        x2={timeState.selectionTo + 1}
                        fill="white"
                        opacity={1}
                    />
                }


                {(props.graphData && props.graphResourcesMap) && Object.values(props.graphResourcesMap).map(resource => {

                    if (resource.isLine === true) {
                        return <Line
                            key={resource.dataKey}
                            dataKey={resource.dataKey}
                            stroke={resource.color}
                            dot={false}
                            isAnimationActive={false}
                            unit={" " + resource.unit}
                        />
                    } else if (resource.isLine === false) {
                        return <Line
                            key={resource.dataKey}
                            fill={resource.color}
                            dataKey={resource.dataKey}
                            stroke={resource.color}
                            dot={true}
                            isAnimationActive={false}
                            unit={" " + resource.unit}
                            connectNulls
                            name={resource.name}
                        />
                    }

                    return <Line
                            key={resource.dataKey}
                            dataKey={resource.dataKey}
                            stroke={resource.color}
                            fill={resource.color}
                            dot={true}
                            isAnimationActive={false}
                            unit={" " + resource.unit}
                            connectNulls
                            name={resource.name}
                        />

                })}


                <YAxis
                    unit={props.state.property.unit}
                    domain={domain as any}
                />

                <XAxis
                    dataKey="time"
                    tickFormatter={ticks.formatter}
                    ticks={ticks.times}
                />

                <Tooltip
                    labelFormatter={formatLabel}
                    formatter={formatTooltip}

                    isAnimationActive={false}
                    coordinate={{ x: cursor, y: 0 }}
                    cursor={{
                        stroke: timeState.isSelecting ? "rgb(0, 112, 240)" : "black"
                    }}
                />

                {isSelectingLocal &&
                    timeState.selectionCursor !== undefined
                    && <ReferenceArea
                        x1={timeState.selectionCursor}
                        x2={cursor}
                        fill="white"
                    />
                }

                {timeState.selectionCursor && <ReferenceLine x={timeState.selectionCursor} stroke="rgb(0, 112, 240)" />}

            </LineChart>
        </ResponsiveContainer>

    </div>

}