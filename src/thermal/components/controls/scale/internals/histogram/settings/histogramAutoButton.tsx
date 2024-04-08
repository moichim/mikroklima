import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry"
import { useThermalRegistryHistogramState } from "@/thermal/registry/properties/states/histogram/useThermalRegistryHistogramState"
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState"
import { Button, ButtonProps, Tooltip } from "@nextui-org/react"
import { useHistogramAutoValue } from "./useHistogramAuto"
import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose"

type HistogramAutoButton = ButtonProps & {
    registry: ThermalRegistry,
    minHeight?: number
}

export const HistogramAutoButton: React.FC<HistogramAutoButton> = ({
    registry,
    minHeight = 3,
    ...props
}) => {

    const ID = useThermalObjectPurpose( registry, "autoButton" );

    const { value: minmax } = useThermalRegistryMinmaxState(registry, ID);

    const { value: histogram } = useThermalRegistryHistogramState(registry, ID );

    const value = useHistogramAutoValue(histogram, minmax, minHeight);

    return <Tooltip
        content={`Nastavit barevnou paletu na oblast, v níž je nejvíce teplot (od ${value?.from.toFixed(2)} do ${value?.to.toFixed(2)} stupňů) `}
        isDisabled={value === undefined}
        color="foreground"
        showArrow
    >
        <Button
            {...props}
            isIconOnly
            onClick={() => {

                if (value !== undefined) {
                    registry.range.imposeRange(value);
                }

            }}

        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
            </svg>
        </Button>
    </Tooltip>

}