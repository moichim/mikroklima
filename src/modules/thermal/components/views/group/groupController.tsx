"use client";

import { Navbar } from "@/components/ui/navigation/Navbar";
import { useProjectLoader } from "@/modules/thermal/context/useProjectLoader";
import { useThermalRegistry } from "@/modules/thermal/context/useThermalRegistry";
import { useTimeContext } from "@/modules/time/timeContext";
import { useEffect, useMemo, useState } from "react"
import { TemperatureScaleBase } from "../../controls/scale/internals/ThermalRangeSlider";
import { OpacitySlider } from "../../controls/opacity/OpacitySlider";
import { PaletteDropdown } from "../../controls/palette/paletteDropdown";
import { PanelWidthDropdown } from "../../controls/panelWidth/panelWidthDropdown";
import { GraphWithFixedTime } from "@/modules/graph/components/graphs/graphWithFixedTime";
import { GraphContextProvider } from "@/modules/graph/graphContext";
import { GraphWithGlobalTime } from "@/modules/graph/components/graphs/graphWithGlobalTime";
import { GoogleScope } from "@/graphql/google/google";
import { GroupDisplay } from "./groupDisplay";
import { ThermalGroup } from "@/modules/thermal/registry/ThermalGroup";

type GroupControllerProps = {
    groupId: string,
    scope: GoogleScope
}

export type TemperatureHighlightType = {
    [index: number]: number
}

export const GroupController: React.FC<GroupControllerProps> = ({
    groupId,
    scope,
    ...props
}) => {

    const registryId = useMemo(() => {
        return `group_view_${scope.slug}_${groupId}`;
    }, [groupId, scope.slug]);

    const { timeState } = useTimeContext();

    const { projectDescription } = useProjectLoader(scope.slug, timeState.from, timeState.to);

    const registry = useThermalRegistry(registryId);

    const [g, setGroup ] = useState<ThermalGroup|undefined>( undefined );

    useEffect( () => {

        registry.groups.addListener( registryId, value => {

            setGroup( registry.groups.map.get( registryId ) );


        } );

        return () => registry.groups.removeListener( registryId );

    }, [registry] );

    const groupDefinition = useMemo(() => {

        if (Object.keys(projectDescription).includes(groupId)) {
            return projectDescription[groupId];
        }

        return undefined;

    }, [projectDescription, registry]);

    // Listen for changes in the project loader and recreate the group
    useEffect(() => {

        if (groupDefinition !== undefined) {
            registry.loadGroupOfFiles(registryId, groupDefinition);
        }

    }, [registry, groupDefinition]);

    const [panelWidth, setPanelWidth] = useState<number>(1);

    const [ highlight, setHighlight ] = useState<TemperatureHighlightType|undefined>(undefined);


    useEffect( () => {

        g?.cursorPosition.addListener( registryId, value => {

            if ( value !== undefined ) {

                const hl: { [index: number]: number } = {};

                g.instances.forEveryInstance( instance => {

                    hl[ instance.timestamp ] = instance.getTemperatureAtPoint( value.x, value.y );

                } );

                setHighlight( hl );

            } else {
                setHighlight( undefined );
            }


        } );

        return () => g?.cursorPosition.removeListener( registryId );

    }, [g] );


    return <div>
        <Navbar
            className="bg-slate-200 flex-wrap items-start py-6"
            height="fit-contenr"

            innerContent={<>
                <div className="flex-grow w-3/4">
                    <TemperatureScaleBase
                        registry={registry}
                    />
                </div>
                <OpacitySlider registry={registry} className="md:w-60" />
                <PaletteDropdown registry={registry} />
                <PanelWidthDropdown current={panelWidth} onUpdate={setPanelWidth} registry={registry} />
            </>}
            underContent={<div>
                <GraphContextProvider>
                    <GraphWithGlobalTime
                        defaultGraphs={["temperature"]}
                        scope={scope}
                        hasZoom={false}
                        temperatureHighlight={highlight}
                    />
                </GraphContextProvider>
            </div>}
            closeLink={`/project/${scope.slug}/thermo`}
            closeLinkHint="Zpět na přehled všech termogramů"
        />
        <div>

        </div>
        <GroupDisplay registry={registry} scopeId={scope.slug} columns={10} />
    </div>

}