"use client";

import { Button, Tooltip } from "@nextui-org/react";
import { TimeFormat } from "../../../utils/timeUtils/formatting";
import { useTimeContext } from "../timeContext";
import { CloseIcon, ZoomInIcon } from "@/components/ui/icons";
import { TimeEventsFactory, TimeEventsType, TimePeriod } from "../reducerInternals/actions";
import { formatDuration, intervalToDuration } from "date-fns";
import { TimeStorageType } from "../reducerInternals/storage";
import { Dispatch } from "react";

type SelectionBarProps = {
    hasZoom?: boolean,
    state: TimeStorageType,
    dispatch: Dispatch<TimeEventsType>
}

export const TimeSelectionBar: React.FC<SelectionBarProps> = ({
    hasZoom = true,
    ...props
}) => {

    const state = props.state;
    const dispatch = props.dispatch;

    if (state.hasSelection === false) {
        return <></>
    }

    return <div className="fixed w-0 left-1/2 bottom-4 h-40 z-40">
        <div className="w-[16rem] md:w-[20rem] lg:w-[30rem] mx-auto absolute bottom-0 -left-[8rem] md:-left-[10rem] lg:-left-[15rem] rounded-2xl p-4 border-2 border-gray-400 border-solid bg-foreground text-background backdrop-opacity-80">
            <div className="flex w-full gap-2">
                <div className="flex-grow">
                    <h2 className="text-sm opacity-50 pb-2">Vyznačené rozmezí</h2>
                    <div className="flex gap-3 pb-1 flex-wrap">

                        <span className="w-full lg:w-auto">{TimeFormat.humanDate(state.selectionFrom!)} <sup className="opacity-90">{TimeFormat.humanTime(state.selectionFrom!)}</sup></span>
                        <span className="hidden md:block">—</span>
                        <span>{TimeFormat.humanDate(state.selectionTo!)} <sup className="opacity-80">{TimeFormat.humanTime(state.selectionTo!)}</sup></span>

                    </div>
                </div>

                {hasZoom && <Tooltip
                    content="Přiblížit na vyznačenou oblast"
                >
                    <Button
                        onClick={() => dispatch(TimeEventsFactory.setRange(state.selectionFrom!, state.selectionTo!, TimePeriod.DAY))}
                        isIconOnly
                    >
                        <ZoomInIcon />
                    </Button>
                </Tooltip>}


                <Tooltip
                    content="Zrušit výběr"
                >
                    <Button
                        onClick={() => dispatch(TimeEventsFactory.clearSelection())}
                        isIconOnly
                    >
                        <CloseIcon />
                    </Button>
                </Tooltip>

            </div>

            <p className="text-sm opacity-50">{formatDuration(
                intervalToDuration({ start: state.selectionFrom!, end: state.selectionTo! })
            )}</p>

        </div>
    </div>

}