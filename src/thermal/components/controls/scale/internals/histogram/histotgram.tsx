import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry"
import { useThermalRegistryHistogramState } from "@/thermal/registry/properties/states/histogram/useThermalRegistryHistogramState"
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState"
import { Spinner, cn } from "@nextui-org/react"
import { HistogramSlot } from "./histogramSlot"
import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose"

export type HistogramPropsBase = {
    hasBorder?: boolean
}

type HistogramProps = HistogramPropsBase & {
    registry: ThermalRegistry
}


export const Histogram: React.FC<HistogramProps> = ({
    hasBorder = true,
    ...props
}) => {

    const ID = useThermalObjectPurpose( props.registry, "histogramComponent" );

    const { value: histogram } = useThermalRegistryHistogramState(props.registry, ID );

    const { value: loading } = useThermalRegistryLoadingState(props.registry, ID );

    return <div
        className={cn(
            hasBorder && "border-1 border-solid border-gray-300",
            "relative w-full h-full"
        )}
    >

        {histogram === undefined && <div
            className="flex gap-4 h-full items-center justify-center text-primary"
        >
            <Spinner size="sm" />
            <span>Zpracovávám histogram</span>
        </div>}

        {histogram !== undefined && histogram.map( ( slot, index ) => {

            return <HistogramSlot 
                key={`histogram_${ID}_slog-${index}`}
                temperatureFrom={slot.from}
                temperatureTo={slot.to}
                temperaturePrecision={2}
                resolution={histogram.length}
                height={slot.height}
                percentage={slot.percentage}
                index={index}
                hasBorder={hasBorder}
            />

        } )}

    </div>

}