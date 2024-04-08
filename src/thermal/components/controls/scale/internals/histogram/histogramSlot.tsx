import { Tooltip, cn } from "@nextui-org/react"
import { useMemo } from "react"

type HistogramSlotProps = {
    temperatureFrom: number,
    temperatureTo: number,
    temperaturePrecision: number,
    percentage: number,
    percentagePrecision?: number,
    height: number,
    resolution: number,
    index: number,
    hasBorder?: boolean
}

export const HistogramSlot: React.FC<HistogramSlotProps> = ({
    percentagePrecision = 3,
    temperaturePrecision = 2,
    hasBorder = true,
    ...props
}) => {

    const tooltip = useMemo( () => {
        return `${props.percentage.toFixed( percentagePrecision )}% teplot je v rozmezí ${props.temperatureFrom.toFixed( temperaturePrecision )} °C až ${props.temperatureTo.toFixed(2)} °C`;
    }, [ props.percentage, props.temperatureFrom, props.temperatureTo ] );

    const width = useMemo( () => {
        return `${ 100 / props.resolution }%`;
    }, [ props.resolution ] );

    const left = useMemo( () => {
        return `${ props.index * ( 100 / props.resolution ) }%`
    }, [props.resolution, props.index] );

    const height = useMemo( () => `${props.height}%`, [props.height] );



    return <Tooltip
        content={tooltip}
        placement={"top"}
        color={"foreground"}
    >
        <div
            className={ cn( 
                "absolute hover:bg-white bottom-0 h-full transition-all duration-300 ease-in-out", 
                hasBorder && "border-s-1 border-gray-300 border-solid first:border-s-0" 
            )}
            style={{
                width: width,
                left: left
            }}
        >

            <div 
                className="w-full bg-primary-500 opacity-70 absolute bottom-0"
                style={{
                    height: height
                }}
            >

            </div>

        </div>
    </Tooltip>

}