"use client";

import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useThermalRegistryOpacityDrive } from "@/thermal/registry/properties/drives/opacity/useThermalRegistryOpacityDrive";
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState";
import { Slider, SliderProps, Spinner, cn } from "@nextui-org/react";


type OpacitySliderProps = SliderProps & {
    registry: ThermalRegistry
}

/**
 * Controls the global oIR opacity
 * 
 * Subscribes to `ThermalRegistry` property `opacity` and modifies it.
 */
export const OpacitySlider: React.FC<OpacitySliderProps> = ({
    registry,
    step = 0.1,
    showSteps = true,
    showTooltip = true,
    minValue = 0,
    maxValue = 1,
    ...props
}) => {

    const ID = useThermalObjectPurpose(registry, "opacitySlider");

    const { value, set } = useThermalRegistryOpacityDrive(registry, ID);

    const { value: loading } = useThermalRegistryLoadingState(registry, ID);

    const { value: minmax } = useThermalRegistryMinmaxState(registry, ID);

    if (loading === true || minmax === undefined) {
        return <div
            className={cn("border-2 border-gray-300 border-dashed p-3 rounded-xl text-primary-500 flex gap-4", props.className)}
        >
            <Spinner size="sm" />
            <span>Visible snímky</span>
        </div>
    }


    return <Slider
        {...props}
        label="IR / Visible"
        step={step}
        showSteps={showSteps}
        showTooltip={showTooltip}
        minValue={0}
        maxValue={1}
        value={value}
        onChange={data => {
            if (!Array.isArray(data))
                set(data)
        }}
        classNames={
            {
                base: "px-3"
            }
        }
    />
}