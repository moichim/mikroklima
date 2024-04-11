"use client";

import { useProjectLoader } from "@/modules/thermal/context/useProjectLoader";
import { useThermalRegistry } from "@/modules/thermal/context/useThermalRegistry";
import { useEffect, useMemo } from "react";
import { OpacitySlider } from "../controls/opacity/OpacitySlider";
import { PaletteDropdown } from "../controls/palette/paletteDropdown";
import { TemperatureScaleBase } from "../controls/scale/internals/ThermalRangeSlider";
import { Navbar } from "@/components/ui/navigation/Navbar";
import { RegistryDisplay } from "../displays/registry/registryDisplay";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { TimeDisplay } from "../displays/time/timeDisplay";

type TimeControllerProps = {
    scopeId: string,
    from: number,
    to: number
}

export const TimeController: React.FC<TimeControllerProps> = ({ ...props }) => {

    const registryId = useMemo(() => {
        return `${props.scopeId}_${props.from}_${props.to}`;
    }, [props.scopeId]);

    const { projectDescription } = useProjectLoader(props.scopeId, props.from, props.to);

    // Create the registry instance
    const registry = useThermalRegistry(registryId);

    useEffect(() => {

        if (Object.keys(projectDescription).length > 0) {
            registry.loadProject(projectDescription);
        }

    }, [registry, projectDescription]);

    // Remove self upon unmount
    useEffect(() => {
        // registry.destroySelfInTheManager();
    }, []);


    return <>

        <Navbar
            className="bg-slate-200"
            height="6rem"
            innerContent={<>
                <div className="flex-grow w-3/4">
                    <TemperatureScaleBase
                        registry={registry}
                    />
                </div>
                <OpacitySlider registry={registry} className="md:w-60" />
                <PaletteDropdown registry={registry} />
            </>}
            closeLink={`/project/${props.scopeId}/thermo`}
            closeLinkHint="Zpět na přehled všech termogramů"
        />

        <header
            className="p-4 py-8 text-center"
        >
            <h1
                className="text-2xl font-bold"
            >
                {TimeFormat.humanDate(props.to)}
            </h1>
        </header>

        <div className="px-2 pt-4">
            <TimeDisplay registry={registry} scopeId={props.scopeId}/>
        </div >

    </>
}