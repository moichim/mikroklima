import { GraphTools } from "@/state/graph/data/tools";
import { useGraphContext } from "@/state/graph/graphContext";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { TimeEventsFactory, TimePeriod } from "@/state/time/reducerInternals/actions";
import { useTimeContext } from "@/state/time/timeContext";
import { useCallback, useEffect, useState } from "react";
import { ReferenceArea, ReferenceLine } from "recharts";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";

export const useGraphViewInteractions = () => {

    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [isSelectingLocal, setIsSelectingLocal] = useState<boolean>(false);
    const [cursor, setCursor] = useState<number>();

    const { timeState, timeDispatch } = useTimeContext();
    const { graphState, graphDispatch } = useGraphContext();


    /**
     * Make sure that the cursor is empty 
     * everytime the local selecting is off
     */
    useEffect(() => {
        if (isSelectingLocal === false && cursor !== undefined)
            setCursor(undefined);
    }, [isSelectingLocal, cursor]);

    /**
     * On mouse move handler
     */
    const onMouseMove: CategoricalChartFunc = useCallback(event => {

        // If the cursor is in the graf
        if (event.activeLabel !== undefined) {
            if (!isHovering)
                setIsHovering(true);
            setCursor(parseInt(event.activeLabel));
        }
        // If the cursor is not in the graph
        else {
            // Turn hovering off
            if (isHovering) setIsHovering(false)
            // If is selecting, clear the celection
            if (timeState.isSelecting === true)
                timeDispatch(TimeEventsFactory.clearSelection())
            // Clear local selection props
            if (isSelectingLocal) {
                setIsSelectingLocal(false);
                setCursor(undefined);
                timeDispatch(TimeEventsFactory.clearSelection())
            }

        }

    }, [isHovering, timeState.isSelecting, isSelectingLocal, timeDispatch]);



    /**
     * On click handler
     */
    const onClick: CategoricalChartFunc = useCallback(event => {

        // Make sure the mouse is inside the graph
        if (event.activeLabel === undefined)
            return;
        else {

            const cursorValue = parseInt(event.activeLabel);

            // If inspecting, do nothing
            if (graphState.activeTool === GraphTools.INSPECT)
                return;

            // If selecting or zooming, manipulate the selection
            if (
                graphState.activeTool === GraphTools.SELECT
                || graphState.activeTool === GraphTools.ZOOM
            ) {

                // If the selection has not started yet, do start it now
                if (isSelectingLocal === false) {

                    // Send the cursor to the global context
                    timeDispatch(TimeEventsFactory.startSelection(cursorValue, TimePeriod.HOUR));

                    // Indicate the cursor locally
                    setCursor(cursorValue);
                    setIsSelectingLocal(true);

                }

                // If the selection has already started, finish it now
                else {

                    // Set the selection globally
                    timeDispatch(TimeEventsFactory.endSelection(cursorValue, TimePeriod.HOUR));

                    // Indicate the local state
                    setIsSelectingLocal(false);

                    // If is zooming, do set the range rounded to days
                    if (graphState.activeTool === GraphTools.ZOOM && timeState.selectionCursor) {

                        // Set the selection globally
                        timeDispatch(TimeEventsFactory.setRange(timeState.selectionCursor, cursorValue, TimePeriod.DAY));

                        // Activate the inspection tool
                        graphDispatch(StackActions.selectTool(GraphTools.INSPECT));

                    }


                }

            }

        }



    }, [graphState.activeTool, timeState.selectionCursor, isSelectingLocal, timeDispatch, graphDispatch]);


    return {
        isHovering,
        isSelectingLocal,
        cursor,
        onMouseMove,
        onClick
    }

}