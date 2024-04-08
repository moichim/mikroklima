"use client";

import { Button, Tooltip } from "@nextui-org/react";
import { TimeFormat } from "../reducerInternals/timeUtils/formatting";
import { useTimeContext } from "../timeContext";
import { CloseIcon, ZoomInIcon } from "@/components/ui/icons";
import { TimeEventsFactory, TimePeriod } from "../reducerInternals/actions";
import { formatDuration, intervalToDuration } from "date-fns";

type SelectionBarProps = {
    hasZoom?: boolean
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
    hasZoom = true,
    ...props
}) => {

    const { timeState: state, timeDispatch: dispatch } = useTimeContext();

    if (state.hasSelection === false) {
        return <></>
    }

    return <div className="fixed w-0 left-1/2 bottom-4 h-40">
        <div className="w-[30rem] mx-auto absolute bottom-0 -left-[15rem] rounded-2xl p-4 border-2 border-gray-400 border-solid bg-foreground text-background backdrop-opacity-80">
            <div className="flex w-full gap-2">
                <div className="flex-grow">
                    <h2 className="text-sm opacity-50 pb-2">Vyznačené rozmezí</h2>
                    <div className="flex gap-3 pb-1">

                        <span>{TimeFormat.humanDate(state.selectionFrom!)} <sup className="opacity-90">{TimeFormat.humanTime(state.selectionFrom!)}</sup></span>
                        <span>—</span>
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