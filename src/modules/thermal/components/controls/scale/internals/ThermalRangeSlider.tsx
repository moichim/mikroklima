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
import { useThermalObjectPurpose } from "@/modules/thermal/context/useThermalObjectPurpose";
import { Histogram } from "../histogram/histotgram";
import { HistogramAutoButton } from "../histogram/settings/histogramAutoButton";
import { HistogramFullButton } from "../histogram/settings/histogramFullButton";
import { useMarks } from "./useMarks";

type ThermalRangeProps = SliderProps & {
    registry: ThermalRegistry,
    rangeOffset?: number,
    histogramBorder?: boolean,
    histogramPrecision?: number,
    hasButtons?: boolean
}

export const TemperatureScaleBase: React.FC<ThermalRangeProps> = ({
    registry,
    rangeOffset = 0,
    histogramBorder = true,
    histogramPrecision = 50,
    hasButtons = true,
    ...props
}) => {

    const ID = useThermalObjectPurpose(registry, "temperatureScaleBase");

    // Global properties

    // Minmax
    const { value: minmax } = useThermalRegistryMinmaxState(registry, ID);

    // Range
    const { value: range, set: setRange } = useThermalRegistryRangeDrive(registry, ID);

    // Palette
    const { availablePalettes, value: currentPaletteSlug, palette: currentPalette } = useThermalRegistryPaletteDrive(ID);

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

        const label = props.index === 0
            ? "Minimální zobrazená teplota"
            : "Maximální zobrazená teplota";

        return (<div
            {...props}
            className={"group p-[2px] top-1/2 rounded bg-gray-500 border-tiny border-default-200 cursor-grab data-[dragging=true]:cursor-grabbing z-[100]"}
            aria-label={label}
        >
            <span className={"transition-transform w-2 h-6 block group-data-[dragging=true]:scale-80"}
                style={{ backgroundColor: bg }}
            />

            {(value[0] !== -Infinity && value[1] !== Infinity) &&

                <span
                    className="absolute w-0 z-10 top-8 text-xs text-center"
                    style={{ zIndex: 10000 }}
                >

                    <span
                        className="w-2 h-2 absolute -top-1 rotate-45 bg-gray-500"
                    ></span>
                    <span
                        className="absolute block w-10 -left-4 border-[2px] border-gray-500 border-solid rounded text-center bg-black"
                        style={{ zIndex: 10000 }}
                    >

                        <span
                            className=" text-white text-center"
                        >{props.index === 0 ? value[0].toFixed(1) : value[1].toFixed(1)}</span>

                    </span>
                </span>

            }

        </div>)
    }, [currentPalette, value]);




    const step = useMemo(() => {

        if (minmax === undefined)
            return -Infinity;

        return Math.round(minmax.max - minmax.min) / 50;

    }, [minmax]);

    const marks = useMarks(minmax);


    const fillerClass = useMemo(() => {

        if (loading === false) {
            return `thermal-scale-${currentPaletteSlug} cursor-pointer`;
        }

        return "cursor-disabled";

    }, [loading, currentPaletteSlug]);




    /** Conditional rendering */

    // If loading
    if (minmax === undefined) {
        return <div className="flex-grow flex gap-4 items-center text-primary h-full border-2 border-gray-300 border-dashed rounded-xl p-4">
            <Spinner size="sm" />
            <span>Teplotní škála</span>
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
                        mark: "text-xs top-4 z-0",
                        track: "bg-gray-400 h-5 cursor-pointer",
                        filler: fillerClass,
                        label: "text-xl",
                        thumb: "z-100 bg-yellow-500"
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
                    //showTooltip
                    marks={marks}
                />

            </div>
            {hasButtons === true &&
                <>
                    <HistogramFullButton registry={registry} />
                    <HistogramAutoButton registry={registry} minHeight={3} />
                </>
            }

        </div>

    </div>

}