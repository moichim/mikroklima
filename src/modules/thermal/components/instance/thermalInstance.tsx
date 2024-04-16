"use client";

import { ThermalFileInstance } from "@/modules/thermal/file/ThermalFileInstance";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SingleController } from "../views/single/singleController";
import { SingleInstanceDownloadButtons } from "../views/single/detail/singleInstanceDownloadButtons";
import { useInstanceWidth } from "./useInstanceWidth";

export type ThermalInstanceDisplayParameters = {
    hasPopup?: boolean,
    showDateOnHighlight?: boolean,
    syncTimeHighlight?: boolean,
    highlightColor?: string,
    highlightOnHover?: boolean,
    forceHighlight?: boolean
}

type ThermalInstanceProps = ThermalInstanceDisplayParameters & React.PropsWithChildren & {
    scopeId: string,
    instance: ThermalFileInstance,
    className?: string,
    onClick?: (instance: ThermalFileInstance) => void,
    columns?: number
}

/** 
 * Displays an instance
 * 
 * Creates the DOM inside which the instance shall be rendered.
*/
export const ThermalInstance: React.FC<ThermalInstanceProps> = ({
    className = "",
    instance,

    hasPopup = false,
    showDateOnHighlight = true,
    syncTimeHighlight = true,
    highlightColor = undefined,
    highlightOnHover = true,
    forceHighlight = false,
    onClick = undefined,

    columns = 1,
    children,

    ...props
}) => {

    const ref = useRef<HTMLDivElement>(null);


    // Mounting and unmounting
    useEffect(() => {

        if (ref.current) {
            instance.mountToDom(ref.current);
            instance.draw();
        }

        return () => instance.unmountFromDom();

    }, [instance]);


    // Propagate the current popup state
    useEffect(() => {

        if (hasPopup === true) {
            instance.setClickHandler();
            instance.setHoverCursor("hand");
        } else {
            instance.setHoverCursor("default");
            instance.setClickHandler();
        }

    }, [hasPopup, instance]);


    // Propagate date on highlight display
    useEffect(() => {

        if (showDateOnHighlight !== instance.showDateOnHighlight)
            instance.setShowDateOnHighlight(showDateOnHighlight);

    }, [showDateOnHighlight, instance]);

    // Propagate the time highlight synchronisation
    useEffect(() => {

        if (syncTimeHighlight !== instance.timeHighlightSync)
            instance.setTimeHiglightSync(syncTimeHighlight)

    }, [syncTimeHighlight, instance]);

    // Propagate the highlight color
    useEffect(() => {

        if (highlightColor !== instance.highlightColor)
            instance.setHighlightColor(highlightColor);

    }, [highlightColor, instance]);

    // Propagate the highlight on hover
    useEffect(() => {

        if (highlightOnHover !== instance.highlightOnHover)
            instance.setHighlightOnHover(highlightOnHover);

    }, [highlightOnHover, instance]);

    // Propagate the force highlight state
    useEffect(() => {

        if (forceHighlight !== instance.forceHighlight)
            instance.setForceHighlight(forceHighlight);

    }, [forceHighlight, instance]);


    // The popup open state
    const [popupOpen, setPopupOpen] = useState<boolean>(false);

    const router = useRouter();

    // Has popup propagation
    useEffect(() => {

        if (hasPopup === true) {
            instance.setClickHandler(() => {

                // const url = `/project/${props.scopeId}/thermo/${instance.timestamp + 1}`;

                // router.push( url );

                setPopupOpen(!popupOpen);

            });
        }

        return () => instance.setClickHandler();

    }, [hasPopup, popupOpen, setPopupOpen, instance]);


    // Add click handler
    useEffect(() => {

        if (onClick !== undefined) {
            instance.setClickHandler(() => {
                onClick(instance);
            });
        }

        return () => instance.setClickHandler();

    }, [onClick, instance]);



    return <>
        <div className={cn("-m-[2px]")} >
            {/** Optionally output the fhildren */}
            {children && <div className="mx-[2px]">
                {children}
            </div>}
            {/** Output the main element */}
            <div
                ref={ref}
                className={"relative p-0 m-0"}
            >
            </div>
        </div>
        <Modal
            isOpen={popupOpen}
            onOpenChange={setPopupOpen}
            size="2xl"
            backdrop="blur"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            {instance.group.name ?? instance.group.id}: {TimeFormat.human(instance.timestamp)}
                        </ModalHeader>
                        <ModalBody>

                            <SingleController

                                name={instance.group.name ?? instance.group.id}

                                thermalUrl={instance.url}
                                visibleUrl={instance.visibleUrl}

                                hasPopup={false}
                                showDateOnHighlight={false}
                                syncTimeHighlight={false}
                                highlightOnHover={false}

                                hasDownloadButtons={false}

                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                onClick={onClose}
                                color="primary"
                            >Zavřít</Button>
                        </ModalFooter>

                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}