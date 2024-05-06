"use client";

import { Navbar } from "@/components/ui/navigation/Navbar";
import { useProjectLoader } from "@/modules/thermal/context/useProjectLoader";
import { useThermalRegistry } from "@/modules/thermal/context/useThermalRegistry";
import { useTimeContext } from "@/modules/time/timeContext";
import { useEffect, useMemo, useState } from "react";
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
import { Toolbar } from "@/components/ui/toolbar/Toolbar";
import { HistogramAutoButton } from "../../controls/scale/histogram/settings/histogramAutoButton";
import { HistogramFullButton } from "../../controls/scale/histogram/settings/histogramFullButton";

type GroupControllerProps = {
  groupId: string;
  scope: GoogleScope;
};

export type TemperatureHighlightType = {
  [index: number]: number;
};

export const GroupController: React.FC<GroupControllerProps> = ({
  groupId,
  scope,
  ...props
}) => {
  const registryId = useMemo(() => {
    return `group_view_${scope.slug}_${groupId}`;
  }, [groupId, scope.slug]);

  const { timeState } = useTimeContext();

  const { projectDescription } = useProjectLoader(
    scope.slug,
    timeState.from,
    timeState.to
  );

  const registry = useThermalRegistry(registryId);

  const [g, setGroup] = useState<ThermalGroup | undefined>(undefined);

  useEffect(() => {
    registry.groups.addListener(registryId, (value) => {
      setGroup(registry.groups.map.get(registryId));
    });

    return () => registry.groups.removeListener(registryId);
  }, [registry]);

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

  const [highlight, setHighlight] = useState<
    TemperatureHighlightType | undefined
  >(undefined);

  useEffect(() => {
    g?.cursorPosition.addListener(registryId, (value) => {
      if (value !== undefined) {
        const hl: { [index: number]: number } = {};

        g.instances.forEveryInstance((instance) => {
          hl[instance.timestamp] = instance.getTemperatureAtPoint(
            value.x,
            value.y
          );
        });

        setHighlight(hl);
      } else {
        setHighlight(undefined);
      }
    });

    return () => g?.cursorPosition.removeListener(registryId);
  }, [g]);

  return (
    <div>

      <Toolbar
        label={`Podrobnosti`}
        classes={{
          container: "bg-slate-200",
        }}
        persistentContent={
          <>
            <div className="px-4 pb-4 -mt-6">
              <TemperatureScaleBase hasButtons={false} registry={registry} />
            </div>
            <div className="relative">
              <GraphContextProvider>
                <GraphWithGlobalTime
                  defaultGraphs={["temperature"]}
                  scope={scope}
                  hasZoom={false}
                  temperatureHighlight={highlight}
                />
              </GraphContextProvider>
            </div>
          </>
        }
        close={{ href: `/project/${scope.slug}/thermo`, tooltip: "Zavřít projekt" }}
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

      <div></div>
      <GroupDisplay registry={registry} scopeId={scope.slug} columns={10} />
    </div>
  );
};
