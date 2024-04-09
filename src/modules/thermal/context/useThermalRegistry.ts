"use client";

import { useMemo } from "react";
import { useThermalManagerContext } from "./thermalManagerContext";

/** 
 * Creates and stores a registry instance.  
 * 
 * Does not remove the instance on unmount. To destroy the instance, call the manager's method `removeRegistry`
*/
export const useThermalRegistry = (
    registryId: string
) => {

    const manager = useThermalManagerContext();

    const registry = useMemo( () => {
        return manager.addOrGetRegistry( registryId );
    }, [registryId, manager] );

    return registry;

}