"use client";

import { TimeEventsFactory } from "../../reducerInternals/actions";
import { TimeFormat } from "../../../../utils/timeUtils/formatting";
import { useTimeContext } from "../../timeContext";
import { TimeButtonArrow } from "./timeButtonArrow";

export const TimeFromControl: React.FC = () => {

    const { timeState, timeDispatch } = useTimeContext();

    return <div
        className="flex group items-stretch content-stretch"
    >
        <TimeButtonArrow
            direction="left"
            onDo={(period) => timeDispatch(TimeEventsFactory.modifyRangeFrom(-1, period))}
            availableTimeInHours={timeState.fromLowerHours}
        />


        <div className="py-1 px-3 text-center bg-background text-foreground border-2 border-s-0 border-r-0 border-gray-300 group-hover:border-primary-300 h-14 min-w-[8rem]">
            <div className="">{TimeFormat.humanDate(timeState.from)}</div>
            <div className="text-xs w-full flex justify-between">
                <span className="group-hover:text-primary-500 opacity-50 group-hover:opacity-100">OD</span>
                <span>{TimeFormat.humanTime(timeState.from)}</span>
            </div>
        </div>

        <TimeButtonArrow
            direction="right"
            onDo={(period) => timeDispatch(TimeEventsFactory.modifyRangeFrom(1, period))}
            availableTimeInHours={timeState.fromRiseHours}
        />

    </div>

}