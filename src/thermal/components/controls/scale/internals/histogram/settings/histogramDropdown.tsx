import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry"
import { useHistogramAutoValue } from "./useHistogramAuto"
import { useThermalRegistryHistogramState } from "@/thermal/registry/properties/states/histogram/useThermalRegistryHistogramState"
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState"
import { SettingIcon } from "@/components/ui/icons"
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react"
import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose"

type HistogramDropdownButton = {
    registry: ThermalRegistry,
    minHeight?: number
}

export const HistogramDropdown: React.FC<HistogramDropdownButton> = ({
    registry,
    minHeight = 3,
    ...props
}) => {

    const ID = useThermalObjectPurpose( registry, "histogramDropdown" );

    const { value: minmax } = useThermalRegistryMinmaxState(registry, "HistogramAutoButton");

    const { value: histogram } = useThermalRegistryHistogramState(registry, "HistogramAutoButton");

    const value = useHistogramAutoValue(histogram, minmax, minHeight);

    return <Dropdown>
        <DropdownTrigger>
            <Button
                isIconOnly
            >
                <SettingIcon />
            </Button>
        </DropdownTrigger>
        <DropdownMenu
            onAction={key => {

                if (key === "all") {
                    if (minmax)
                        registry.range.imposeRange({ from: minmax.min, to: minmax.max });
                } else if (key === "auto") {

                    registry.range.imposeRange(value);

                }
            }}
        >
            <DropdownItem
                key="all"
                className="bg-gray-200"
            >
                <div className="flex w-full items-center gap-4">
                    <div className="rotate-90 text-white bg-primary rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                        </svg>
                    </div>
                    <div>
                        <div className="font-bold">Celý teplotní rozsah</div>
                        <div className="text-sm text-gray-500">Roztáhnout barevnou paletu na celkový teplotní rozsah.</div>
                    </div>
                </div>
            </DropdownItem>
            <DropdownItem
                key="auto"
                className="bg-gray-200"
            >

                <div className="flex w-full items-center gap-4">
                    <div className="text-white bg-primary rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                        </svg>
                    </div>
                    <div>
                        <div className="font-bold">Automaticky</div>
                        <div className="text-sm text-gray-500">Nastavit barevnou paletu na oblast, v níže je nejvíce teplot.</div>
                    </div>
                </div>

            </DropdownItem>
        </DropdownMenu>
    </Dropdown>

}