"use client";

import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry"
import { useThermalRegistryGroups } from "@/thermal/registry/properties/lists/groups/useThermalRegistryGroupsState"
import { ThermalGroupPanel } from "./thermalGroupPanel"
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState"
import { Progress, Spinner } from "@nextui-org/react"
import { useEffect } from "react";
import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose";
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState";

export type RegistryDisplayProps = {
    registry: ThermalRegistry,
    scopeId: string
}

/**
 * A stupid registry collection display.
 * 
 * Does not remove the registry upon unmount. This important thing should be executed by the parent component.
 */
export const RegistryDisplay: React.FC<RegistryDisplayProps> = props => {

    const ID = useThermalObjectPurpose(props.registry, "registryDisplay");

    const groups = useThermalRegistryGroups(props.registry, ID);

    /** @todo Perhaps this step should be moved down to the group */
    const loading = useThermalRegistryLoadingState(props.registry, ID);

    const {value} = useThermalRegistryMinmaxState( props.registry, ID );

    if (value === undefined) {
        return <div className="min-h-1/2 h-[50vh] flex w-full items-center justify-center flex-col text-cener text-primary gap-4">
            <Progress
                size="sm"
                isIndeterminate
                aria-label="Loading..."
                className="max-w-md"
            /> 
            <div>Načítám snímky</div>
        </div>
    }


    if (loading.value === true) {
        return <div className="min-h-1/2 h-[50vh] flex w-full items-center justify-center flex-col text-cener text-primary gap-4">
            <Progress
                size="sm"
                isIndeterminate
                aria-label="Loading..."
                className="max-w-md"
            /> 
            <div>Zpracovávám snímky z termokamery</div>
        </div>
    }

    return <div className="flex flex-wrap w-full">

        {/** Zde by měla být teplotní škála a další vlastnosti */}

        {groups.value.map(group => <ThermalGroupPanel group={group} key={group.id} scopeId={props.scopeId} />)}

    </div>

}