"use client";

import { useThermalObjectPurpose } from "@/modules/thermal/context/useThermalObjectPurpose";
import { ThermalGroup } from "@/modules/thermal/registry/ThermalGroup";
import { useThermalGroupInstancesState } from "@/modules/thermal/registry/properties/lists/instances/useThermalGroupInstancesState";
import { useThermalRegistryLoadingState } from "@/modules/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalGroupMinmaxProperty } from "@/modules/thermal/registry/properties/states/minmax/group/useThermalGroupMinmaxState";
import { ThermalInstance } from "../../instance/thermalInstance";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { TableHeader, TableColumn, TableBody, TableCell, Snippet, Table, TableRow, cn } from "@nextui-org/react";
import { usePanelWidth } from "../../controls/panelWidth/usePanelWidth";

type ThermalGroupPanelProps = {
    group: ThermalGroup,
    scopeId: string,
    columns: number
}

export const TimeGroupPanel: React.FC<ThermalGroupPanelProps> = props => {

    const ID = useThermalObjectPurpose(props.group, "panel");

    const instances = useThermalGroupInstancesState(props.group, ID);

    const minmax = useThermalGroupMinmaxProperty(props.group, ID);

    const loading = useThermalRegistryLoadingState(props.group.registry, ID);

    const panelWidth = usePanelWidth(props.columns);

    return <div className="w-1/3 px-2">
        <div className="bg-white rounded-t-xl">

            <div className="px-4 pt-4">

                <h1 className="text-xl font-bold">{props.group.name ?? props.group.id}</h1>

            </div>



            <div className={panelWidth}>
                {instances.value.map(instance => <ThermalInstance
                    instance={instance}
                    key={instance.id}
                    highlightColor="black"
                    syncTimeHighlight={false}
                    highlightOnHover={false}
                    showDateOnHighlight={false}
                    hasPopup={true}
                    scopeId={props.scopeId}
                    columns={props.columns}
                >

                    <div className="w-full px-4 pt-3 pb-2 flex flex-wrap text-xs gap-3">

                        <span>
                            {TimeFormat.humanTime(instance.timestamp, true)}
                        </span>

                        <span className={cn(
                            "text-gray-400",
                            props.columns >= 4 && "hidden"
                        )}>

                            {minmax !== undefined
                                ? <>
                                    {instance.min.toFixed(2)} — {instance.max.toFixed(2)} °C
                                </>
                                : "načítám"
                            }
                        </span>

                        <span className={cn(
                            "text-gray-300",
                            props.columns >= 3 && "hidden"
                        )}>

                            {minmax !== undefined
                                ? <>
                                    {instance.width} x {instance.height} px
                                </>
                                : "načítám"
                            }
                        </span>

                        <span className={cn(
                            "text-gray-300",
                            props.columns >= 2 && "hidden"
                        )}>

                            {minmax !== undefined
                                ? <>
                                    {instance.signature}
                                </>
                                : "načítám"
                            }
                        </span>

                    </div>

                </ThermalInstance>

                )}
            </div>


        </div>

    </div>

}

