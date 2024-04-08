"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { TimeEventsFactory } from "../reducerInternals/actions";
import { useTimeContext } from "../timeContext";

export const PresetDropdown: React.FC = () => {

    const { timeState, timeDispatch } = useTimeContext();

    let buttonLabel = "Zvolte období";

    if (timeState.currentPreset !== undefined) {
        buttonLabel = timeState.currentPreset.name;
    }


    return <Dropdown
        backdrop="blur"
    >

        <DropdownTrigger>
            <Button
                variant="bordered"
                className="bg-white hover:border-primary"
            >{buttonLabel} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
            </Button>
        </DropdownTrigger>
        <DropdownMenu
            onAction={key => {

                timeDispatch(TimeEventsFactory.activatePreset(key as string));

            }}
        >
            {Object.entries(timeState.presets).map(([key, preset]) => <DropdownItem key={key}>{preset.name}</DropdownItem>)}
        </DropdownMenu>

    </Dropdown>


}