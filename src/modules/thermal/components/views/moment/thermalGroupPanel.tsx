"use client";

import { useThermalObjectPurpose } from "@/modules/thermal/context/useThermalObjectPurpose";
import { ThermalGroup } from "@/modules/thermal/registry/ThermalGroup";
import { useThermalGroupInstancesState } from "@/modules/thermal/registry/properties/lists/instances/useThermalGroupInstancesState";
import { useThermalRegistryLoadingState } from "@/modules/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalGroupMinmaxProperty } from "@/modules/thermal/registry/properties/states/minmax/group/useThermalGroupMinmaxState";
import { ThermalInstance } from "../../instance/thermalInstance";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { TableHeader, TableColumn, TableBody, TableCell, Snippet, Table, TableRow, cn, Tooltip, Button, Spinner } from "@nextui-org/react";
import { usePanelWidth } from "../../controls/panelWidth/usePanelWidth";
import { useState } from "react";
import { useExportImage } from "@/utils/exports/useExportImage";
import { TemperatureScaleBase } from "../../controls/scale/internals/ThermalRangeSlider";

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

    const [isPrinting, setIsPrinting] = useState<boolean>(false);

    const { download, printingState } = useExportImage(
        `#${ID}`,
        () => {
            return [
                props.scopeId,
                props.group.name,
            ].join(" - ");
        },
        () => {
            setIsPrinting(true);
        },
        () => {
            setIsPrinting(false);
        }
    );

    return <div className="w-1/3 px-2">
        <div className="bg-white rounded-t-xl" id={ID}>

            <div className="px-4 pt-4">

                <div className="flex items-center gap-2">

                    <h1 className=" flex-grow text-xl font-bold">{props.group.name ?? props.group.id}</h1>

                    {isPrinting === false &&
                        <Tooltip
                            content="Exportovat skupinu jako jeden obrázek"
                            color="foreground"
                            isDisabled={printingState.isLoading}
                        >
                            <Button
                                isIconOnly
                                size="sm"
                                variant="faded"
                                onClick={() => {
                                    if (printingState.isLoading === false)
                                        download();
                                }}
                            >
                                {printingState.isLoading
                                    ? <Spinner size="sm" />
                                    : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path d="M13.75 7h-3v5.296l1.943-2.048a.75.75 0 0 1 1.114 1.004l-3.25 3.5a.75.75 0 0 1-1.114 0l-3.25-3.5a.75.75 0 1 1 1.114-1.004l1.943 2.048V7h1.5V1.75a.75.75 0 0 0-1.5 0V7h-3A2.25 2.25 0 0 0 4 9.25v7.5A2.25 2.25 0 0 0 6.25 19h7.5A2.25 2.25 0 0 0 16 16.75v-7.5A2.25 2.25 0 0 0 13.75 7Z" />
                                    </svg>
                                }

                            </Button>
                        </Tooltip>
                    }

                </div>

            </div>

            {isPrinting === true && <div className="pb-4">
                <TemperatureScaleBase
                    registry={props.group.registry}
                    hasButtons={false}
                    histogramBorder={false}
                />
            </div>}

            <div className={panelWidth} >
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

                        {minmax !== undefined &&
                            <span className={cn(
                                "text-gray-400",
                                props.columns >= 4 && "hidden"
                            )}>

                                {instance.min.toFixed(2)} - {instance.max.toFixed(2)} °C
                            </span>
                        }

                        {minmax !== undefined &&

                            <span className={cn(
                                "text-gray-300",
                                props.columns >= 3 && "hidden"
                            )}>{instance.width} x {instance.height} px
                            </span>
                        }

                    </div>

                </ThermalInstance>

                )}
            </div>


        </div>

    </div>

}

