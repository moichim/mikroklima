import { useMemo } from "react";
import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { ThermalGroup } from "../registry/ThermalGroup";
import { ThermalRegistry } from "../registry/ThermalRegistry";

/** Creates and stores a thermal object!s ID for the purpose of listeners */
export const useThermalObjectPurpose = (
    object: ThermalRegistry | ThermalGroup | ThermalFileInstance,
    purpose: string
) => {

    return useMemo(() => {

        const iteration = (Math.random() * 10000).toFixed(0);

        let objectType = "object";

        if (object instanceof ThermalRegistry)
            objectType = "registry";
        else if (object instanceof ThermalGroup)
            objectType = "group";
        else if (object instanceof ThermalFileInstance)
            objectType = "instance";

        return [
            objectType,
            object.id,
            purpose,
            iteration
        ].join( "__" );

    }, []);


}