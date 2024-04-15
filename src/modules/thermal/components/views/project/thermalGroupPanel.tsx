"use client";
 
import { useThermalObjectPurpose } from "@/modules/thermal/context/useThermalObjectPurpose";
import { ThermalGroup } from "@/modules/thermal/registry/ThermalGroup";
import { useThermalGroupInstancesState } from "@/modules/thermal/registry/properties/lists/instances/useThermalGroupInstancesState";
import { useThermalRegistryLoadingState } from "@/modules/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalGroupMinmaxProperty } from "@/modules/thermal/registry/properties/states/minmax/group/useThermalGroupMinmaxState";
import { MinmaxTable } from "../../dataViews/minmaxTable";
import { ThermalInstance } from "../../instance/thermalInstance";
import { useRouter } from "next/navigation";
import { cn } from "@nextui-org/react";
import { usePanelWidth } from "../../controls/panelWidth/usePanelWidth";

type ThermalGroupPanelProps = {
    group: ThermalGroup,
    scopeId: string,
    columns: number
}

export const ThermalGroupPanel: React.FC<ThermalGroupPanelProps> = props => {

    const ID = useThermalObjectPurpose( props.group, "panel" );

    const router = useRouter();

    const instances = useThermalGroupInstancesState(props.group, ID );

    const minmax = useThermalGroupMinmaxProperty(props.group, ID );

    const loading = useThermalRegistryLoadingState(props.group.registry, ID );

    const panelWidth = usePanelWidth(props.columns);

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

            <div className={panelWidth}>

                {instances.value.map(instance => <ThermalInstance
                    instance={instance}
                    key={instance.id}
                    highlightColor="black"
                    syncTimeHighlight={true}
                    highlightOnHover={true}
                    showDateOnHighlight={true}
                    hasPopup={false}
                    scopeId={props.scopeId}
                    onClick={ (i) => {

                        const url = `/project/${props.scopeId}/thermo/${instance.timestamp + 1}`;

                        router.push( url );
                    } } 
                />)}

            </div>

        </div>

    </div>

}

