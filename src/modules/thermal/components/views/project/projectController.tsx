"use client";

import { Navbar } from "@/components/ui/navigation/Navbar";
import { OpacitySlider } from "@/modules/thermal/components/controls/opacity/OpacitySlider";
import { PaletteDropdown } from "@/modules/thermal/components/controls/palette/paletteDropdown";
import { TemperatureScaleBase } from "@/modules/thermal/components/controls/scale/internals/ThermalRangeSlider";
import { useProjectLoader } from "@/modules/thermal/context/useProjectLoader";
import { useTimeContext } from "@/modules/time/timeContext";
import { useEffect, useMemo, useState } from "react";
import { useThermalManagerContext } from "../../../context/thermalManagerContext";
import { useThermalRegistry } from "../../../context/useThermalRegistry";
import { RegistryDisplay } from "./registryDisplay";
import { PanelWidthDropdown } from "../../controls/panelWidth/panelWidthDropdown";
import { Toolbar } from "@/components/ui/toolbar/Toolbar";
import { HistogramAutoButton } from "../../controls/scale/histogram/settings/histogramAutoButton";
import { HistogramFullButton } from "../../controls/scale/histogram/settings/histogramFullButton";

type ProjectDisplayProps = {
  scopeId: string;
};

/**
 * The master controller of a scope.
 *
 * Creates and removes the registry upon unmount. Use only once per page & scope!
 *
 * There may be more scopes. The parameter `scope` corresponds to values returned by `/graphql/google/googleProvider`
 */
export const ProjectController: React.FC<ProjectDisplayProps> = (props) => {
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
  const { loading, projectDescription } = useProjectLoader(
    registryId,
    timeState.from,
    timeState.to
  );

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

  const [panelWidth, setPanelWidth] = useState<number>(1);

  // Every time the folder is loaded, automatically calculate the width of the panel
  useEffect(() => {
    const max = Object.values(projectDescription).reduce((state, current) => {
      if (current.files.length > state) {
        return current.files.length < 4 ? current.files.length : 4;
      }

      return state;
    }, 0);

    if (max > 0) {
      setPanelWidth(max);
    }
  }, [projectDescription]);

  return (
    <>
      <Toolbar
        label={`Všechny termogramy`}
        classes={{
          container: "bg-slate-200",
        }}
        persistentContent={
          <div className="px-4 pb-4 -mt-6">
            <TemperatureScaleBase hasButtons={false} registry={registry} />
          </div>
        }
        close={{ href: "/about/teams", tooltip: "Zavřít projekt" }}
        configurationLabel="Zobrazení"
        configuration={[
          {
            content: (
              <div className="flex gap-4">
                <HistogramAutoButton registry={registry} />
                <HistogramFullButton registry={registry} />
              </div>
            ),
            label: "Přizpůsobení teplotního rozsahu",
            description: (
              <ul>
                <li className="flex gap-4 w-full items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
                    />
                  </svg>
                  <span>= nejhojneji zastoupené teploty</span>
                </li>
                <li className="flex gap-4 w-full items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    />
                  </svg>
                  <span>= veškeré zobrazené teploty</span>
                </li>
              </ul>
            ),
          },
          {
            content: <PaletteDropdown registry={registry} />,
            label: "Barevná paleta",
          },
          {
            content: (
              <PanelWidthDropdown
                current={panelWidth}
                onUpdate={setPanelWidth}
                registry={registry}
              />
            ),
            label: "Šířka panelu",
            description: "Nastavte počet sloupců termogramů.",
          },
          {
            content: <OpacitySlider registry={registry} className="md:w-60" />,
            description:
              "Přepněte mezi zobrazením termálního a visible snímku.",
            label: "Termální / visible snímek",
          },
        ]}
      ></Toolbar>

      <div className="px-2 pt-4">
        <RegistryDisplay
          registry={registry}
          scopeId={props.scopeId}
          columns={panelWidth}
        />
      </div>
    </>
  );
};
