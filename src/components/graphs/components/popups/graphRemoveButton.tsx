"use client";

import { CloseIcon } from "@/components/ui/icons";
import { useGraphContext } from "@/state/graph/graphContext";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { GraphInstanceState } from "@/state/graph/reducerInternals/storage";
import { Button, ButtonGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { GraphSettingButton } from "../ui/graphSettingButton";

export const GraphRemoveButton: React.FC<GraphInstanceState> = props => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { graphDispatch } = useGraphContext();

    return <>

        <GraphSettingButton id={`${props.id}remove`} onClick={onOpen} active={false} tooltip={"Nastavení grafu"}>

            <CloseIcon />

        </GraphSettingButton>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Smazat graf</ModalHeader>
                        <ModalBody>

                            <p>Opravdu chcete odstranit graf {props.property.name}?</p>

                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup>
                                <Button color="primary" onPress={() => {
                                    graphDispatch(StackActions.removeGraph(props.property.slug))
                                    onClose();
                                }}>
                                    Ano
                                </Button>
                                <Button
                                    variant="bordered"
                                    onClick={() => {
                                        onClose();
                                    }}
                                >
                                    Ne
                                </Button>

                            </ButtonGroup>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}