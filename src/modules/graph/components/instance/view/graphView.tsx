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
import { GraphDataType } from "@/modules/data/graphql/dataMapping";
import { TimeFormat } from "@/utils/timeUtils/formatting";

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


    console.log("obrázky", props.images);


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

                {props.images && Object.entries(props.images).map(([time, entries]) => {

                    return <ReferenceLine
                        x={parseInt(time)}
                        stroke="rgb(0, 112, 240)"
                        key={time}
                    />

                })}



                {(timeState.selectionFrom !== undefined && timeState.selectionTo !== undefined)
                    && <ReferenceArea
                        x1={timeState.selectionFrom}
                        x2={timeState.selectionTo + 1}
                        fill="white"
                        opacity={1}
                    />
                }


                {(props.graphData && props.graphResourcesMap) && Object.values(props.graphResourcesMap).map(resource => {

                    if (resource.type === GraphDataType.LINE) {
                        return <Line
                            key={resource.dataKey}
                            dataKey={resource.dataKey}
                            stroke={resource.color}
                            dot={false}
                            isAnimationActive={false}
                            unit={" " + resource.unit}
                        />
                    } else if (resource.type === GraphDataType.DOT) {
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
                        stroke: timeState.isSelecting ? "black" : "black"
                    }}

                    content={({ active, payload, label }) => {

                        const images = props.images
                            ? props.images[label] !== undefined
                                ? props.images[label]
                                : undefined
                            : undefined;

                        return <div className="bg-white border-1 border-solid border-gray-300 px-2 py-2 z-100 text-sm">
                            <div className="pb-2 font-bold">{label && TimeFormat.human(parseInt(label))}</div>
                            <div className="">
                                {payload?.map(row => <div key={row.name}>
                                    <div style={{ color: row.color }} className="pb-1">{row.value} {row.unit} - {row.name}</div>
                                </div>)}
                            </div>

                            {images !== undefined && <div className="pt-3 text-primary-400">
                                <div>Termogramy:</div>
                                <ul className="list-disc ps-4">
                                    {Object.entries(images).map(([name, time]) => {

                                        return <li key={time}>
                                            <span className="text-black">{name}</span> <span>
                                                {TimeFormat.humanTime(time)}
                                            </span>
                                        </li>

                                    })}
                                </ul>
                            </div>}
                        </div>
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