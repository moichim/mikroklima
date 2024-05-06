"use client";

import { useProjectLoader } from "@/modules/thermal/context/useProjectLoader";
import { useThermalRegistry } from "@/modules/thermal/context/useThermalRegistry";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OpacitySlider } from "../../controls/opacity/OpacitySlider";
import { PaletteDropdown } from "../../controls/palette/paletteDropdown";
import { TemperatureScaleBase } from "../../controls/scale/internals/ThermalRangeSlider";
import { Navbar } from "@/components/ui/navigation/Navbar";
import { RegistryDisplay } from "../project/registryDisplay";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { TimeDisplay } from "./timeDisplay";
import { PanelWidthDropdown } from "../../controls/panelWidth/panelWidthDropdown";
import { useExportImage } from "@/utils/exports/useExportImage";
import { Button } from "@nextui-org/react";
import { Toolbar } from "@/components/ui/toolbar/Toolbar";
import { HistogramAutoButton } from "../../controls/scale/histogram/settings/histogramAutoButton";
import { HistogramFullButton } from "../../controls/scale/histogram/settings/histogramFullButton";

type TimeControllerProps = {
  scopeId: string;
  from: number;
  to: number;
};

export const TimeController: React.FC<TimeControllerProps> = ({ ...props }) => {
  const registryId = useMemo(() => {
    return `${props.scopeId}_${props.from}_${props.to}`;
  }, [props.scopeId]);

  const { projectDescription } = useProjectLoader(
    props.scopeId,
    props.from,
    props.to
  );

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

  const [panelWidth, setPanelWidth] = useState<number>(1);

  // Every time the folder is loaded, automatically calculate the width of the panel
  useEffect(() => {
    const max = Object.values(projectDescription).reduce((state, current) => {
      if (current.files.length > state && current.files.length < 5) {
        return current.files.length;
      }

      return state;
    }, 0);

    setPanelWidth(max);
  }, [projectDescription]);

  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const { download, printingState } = useExportImage(
    `#export`,
    () => {
      return ["ahoj"].join(" - ");
    },
    () => {
      setIsPrinting(true);
    },
    () => {
      setIsPrinting(false);
    }
  );

  return (
    <div>
      <Toolbar
        label={
          <>
            <div>Termogramy</div>
            <div>ze {TimeFormat.humanDate(props.to)}</div>
          </>
        }
        classes={{
          container: "bg-slate-200",
        }}
        persistentContent={
          <div className="px-4 pb-4 -mt-6">
            <TemperatureScaleBase hasButtons={false} registry={registry} />
          </div>
        }
        close={{
          href: `/project/${props.scopeId}/thermo`,
          tooltip: "Zavřít projekt",
        }}
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
        <TimeDisplay
          registry={registry}
          scopeId={props.scopeId}
          columns={panelWidth}
        />
      </div>
    </div>
  );
};
