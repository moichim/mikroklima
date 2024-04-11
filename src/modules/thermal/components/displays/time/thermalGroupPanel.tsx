"use client";

import { useThermalObjectPurpose } from "@/modules/thermal/context/useThermalObjectPurpose";
import { ThermalGroup } from "@/modules/thermal/registry/ThermalGroup";
import { useThermalGroupInstancesState } from "@/modules/thermal/registry/properties/lists/instances/useThermalGroupInstancesState";
import { useThermalRegistryLoadingState } from "@/modules/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalGroupMinmaxProperty } from "@/modules/thermal/registry/properties/states/minmax/group/useThermalGroupMinmaxState";
import { ThermalInstance } from "../instance/thermalInstance";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { TableHeader, TableColumn, TableBody, TableCell, Snippet, Table, TableRow } from "@nextui-org/react";

type ThermalGroupPanelProps = {
    group: ThermalGroup,
    scopeId: string
}

export const TimeGroupPanel: React.FC<ThermalGroupPanelProps> = props => {

    const ID = useThermalObjectPurpose(props.group, "panel");

    const instances = useThermalGroupInstancesState(props.group, ID);

    const minmax = useThermalGroupMinmaxProperty(props.group, ID);

    const loading = useThermalRegistryLoadingState(props.group.registry, ID);

    return <div className="w-1/3 px-2">
        <div className="bg-white rounded-t-xl">

            <div className="px-4 pt-4">

                <h1 className="text-xl font-bold">{props.group.name ?? props.group.id}</h1>

            </div>



            <div className="flex flex-wrap">
            {instances.value.map(instance => <div
                key={instance.id}
            >

                <div className="w-full px-4 py-4 flex flex-wrap text-sm text-gray-400 -mx-2">

                    <div className="px-2 w-full md:w-auto">
                        {TimeFormat.human(instance.timestamp)}
                    </div>

                    <div className="px-2 flex-grow md:text-center">
                        {minmax !== undefined
                            ? <>
                                {instance.min.toFixed(4)} až {instance.max.toFixed(4)} °C
                            </>
                            : "načítám"
                        }
                    </div>


                    <div className="px-2">
                        {instance.width} x {instance.height} px
                    </div>


                </div>

                <ThermalInstance
                    instance={instance}
                    key={instance.id}
                    highlightColor="black"
                    syncTimeHighlight={false}
                    highlightOnHover={false}
                    showDateOnHighlight={false}
                    hasPopup={true}
                    scopeId={props.scopeId}
                    className="w-full"
                    columns={1}
                />

            </div>
            )}
            </div>


        </div>

    </div>

}

