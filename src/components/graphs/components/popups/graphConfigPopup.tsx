"use client";

import { SettingIcon } from "@/components/ui/icons";
import { useGraphContext } from "@/state/graph/graphContext";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { GraphDomain, GraphInstanceState } from "@/state/graph/reducerInternals/storage";
import { Badge, Button, ButtonGroup, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, useDisclosure } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { GraphSettingButton } from "../ui/graphSettingButton";

export const GraphConfigPopup: React.FC<GraphInstanceState> = props => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { graphDispatch } = useGraphContext();

    const [minInternal, setMinInternal] = useState<string>(props.property.min!.toString());
    const [maxInternal, setMaxInternal] = useState<string>(props.property.max!.toString());

    const translateRangeValue = useCallback((value: string) => {

        let v: number | string = value;

        if (
            value === ""
            || value === undefined
            || value === null
            || value === " "
        ) {
            v = "auto";
        } else {
            v = parseFloat(value);
        }

        return v as number | "auto";

    }, []);

    const isValidValue = useCallback((value: string) => {
        const floatRegex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
        return floatRegex.test(value);
    }, []);

    const sanitizeValue = useCallback((value: string) => {

        const parsed = parseFloat(value);

        return isNaN(parsed) ? null : parsed;

    }, []);


    // Synchronise context to local
    useEffect(() => {
        if (props.domain === GraphDomain.MANUAL) {
            if (minInternal !== props.domainMin)
                setMinInternal(props.domainMin.toString());
            if (maxInternal !== props.domainMax)
                setMaxInternal(props.domainMax.toString());
        }
    }, [props.domain, props.domainMin, props.domainMax, minInternal, maxInternal]);



    // Synchronise local to context
    useEffect(() => {

        const isValidMin = isValidValue(minInternal);
        const isValidMax = isValidValue(maxInternal);

        // If the value is not valid, prevent any action and correct the value
        if (!isValidMin || !isValidMax) {
            if (!isValidMin) {
                const sanitized = sanitizeValue(minInternal);
                setMinInternal(sanitized ? sanitized.toString() : props.property.min!.toString());
            }
            if (!isValidMax) {
                const sanitized = sanitizeValue(maxInternal);
                setMaxInternal(sanitized ? sanitized.toString() : props.property.max!.toString());
            }
            return;
        }

        if (parseFloat(minInternal) > parseFloat(maxInternal)) {
            setMinInternal(maxInternal);
            setMaxInternal(minInternal);
            return;
        }


        if (props.domain === GraphDomain.MANUAL) {
            graphDispatch(StackActions.setInstanceDomain(
                props.property.slug,
                GraphDomain.MANUAL,
                translateRangeValue(minInternal),
                translateRangeValue(maxInternal)
            ))
        }

    }, [minInternal, maxInternal, props.domain, props.property.max, props.property.min, props.property.slug, graphDispatch, isValidValue, sanitizeValue, translateRangeValue]);

    const isDefault = props.domain === GraphDomain.AUTO;

    const setDefault = () => {
        graphDispatch(StackActions.setInstanceDomain(props.property.slug, GraphDomain.AUTO));
    }

    return <>

        <GraphSettingButton id={`${props.id}config`} onClick={onOpen} active={false} tooltip={"Nastavení grafu"}>

            {isDefault
                ? <SettingIcon />
                : <Badge content="" color="secondary" placement="top-right">
                    <SettingIcon />
                </Badge>
            }

        </GraphSettingButton>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{props.property.name}</ModalHeader>
                        <ModalBody>

                            <RadioGroup
                                label="Rozsah hodnot na ose Y"
                                onValueChange={value => {
                                    graphDispatch(StackActions.setInstanceDomain(props.property.slug, value as any));
                                }}
                                value={props.domain.toString()}
                            >
                                <Radio value={GraphDomain.DEFAULT.toString()} description="Doporučeno.">{props.property.min} - {props.property.max} {props.property.unit}</Radio>
                                <Radio value={GraphDomain.AUTO.toString()} description="Rozsah se upraví dle nejvyšší a nejnižší zobrazené hodnoty.">Automaticky</Radio>
                                {/*<Radio value={GraphDomain.MANUAL.toString()} description="Zadejte minimální a maximální hodnotu na ose Y.">Vlastní rozsah</Radio> */}
                            </RadioGroup>

                            {props.domain === GraphDomain.MANUAL &&

                                <div className="flex w-full gap-3">
                                    <Input
                                        type="number"
                                        label="Min"
                                        value={minInternal}
                                        onValueChange={setMinInternal}
                                    />
                                    <Input
                                        type="number"
                                        label="Max"
                                        value={maxInternal}
                                        onValueChange={setMaxInternal}
                                    />
                                </div>

                            }

                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup>
                                {!isDefault &&
                                    <Button
                                        variant="bordered"
                                        onClick={() => {
                                            setDefault();
                                            onClose();
                                        }}
                                    >
                                        Obnovit výchozí nastavení
                                    </Button>
                                }
                                <Button color="primary" onPress={onClose}>
                                    OK
                                </Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}