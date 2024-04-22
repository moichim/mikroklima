"use client";

import { useThermalObjectPurpose } from "@/modules/thermal/context/useThermalObjectPurpose";
import { ThermalGroup } from "@/modules/thermal/registry/ThermalGroup";
import { useThermalGroupInstancesState } from "@/modules/thermal/registry/properties/lists/instances/useThermalGroupInstancesState";
import { useThermalRegistryLoadingState } from "@/modules/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalGroupMinmaxProperty } from "@/modules/thermal/registry/properties/states/minmax/group/useThermalGroupMinmaxState";
import { MinmaxTable } from "../../dataViews/minmaxTable";
import { ThermalInstance } from "../../instance/thermalInstance";
import { useRouter } from "next/navigation";
import { Button, Spinner, Tooltip, cn } from "@nextui-org/react";
import { usePanelWidth } from "../../controls/panelWidth/usePanelWidth";
import { useRef, useState } from "react";
import { useExportImage } from "@/utils/exports/useExportImage";
import { TemperatureScaleBase } from "../../controls/scale/internals/ThermalRangeSlider";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { useTimeContext } from "@/modules/time/timeContext";

type ThermalGroupPanelProps = {
    group: ThermalGroup,
    scopeId: string,
    columns: number
}

export const ThermalGroupPanel: React.FC<ThermalGroupPanelProps> = props => {

    const ID = useThermalObjectPurpose(props.group, "panel");

    const { timeState: time } = useTimeContext();

    const router = useRouter();

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
                TimeFormat.humanRangeDates(time.from, time.to)
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

            <div className="p-4">

                <div className="flex items-center gap-2">

                    <h1 className="flex-grow text-xl font-bold pb-2">{props.group.name ?? props.group.id}</h1>

                    {isPrinting === true && <div className="text-sm">{TimeFormat.humanRangeDates(time.from, time.to)}</div>}

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
                                    if ( printingState.isLoading === false )
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


            {isPrinting === true && <div className="pb-4">
                <TemperatureScaleBase
                    registry={props.group.registry}
                    hasButtons={false}
                    histogramBorder={false}
                />
            </div>}


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
                    onClick={(i) => {

                        const url = `/project/${props.scopeId}/thermo/moment/${instance.timestamp + 1}`;

                        router.push(url);
                        
                    }}
                />)}

            </div>

        </div>

    </div>

}

