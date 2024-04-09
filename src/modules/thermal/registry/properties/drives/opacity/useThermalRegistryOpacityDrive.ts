"use client";

import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useEffect, useMemo, useState } from "react";

export const useThermalRegistryOpacityDrive = (
    registry: ThermalRegistry,
    purpose: string
) => {

    const [value, setValue] = useState<number>(registry.opacity.value);

    // Bind all the values to the local state
    useEffect(() => {

        registry.opacity.addListener(purpose, newValue => {

            if (newValue !== value) {
                setValue(newValue);
            }

        });

        return () => registry.opacity.removeListener(purpose);

    }, [registry,value,setValue]);


    // The setting function
    const set = useMemo(() => registry.opacity.imposeOpacity.bind( registry.opacity ), [registry]);



    // When this unmounts, remove the listeners
    useEffect(() => {
        return () => registry.opacity.removeListener(purpose);
    }, []);

    return {
        value,
        set
    }

}