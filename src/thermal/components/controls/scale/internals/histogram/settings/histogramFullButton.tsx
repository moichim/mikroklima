import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose"
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry"
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState"
import { Button, ButtonProps, Tooltip } from "@nextui-org/react"

type HistogramAutoButton = ButtonProps & {
    registry: ThermalRegistry
}

export const HistogramFullButton: React.FC<HistogramAutoButton> = ({
    registry,
    ...props
}) => {

    const ID = useThermalObjectPurpose( registry, "fullButton" );


    const { value: minmax } = useThermalRegistryMinmaxState( registry, ID );

    return <Tooltip
        content={`Roztáhnout barevnou paletu na celý teplotní rozsah`}
        isDisabled={minmax === undefined}
        color="foreground"
        showArrow
    >
        <Button
            {...props}
            isIconOnly
            onClick={() => {

                if (minmax !== undefined) {
                    registry.range.imposeRange({ from: minmax.min, to: minmax.max });
                }

            }}

        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
        </Button>
    </Tooltip>

}