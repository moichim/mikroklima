"use client";

import { useThermalObjectPurpose } from "@/modules/thermal/context/useThermalObjectPurpose";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useThermalRegistryPaletteDrive } from "@/thermal/registry/properties/drives/palette/useThermalRegistryPaletteDrive";
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, cn } from "@nextui-org/react";

type PaletteControlProps = {
    registry: ThermalRegistry
}

export const PaletteDropdown: React.FC<PaletteControlProps> = ({
    registry,
    ...props
}) => {

    const ID = useThermalObjectPurpose( registry, "paletteDropdown" );

    const palette = useThermalRegistryPaletteDrive(registry, ID);

    const { value: loading } = useThermalRegistryLoadingState(registry, ID);

    const { value: minmax } = useThermalRegistryMinmaxState(registry, ID);

    if (loading === true || minmax === undefined) {
        return <div
            className={cn("border-2 border-gray-300 border-dashed p-3 rounded-xl text-primary-500 gap-4 flex")}
        >
            <Spinner size="sm" />
            <span>Barevné palety</span>
        </div>
    }

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