"use client";

import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useThermalRegistryPaletteDrive } from "@/thermal/registry/properties/drives/palette/useThermalRegistryPaletteDrive";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownProps, DropdownTrigger, cn } from "@nextui-org/react";
import { useMemo } from "react";

type PaletteControlProps = {
    registry: ThermalRegistry
}

export const PaletteDropdown: React.FC<PaletteControlProps> = ({
    registry,
    ...props
}) => {

    const ID = useThermalObjectPurpose( registry, "paletteDropdown" );

    const palette = useThermalRegistryPaletteDrive(registry, ID);

    return <Dropdown
        {...props}
        aria-label="Volba barevné palety"
    >
        <DropdownTrigger
        >
            <Button >
                <div className="flex gap-2 items-center">

                    <div className={cn(
                        `thermal-scale-${palette.value}`,
                        "w-10 h-4 rounded-xl"
                    )}></div>
                    <div className="text-sm flex-grow">{palette.palette.name}</div>


                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                </div>
            </Button>
        </DropdownTrigger>
        <DropdownMenu
            onAction={key => {

                console.log(key);

                palette.set(key)

            }}
        >
            {Object.entries(palette.availablePalettes).map(([key, palette]) => {
                return <DropdownItem
                    key={key}
                    textValue={`Nastavit barevnou baletu ${palette.name}`}
                    aria-label={palette.name}
                >
                    <div>
                        <div className="text-sm text-gray-500 pb-2">{palette.name}</div>
                        <div className={cn(
                            `thermal-scale-${key}`,
                            "w-full h-4 rounded-xl"
                        )}></div>
                    </div>
                </DropdownItem>
            })}
        </DropdownMenu>
    </Dropdown>

}