"use client";

import { useGraphContext } from "@/state/graph/graphContext";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { Button } from "@nextui-org/react";
import { PropsWithChildren } from "react";
import { BarContainer } from "./barContainer";
import { GraphSizesButtonGroup } from "./graphSizesButtonGroup";

export const Bar: React.FC<PropsWithChildren> = props => {

    const { graphDispatch } = useGraphContext();

    return <div className="w-full bottom-0 left-0 fixed lg:p-5 z-10">
        <div className="lg:rounded-xl shadow-2xl bg-foreground text-background p-3 bg-opacity-90 lg:bg-opacity-90">
            <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">

                <BarContainer id="barSizing" label="Nastavit velikost grafů">
                    <GraphSizesButtonGroup />
                </BarContainer>

                <BarContainer id="barTour" label="Nápověda">
                    <Button
                        onClick={() => graphDispatch(StackActions.setTourRunning(true))}
                    >Prohlídka funkcí</Button>
                </BarContainer>
                
            </div>
        </div>
    </div>

}