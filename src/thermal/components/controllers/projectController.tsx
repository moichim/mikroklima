"use client";

import { Navbar } from "@/components/navigation/utils/Navbar";
import { useTimeContext } from "@/state/time/timeContext";
import { useProjectLoader } from "@/thermal/context/useProjectLoader";
import { useEffect, useMemo } from "react";
import { useThermalManagerContext } from "../../context/thermalManagerContext";
import { useThermalRegistry } from "../../context/useThermalRegistry";
import { RegistryDisplay } from "../displays/registry/registryDisplay";
import { OpacitySlider } from "@/thermal/components/controls/opacity/OpacitySlider";
import { PaletteDropdown } from "@/thermal/components/controls/palette/paletteDropdown";
import { TemperatureScaleBase } from "@/thermal/components/controls/scale/internals/ThermalRangeSlider";


type ProjectDisplayProps = {
    scopeId: string
}

/**
 * The master controller of a scope.
 * 
 * Creates and removes the registry upon unmount. Use only once per page & scope!
 * 
 * There may be more scopes. The parameter `scope` corresponds to values returned by `/graphql/google/googleProvider`
 */
export const ProjectController: React.FC<ProjectDisplayProps> = props => {

    // Store the ID once for all to prevent ID changes
    const registryId = useMemo(() => {
        return props.scopeId;
    }, []);

    // Observe the time state
    const { timeState } = useTimeContext();

    // The global manager instance is used for removal of the registry on unmount
    const manager = useThermalManagerContext();


    // Hold the instance of the registry
    const registry = useThermalRegistry(registryId);


    // Load and update the project files definitions
    /** @todo Implement API loading behaviour. */
    const { loading, projectDescription } = useProjectLoader(registryId, timeState.from, timeState.to);


    // Everytime the definition changes, reload the entire registry
    useEffect(() => {

        if (Object.keys(projectDescription).length > 0) {
            registry.loadProject(projectDescription);
        }

    }, [projectDescription, registry]);


    // Remove the registry on unmount
    useEffect(() => {

        // return () => manager.removeRegistry(registryId);

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
        />

        <div className="px-2 pt-4">
            <RegistryDisplay registry={registry} scopeId={ props.scopeId }/>
        </div >

    </>

}