"use client";

import { useMemo } from "react";
import { ThermalManager } from "../registry/ThermalManager";

/**
 * Creates an instance of the `ThermalManager` and stores it.
 * 
 * - use only in the global context!!
 * - to get the instance of the global `ThermalManager`, use `useThermalManagerContext` hook
 */
export const useThermalManagerInternal = () => {

    return useMemo( () => {
        return new ThermalManager;
    }, [] );

}