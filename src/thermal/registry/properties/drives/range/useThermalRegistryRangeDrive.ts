"use client";

import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { ThermalRangeOrUndefined } from "@/thermal/registry/interfaces";
import { useEffect, useMemo, useState } from "react";

export const useThermalRegistryRangeDrive = (
    registry: ThermalRegistry,
    purpose: string
) => {

    const [value, setValue] = useState<ThermalRangeOrUndefined>(registry.range.value);

    // Bind all the values to the local state
    useEffect(() => {

        registry.range.addListener(purpose, newValue => {

            if (newValue !== value) {
                setValue(newValue);
            }

        });

        return () => registry.range.removeListener(purpose);

    }, [registry,value,setValue]);


    // The setting function
    const set = useMemo(() => registry.range.imposeRange.bind( registry.range ), [registry]);


    // When this unmounts, remove the listeners
    useEffect(() => {
        return () => registry.range.removeListener(purpose);
    }, []);


    return {
        value,
        set
    }

}