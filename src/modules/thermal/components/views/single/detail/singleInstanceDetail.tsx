"use client";

import { OpacitySlider } from "@/modules/thermal/components/controls/opacity/OpacitySlider";
import { PaletteDropdown } from "@/modules/thermal/components/controls/palette/paletteDropdown";
import { TemperatureScaleBase } from "@/modules/thermal/components/controls/scale/internals/ThermalRangeSlider";
import { useThermalObjectPurpose } from "@/modules/thermal/context/useThermalObjectPurpose";
import { ThermalFileInstance } from "@/modules/thermal/file/ThermalFileInstance";
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Snippet, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { ThermalInstance, ThermalInstanceDisplayParameters } from "../../../instance/thermalInstance";
import { SingleInstanceDownloadButtons } from "./singleInstanceDownloadButtons";
import { useMemo, useState } from "react";
import { useExportImage } from "@/utils/exports/useExportImage";
import { HistogramAutoButton } from "../../../controls/scale/histogram/settings/histogramAutoButton";
import { HistogramFullButton } from "../../../controls/scale/histogram/settings/histogramFullButton";
import Link from "next/link";

type SingleInstanceDetailProps = ThermalInstanceDisplayParameters & {
    instance: ThermalFileInstance,
    hasDownloadButtons?: boolean,
    purpose?: string,
    name: string
}

export const SingleInstanceDetail: React.FC<SingleInstanceDetailProps> = ({

    instance,
    hasDownloadButtons = true,
    purpose = undefined,
    name,

    hasPopup = false,
    showDateOnHighlight = true,
    syncTimeHighlight = true,
    highlightColor = undefined,
    highlightOnHover = true,
    forceHighlight = false,

    ...props
}) => {


    const ID = useThermalObjectPurpose(instance, "detail");

    const { value: minmax } = useThermalRegistryMinmaxState(instance.group.registry, ID);

    const loading = instance.group.registry.loading.value;


    const [isPrinting, setIsPrinting] = useState<boolean>(false);

    const downloadId = useMemo(() => {
        return ["instance", instance.timestamp].join("_");
    }, [instance]);

    const { download, printingState } = useExportImage(
        `#${downloadId}`,
        () => {
            return [
                name,
                TimeFormat.human( instance.timestamp )
                    .replaceAll(". ", "-")
                    .replaceAll(":", "-")
                    .replaceAll(" ", "_"),
                `${instance.group.registry.range.value?.from.toFixed(1)} až ${instance.group.registry.range.value?.to.toFixed(1)} °C`,
                instance.group.registry.palette.value
            ].join(" - ");
        },
        () => {
            setIsPrinting(true);
        },
        () => {
            setIsPrinting(false);
        }
    );



    return <>

        <div className="w-full flex flex-wrap items-center gap-2">
            <div className="flex-grow">
                <OpacitySlider registry={instance.group.registry} />
            </div>
            <div className="">
                <PaletteDropdown registry={instance.group.registry} />
            </div>
            <HistogramFullButton registry={instance.group.registry} />
            <HistogramAutoButton registry={instance.group.registry} minHeight={3} />
            <Tooltip content="Stáhnout termogram" color="foreground">
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            isIconOnly
                            isDisabled={printingState.isLoading}
                        >
                            {printingState.isLoading
                                ? <Spinner size="sm" />
                                : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M13.75 7h-3v5.296l1.943-2.048a.75.75 0 0 1 1.114 1.004l-3.25 3.5a.75.75 0 0 1-1.114 0l-3.25-3.5a.75.75 0 1 1 1.114-1.004l1.943 2.048V7h1.5V1.75a.75.75 0 0 0-1.5 0V7h-3A2.25 2.25 0 0 0 4 9.25v7.5A2.25 2.25 0 0 0 6.25 19h7.5A2.25 2.25 0 0 0 16 16.75v-7.5A2.25 2.25 0 0 0 13.75 7Z" />
                                </svg>
                            }
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu

                        onAction={key => {
                            if (key === "export") {
                                if (printingState.isLoading === false)
                                    download();
                            }
                        }}
                    >

                        <DropdownItem
                            key="export">
                            Exportovat termogram (PNG)
                        </DropdownItem>

                        <DropdownItem
                            key="visible"
                            as={Link}
                            href={instance.visibleUrl}
                            download
                            target="_blank"
                        >
                            Stáhnout visible obrázek (PNG)
                        </DropdownItem>

                        <DropdownItem
                            key="lrc"
                            as={Link}
                            href={instance.url}
                            download
                            target="_blank"
                        >
                            Stáhnout zdrojový soubor (LRC)
                        </DropdownItem>
                    </DropdownMenu>

                </Dropdown>
            </Tooltip>
        </div >

        <div id={downloadId}>
            <div className="pb-6">
                <div className="w-full pt-2">
                    <TemperatureScaleBase
                        registry={instance.group.registry}
                        histogramBorder={false}
                        hasButtons={false}
                    />
                </div>

            </div>

            <div className="pb-0 -mb-2">

                <ThermalInstance

                    instance={instance}

                    // This instance should have full length allways
                    className="w-full"

                    hasPopup={hasPopup}
                    showDateOnHighlight={showDateOnHighlight}
                    highlightColor={highlightColor}
                    highlightOnHover={highlightOnHover}
                    forceHighlight={forceHighlight}
                    scopeId={""}
                />

            </div>

        </div>

        <div className="pt-6">

            <Table
                aria-label="Shrnutí vlastností termogramu"
                removeWrapper
                hideHeader
                fullWidth
            // isCompact
            >
                <TableHeader>
                    <TableColumn>Vlastnost</TableColumn>
                    <TableColumn>Hodnota</TableColumn>
                </TableHeader>

                <TableBody
                    isLoading={loading || minmax === undefined}
                >

                    <TableRow key="time">
                        <TableCell>Čas snímku</TableCell>
                        <TableCell>{TimeFormat.human(instance.timestamp)}</TableCell>
                    </TableRow>


                    <TableRow key="min">
                        <TableCell>Minimum</TableCell>
                        <TableCell>
                            {minmax !== undefined
                                ? <>{minmax.min.toFixed(4)} °C</>
                                : "načítám"
                            }
                        </TableCell>
                    </TableRow>
                    <TableRow key="max">
                        <TableCell>Maximum</TableCell>
                        <TableCell>
                            {minmax !== undefined
                                ? <>{minmax.max.toFixed(4)} °C</>
                                : "načítám"
                            }
                        </TableCell>
                    </TableRow>

                    <TableRow key="resolution">
                        <TableCell>Rozlišení</TableCell>
                        <TableCell>{instance.width} x {instance.height} px</TableCell>
                    </TableRow>

                    <TableRow key="signature">
                        <TableCell>Signatura</TableCell>
                        <TableCell>{instance.signature}</TableCell>
                    </TableRow>

                </TableBody>

            </Table>

        </div>

        {
            hasDownloadButtons && <>
                <SingleInstanceDownloadButtons
                    thermalUrl={instance.url}
                    visibleUrl={instance.visibleUrl}
                    downloadAction={() => download()}
                />

            </>
        }
    </>

}