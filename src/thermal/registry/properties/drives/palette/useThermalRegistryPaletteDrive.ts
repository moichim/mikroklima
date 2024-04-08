"use client";

import { ThermalPalette, ThermalPalettes } from "@/thermal/file/palettes";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useEffect, useMemo, useState } from "react";
import { PaletteId } from "./PaletteDrive";

export const useThermalRegistryPaletteDrive = (
    registry: ThermalRegistry,
    purpose: string
) => {

    const [value, setValue] = useState<PaletteId>(registry.palette.value);

    const [palette, setPalette] = useState<ThermalPalette>(registry.palette.currentPalette);


    // Bind all the values to the local state
    useEffect(() => {

        registry.palette.addListener(purpose, newValue => {

            setValue(newValue);
            setPalette(registry.palette.currentPalette);

        });

        return () => registry.palette.removeListener(purpose);

    }, [registry,value, setValue,palette,setPalette]);


    // The setter
    const set = useMemo(() => registry.palette.setPalette.bind(registry.palette), [registry]);


    // When this unmounts, remove the listeners
    useEffect(() => {
        return () => registry.palette.removeListener(purpose);
    }, []);


    const availablePalettes = useMemo(() => {
        return ThermalPalettes
    }, []);


    return {
        value,
        palette,
        set,
        availablePalettes
    }

}