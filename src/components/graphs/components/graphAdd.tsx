"use client";

import { useGraphContext } from "@/state/graph/graphContext"
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

export const GraphAdd: React.FC = () => {

    const { graphState, graphDispatch } = useGraphContext();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    if (graphState.availableGraphs.length === 0)
        return <></>

    return <>
    <div className="p-3 md:px-20 lg:px-40">
        <div
            className="w-full border-1 border-gray-400 border-dashed rounded-xl flex items-center justify-center h-[20vh] bg-gray-100 hover:bg-white cursor-pointer ease-in-out transition-all duration-300 group"
            role="button"
            onClick={onOpen}
        >
            <div
                className="px-5 py-3 bg-default rounded-lg group-hover:bg-default-200 transition-all duration-300 ease-in-out"
            >Přidat graf</div>
        </div>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>

            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Přidat graf</ModalHeader>
                        <ModalBody>

                            {graphState.availableGraphs.map(state => {
                                return <Button
                                    key={state.slug}
                                    onClick={() => {
                                        graphDispatch(StackActions.addGraph(state.slug));
                                        onClose();
                                    }}
                                >{state.name}</Button>
                            })}

                        </ModalBody>

                    </>
                )}
            </ModalContent>

        </Modal>
    </>

}