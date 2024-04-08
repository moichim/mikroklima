"use client"

import { Button, Code, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";

export const ThermalAbout: React.FC = () => {

    const [open, setOpen] = useState<boolean>(false);

    return <>
        <Button
            onClick={() => setOpen(true)}
            // color="foreground"
            size="sm"
            variant="faded"
        >O aplikaci</Button>
        <Modal
            isOpen={open}
            onOpenChange={setOpen}
            size="3xl"
        >

            <ModalContent>
                {(onClose) => {
                    return <>

                        <ModalHeader>
                            Hromadné zpracování souborů LRC
                        </ModalHeader>
                        <ModalBody>

                            <p>Zdrojový kód na <Link href="https://github.com/moichim/weather/tree/main/src/thermal" target="_blank" className="text-primary">Githubu</Link>.
                            </p>

                            <Tabs aria-label="Popis aplikace" color="primary">
                                <Tab key="what" title="CO" className="p-4 gap-4 flex flex-col">

                                    <p>Aplikace zpracovává snímky z termokamery <Link href="https://edu.labir.cz" target="_blank" color="primary" className="text-primary">LabIR Edu</Link>. </p>

                                    <p><strong>Souborový formát LRC</strong></p>

                                    <ul className="list-disc ml-4">
                                        <li>Obsahuje teplotní data ve stupních Celsia</li>
                                        <li>Obsahuje časovou značku a další metadata</li>
                                        <li>Souborový formát vznikl na <Link href="https://irt.zcu.cz/cs/" target="_blank" className="text-primary">NTC ZČU v Plzni</Link> pro potřeby vzdělávacích termokamer</li>
                                    </ul>

                                    <p>Snímky z termokamer jsou běžně zobrazovány a vyhodnocovány ve <Link href="https://edu.labir.cz/edukit/software" target="_blank" className="text-primary">specializovaném softwaru</Link>. Uživatel v něm čte teploty, případně mění zobrazení teplotní škály. Limitem existujícíh aplikací je nemožnost hromadného zpracování snímků.</p>

                                    <p>Tato aplikace umožňuje <strong>webové zpracování LRC souborů</strong> a hlavní důraz je ve <strong>zpracování více souborů současně</strong>.</p>

                                    <p>Užití aplikace je vyhodnocování dlouhodobého časosběrného měření.</p>
                                </Tab>
                                <Tab key="how" title="JAK" className="p-4 gap-4 flex flex-col">

                                    <p><strong>Workflow</strong></p>

                                    <ul className="list-decimal ml-4">
                                        <li>Prohlížeč načte LRC soubory ze serveru.</li>
                                        <li>Přečte binární data a vykreslí obrázek v <Code>canvas</Code>.</li>
                                        <li>Uživatel může měnit teplotní škálů u všech souborů zároveň.</li>
                                        <li>Teploty jsou prohlíženy vždy v rámci skupin souborů (nikoliv individuálně).</li>
                                    </ul>

                                    <p><strong>Vrstvy aplikace</strong></p>

                                    <ul className="list-disc ml-4">
                                        <li><strong>Jádro v čistém TypeScriptu</strong>
                                            <ul className="list-disc ml-8">
                                                <li><Code>ThermalRegistry</Code> cachuje načtené soubory a umožňuje hromadně nastavovat skupiny</li>
                                                <li><Code>ThermalGroup</Code> ovládá jednu skupinu snímků</li>
                                                <li><Code>ThermalFileInstance</Code> vykresluje snímek a obsluhuje uživatelské interakce</li>
                                                <li>Registr, skupina a instance mají parametry jako je teplotní škála, rozsah či průhlednost.</li>
                                                <li>Parametry jsou synchronizovány napříč skupinami a instancemi.</li>
                                                <li>Změna parametrů je emitována ven jako JS <Code>Event</Code>.</li>
                                            </ul>
                                        </li>
                                        <li><strong>UI v Reactu</strong>
                                            <ul className="list-disc ml-8">
                                                <li>Globální instance <Code>ThermalRegistry</Code> je držena v kontextu.</li>
                                                <li>React se stará o veškeré vykreslování.</li>
                                                <li>Komponenty mohou přidat své event listenery k registru, skupině či instanci.</li>
                                                <li>Díky event listenerům je možné zrcadlit stav jádra v Reactu.</li>
                                                <li>Parametry jádra je možné nastavovat z Reactovského UI.</li>
                                            </ul>
                                        </li>
                                        <li><strong>Infrastruktura v Next.js</strong>
                                            <ul className="list-disc ml-8">
                                                <li>Webová aplikace běží na Next.js</li>
                                                <li>Dotazy běží přes GraphQl</li>
                                                <li>GraphQL je obsluhováno Apollo serverem, který je v Next.js implementován.</li>
                                            </ul>
                                        </li>
                                    </ul>

                                </Tab>
                            </Tabs>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose} >Zavřít</Button>
                        </ModalFooter>

                    </>
                }}
            </ModalContent>

        </Modal>
    </>

}