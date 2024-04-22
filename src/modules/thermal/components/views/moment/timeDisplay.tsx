"use client";

import { useThermalObjectPurpose } from "@/modules/thermal/context/useThermalObjectPurpose";
import { useThermalRegistryGroups } from "@/modules/thermal/registry/properties/lists/groups/useThermalRegistryGroupsState";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState";
import { Progress } from "@nextui-org/react";
import { TimeGroupPanel } from "./thermalGroupPanel";

export type RegistryDisplayProps = {
    registry: ThermalRegistry,
    scopeId: string,
    columns: number
}

/**
 * A stupid registry collection display.
 * 
 * Does not remove the registry upon unmount. This important thing should be executed by the parent component.
 */
export const TimeDisplay: React.FC<RegistryDisplayProps> = props => {

    const ID = useThermalObjectPurpose(props.registry, "registryDisplay");

    const groups = useThermalRegistryGroups(props.registry, ID);

    /** @todo Perhaps this step should be moved down to the group */
    const loading = useThermalRegistryLoadingState(props.registry, ID);

    const {value} = useThermalRegistryMinmaxState( props.registry, ID );

    if (value === undefined) {
        return <div className="min-h-1/2 h-[50vh] flex w-full items-center justify-center flex-col text-cener text-primary gap-4 border-2 border-dashed border-gray-400">
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
        return <div className="min-h-1/3 h-[50vh] flex w-full items-center justify-center flex-col text-cener text-primary gap-4 border-2 border-dashed border-gray-400">
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

        {groups.value.map(group => <TimeGroupPanel group={group} key={group.id} scopeId={props.scopeId} columns={props.columns}/>)}

    </div>

}