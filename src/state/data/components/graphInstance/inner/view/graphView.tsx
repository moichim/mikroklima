"use client";

import { GraphInstanceProps } from "@/state/data/context/useDataContextInternal";
import { useTimeContext } from "@/state/time/timeContext";
import { stringLabelFromTimestamp } from "@/utils/time";
import { Progress } from "@nextui-org/react";
import { useCallback, useMemo } from "react";
import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useGraphViewDomain } from "./useGraphDomain";
import { useGraphViewInteractions } from "./useGraphViewInteractions";
import { useGraphViewTicks } from "./useGraphViewTicks";

type GraphViewProps = GraphInstanceProps & {
    height: number
}

export const GraphView: React.FC<GraphViewProps> = props => {

    const { timeState } = useTimeContext();

    const domain = useGraphViewDomain(props.state.domain, props.state.domainMin);

    const ticks = useGraphViewTicks(props);

    const {
        onMouseMove,
        onClick,
        cursor,
        isSelectingLocal
    } = useGraphViewInteractions();


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
                data={props.graphData.data}
                margin={{ left: 50 }}
                syncId={"syncId"}
                onMouseMove={ isSelectingLocal ? onMouseMove : undefined}
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


                {props.graphData && props.graphData.lines.map(source => {

                    return <Line
                        key={source.slug}
                        dataKey={source.slug}
                        dot={false}
                        unit={" " + props.state.property.unit ?? ""}
                        stroke={source.stroke}
                        isAnimationActive={false}
                        name={source.name}
                    />

                })}

                {props.graphData && props.graphData.dots.map(dot => {
                    return <Line
                        key={dot.slug}
                        fill={dot.color}
                        stroke={dot.color}
                        dataKey={dot.slug}
                        isAnimationActive={false}
                        unit={dot.in.unit ?? ""}
                        connectNulls={true}
                        name={dot.name}
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