"use client";

import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { useThermalGroupInstancesState } from "@/thermal/registry/properties/lists/instances/useThermalGroupInstancesState";
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalGroupMinmaxProperty } from "@/thermal/registry/properties/states/minmax/group/useThermalGroupMinmaxState";
import { MinmaxTable } from "../../dataViews/minmaxTable";
import { ThermalInstance } from "../instance/thermalInstance";
import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose";

type ThermalGroupPanelProps = {
    group: ThermalGroup,
    scopeId: string
}

export const ThermalGroupPanel: React.FC<ThermalGroupPanelProps> = props => {

    const ID = useThermalObjectPurpose( props.group, "panel" );

    const instances = useThermalGroupInstancesState(props.group, ID );

    const minmax = useThermalGroupMinmaxProperty(props.group, ID );

    const loading = useThermalRegistryLoadingState(props.group.registry, ID );

    return <div className="w-1/3 px-2">
        <div className="bg-white rounded-t-xl">

            <div className="p-4">

                <h1 className="text-xl font-bold pb-2">{props.group.name ?? props.group.id}</h1>

                <div className="flex w-full">

                    <div className="w-full md:w-1/2">

                        {props.group.description && <div className="text-small pb-2">{props.group.description}</div>}
                        <div className="text-small">Počet snímků: {props.group.instances.value.length}</div>

                    </div>

                    <div className="w-full md:w-1/2">

                        <MinmaxTable
                            minmax={minmax.value}
                            loading={loading.value}
                            hideHeader
                            // isStriped
                            removeWrapper
                            isCompact
                            className="px-1"
                            fullWidth={false}
                        />

                    </div>

                </div>

            </div>

            <div className="flex flex-wrap -ms-[1px] -me-[3px] lg:-me-[7px] -mb-[2px]">

                {instances.value.map(instance => <ThermalInstance
                    instance={instance}
                    key={instance.id}
                    highlightColor="black"
                    syncTimeHighlight={true}
                    highlightOnHover={true}
                    showDateOnHighlight={true}
                    hasPopup={true}
                    scopeId={props.scopeId}
                />)}

            </div>

        </div>

    </div>

}

