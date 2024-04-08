"use client";

import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useThermalRegistryOpacityDrive } from "@/thermal/registry/properties/drives/opacity/useThermalRegistryOpacityDrive";
import { Slider, SliderProps } from "@nextui-org/react";


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

    const ID = useThermalObjectPurpose( registry, "opacitySlider" );

    const { value, set } = useThermalRegistryOpacityDrive(registry, ID );


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