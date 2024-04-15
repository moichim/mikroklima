"use client";

import { ThermalPalette, ThermalPalettes } from "@/modules/thermal/file/palettes";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useEffect, useMemo, useState } from "react";
import { PaletteId } from "./PaletteDrive";
import { ThermalManager } from "../../../ThermalManager";
import { useThermalManagerContext } from "@/modules/thermal/context/thermalManagerContext";

export const useThermalRegistryPaletteDrive = (
    purpose: string
) => {

    const manager = useThermalManagerContext();

    const [value, setValue] = useState<PaletteId>(manager.palette.value);

    const [palette, setPalette] = useState<ThermalPalette>(manager.palette.currentPalette);


    // Bind all the values to the local state
    useEffect(() => {

        manager.palette.addListener(purpose, newValue => {

            setValue(newValue);
            setPalette(manager.palette.currentPalette);

        });

        return () => manager.palette.removeListener(purpose);

    }, [manager,value, setValue,palette,setPalette]);


    // The setter
    const set = useMemo(() => manager.palette.setPalette.bind(manager.palette), [manager]);


    // When this unmounts, remove the listeners
    useEffect(() => {
        return () => manager.palette.removeListener(purpose);
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