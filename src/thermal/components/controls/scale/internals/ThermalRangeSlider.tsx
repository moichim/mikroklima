"use client";

import { InfoIcon, SettingIcon } from "@/components/ui/icons";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useThermalRegistryPaletteDrive } from "@/thermal/registry/properties/drives/palette/useThermalRegistryPaletteDrive";
import { useThermalRegistryRangeDrive } from "@/thermal/registry/properties/drives/range/useThermalRegistryRangeDrive";
import { useThermalRegistryHistogramState } from "@/thermal/registry/properties/states/histogram/useThermalRegistryHistogramState";
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Slider, SliderProps, SliderValue, Spinner, Tooltip, cn } from "@nextui-org/react";
import { DOMAttributes, useCallback, useEffect, useMemo, useState } from "react";
import { Histogram } from "./histogram/histotgram";
import { HistogramAutoButton } from "./histogram/settings/histogramAutoButton";
import { HistogramFullButton } from "./histogram/settings/histogramFullButton";
import { HistogramDropdown } from "./histogram/settings/histogramDropdown";
import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose";

type ThermalRangeProps = SliderProps & {
    registry: ThermalRegistry,
    rangeOffset?: number,
    histogramBorder?: boolean
}

export const TemperatureScaleBase: React.FC<ThermalRangeProps> = ({
    registry,
    rangeOffset = 0,
    histogramBorder = true,
    ...props
}) => {

    const ID = useThermalObjectPurpose( registry, "temperatureScaleBase" );

    // Global properties

    // Minmax
    const { value: minmax } = useThermalRegistryMinmaxState(registry, ID);

    // Range
    const { value: range, set: setRange } = useThermalRegistryRangeDrive(registry, ID);

    // Palette
    const { availablePalettes, value: currentPaletteSlug, palette: currentPalette } = useThermalRegistryPaletteDrive(registry, ID);

    // Loading
    const { value: loading } = useThermalRegistryLoadingState(registry, ID);






    // Initial value calculation
    const initialValue = useMemo(() => {

        if (range !== undefined) {

            const normalisedValue = [
                Math.min(range.from, range.to),
                Math.max(range.from, range.to)
            ] as [number, number];


            return normalisedValue;

        }

        return [
            -Infinity,
            Infinity
        ] as [number, number]

    }, [range]);


    // Local state controlling the UI
    const [value, setValue] = useState<[number, number]>(initialValue);

    // Local state storing the final value
    const [final, setFinal] = useState<[number, number]>(value);



    const onUserSlide = (data: SliderValue) => {
        if (Array.isArray(data))
            setValue(data as [number, number]);
    }

    const onUserSlideEnd = (data: SliderValue) => {
        if (Array.isArray(data))
            setFinal(data as [number, number]);
    }



    // Impose the local change to global context
    useEffect(() => {

        if (range !== undefined) {
            if (range.from !== final[0] || range.to !== final[1]) {
                setRange({ from: final[0], to: final[1] });
            }
            if (final[0] !== value[0] || final[1] !== value[1]) {
                setValue(final);
            }
        }


    }, [final]);


    // Reflect global changes to the local state
    useEffect(() => {

        if (range !== undefined) {

            if (
                range.from !== final[0]
                || range.to !== final[1]
            ) {
                setFinal([range.from, range.to]);
                setValue([range.from, range.to]);
            }

        }

    }, [range]);




    // The render thumb fn
    /** @todo change colors of the points by the current palette */
    const renderThumb = useCallback((
        props: DOMAttributes<HTMLDivElement> & { index?: number }
    ) => {

        const bg = props.index === 0
            ? currentPalette.pixels[0]//"bg-black"
            : currentPalette.pixels[255]//"bg-white";
        return (<div
            {...props}
            className={"group p-1 top-1/2 bg-gray-700 border-tiny border-default-200 rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"}
            aria-label="some label"
        >
            <span className={"transition-transform rounded-full w-6 h-6 block group-data-[dragging=true]:scale-80"}
                style={{ backgroundColor: bg }}
            />
        </div>)
    }, [currentPalette]);




    const step = useMemo(() => {

        if (minmax === undefined)
            return -Infinity;

        return Math.round(minmax.max - minmax.min) / 50;

    }, [minmax]);


    const fillerClass = useMemo(() => {

        if (loading === false) {
            return `thermal-scale-${currentPaletteSlug} cursor-pointer`;
        }

        return "cursor-disabled";

    }, [loading, currentPaletteSlug]);




    /** Conditional rendering */

    // If loading
    if (minmax === undefined) {
        return <div className="flex-grow flex gap-4 items-center text-primary h-full">
            <Spinner size="sm" />
            <span>Zpracovávám teplotní škálu</span>
        </div>
    }




    return <div className="flex-grow">

        <style>

            {Object.entries(availablePalettes).map(([key, palette]) => {

                return `.thermal-scale-${key} {background-image: ${palette.gradient}}`

            })}

        </style>


        <div className="flex gap-4 w-full items-center">
            <div className="flex-grow">

                <div className="w-full h-10 px-4">

                    <Histogram 
                        registry={registry}
                        hasBorder={histogramBorder}
                    />

                </div>

                <Slider
                    {...props}

                    isDisabled={loading}

                    step={step}
                    showSteps={step !== -Infinity}

                    onChange={onUserSlide}
                    onChangeEnd={onUserSlideEnd}


                    // Values
                    minValue={Math.floor(minmax.min - rangeOffset)}
                    maxValue={Math.ceil(minmax.max + rangeOffset)}

                    value={value}


                    // Appearance
                    color="foreground"
                    classNames={{
                        base: "px-1 min-w-screen",
                        mark: "bg-black",
                        track: "bg-gray-400 h-6 cursor-pointer",
                        filler: fillerClass,
                        label: "text-xl"
                    }}


                    // aria-label={props.label ?? "teplotní škála"}
                    renderThumb={renderThumb}
                    renderLabel={({ children, ...properties }) => (
                        <label {...properties} className="text-lg flex gap-2 items-center" aria-label="teplotní škála">
                            {children}
                            <Tooltip
                                className="px-1.5 text-small text-default-600 rounded-small"
                                content={
                                    <div>Celkový rozsah <strong>{props.minValue} °C</strong> až <strong>{props.maxValue} °C</strong></div>
                                }
                                placement="right"
                            >
                                <span className="transition-opacity opacity-80 hover:opacity-100">
                                    <InfoIcon />
                                </span>
                            </Tooltip>
                        </label>
                    )}
                    showTooltip
                />

            </div>

            <HistogramFullButton registry={registry} />
            <HistogramAutoButton registry={registry} minHeight={3}/>

        </div>

    </div>

}