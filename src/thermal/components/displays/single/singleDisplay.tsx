"use client";

import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry"
import { ThermalInstanceDisplayParameters } from "../instance/thermalInstance"
import { useThermalRegistryGroups } from "@/thermal/registry/properties/lists/groups/useThermalRegistryGroupsState"
import { useEffect, useMemo } from "react"
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState"
import { Spinner } from "@nextui-org/react"
import { SingleInstanceDetail } from "./detail/singleInstanceDetail"
import { useThermalGroupInstancesState } from "@/thermal/registry/properties/lists/instances/useThermalGroupInstancesState";
import { useThermalObjectPurpose } from "@/thermal/context/useThermalObjectPurpose";

type SingleDisplayProps = ThermalInstanceDisplayParameters & {
    registry: ThermalRegistry,
    hasDownloadButtons?: boolean
}


export const SingleDisplay: React.FC<SingleDisplayProps> = ({
    registry,
    hasDownloadButtons = false,

    hasPopup = false,
    showDateOnHighlight = true,
    syncTimeHighlight = true,
    highlightColor = undefined,
    highlightOnHover = true,
    forceHighlight = false,

    ...props
}) => {

    const ID = useThermalObjectPurpose( registry, "singleDisplay" );

    const groups = useThermalRegistryGroups(registry, ID);

    const loading = useThermalRegistryLoadingState(registry, ID);

    useEffect( () => {
        registry.histogram.setResolution( 200 );
        // registry.histogram.recalculateWithCurrentSetting();
    }, [registry] );


    if (loading.value === true) {
        return <>
            <Spinner /> Načítám registr
        </>
    }

    return <>
        {groups.value
            .map(group => <div
                className=""
                key={group.id}
            >
                {group.instances.value
                    .map(instance => <div className="" key={instance.id}>
                        <SingleInstanceDetail

                            instance={instance}
                            hasDownloadButtons={hasDownloadButtons}

                            hasPopup={hasPopup}
                            showDateOnHighlight={showDateOnHighlight}
                            highlightColor={highlightColor}
                            highlightOnHover={highlightOnHover}
                            forceHighlight={forceHighlight}

                        />
                    </div>

                    )}

            </div>

            )

        }
    </>

}