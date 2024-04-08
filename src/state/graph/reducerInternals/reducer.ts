import { Properties } from "@/graphql/weather/definitions/properties";
import { Reducer } from "react";
import { AddGraphPayload, GraphActions, GraphStateActionBase, SetSharedScalePayload, SetInstanceDomainPayload, SetInstanceHeightPayload, SetInstancePropertyPayload, RemoveGraphPayload, RemoveGraphAction } from "./actions";
import { GraphDomain, GraphInstanceScales, GraphInstanceState, GraphStackState, GraphStateFactory } from "./storage";

export const useGraphStackReducer: Reducer<GraphStackState, GraphStateActionBase> = (state, action) => {


    const updatedInstances = (
        callback: ((instance: GraphInstanceState) => GraphInstanceState)
    ) => {
        return Object.fromEntries(Object.entries(state.graphs).map(([key, entry]) => {
            const newEntry = callback(entry);
            return [key, newEntry];
        }));
    }

    const getSharedScale = (current: GraphStackState) => {

        let shared = Object.values(current.graphs).reduce((st: undefined | false | GraphInstanceScales, curr) => {

            if (st === undefined) return curr.scale;
            if (st === curr.scale) return st;
            // if ( st === false ) return st;
            return false;

        }, undefined);

        if (shared === false)
            return undefined;

        return shared;

    }

    switch (action.type) {

        case GraphActions.ADD_GRAPH:

            const { property: propertyAdd }: AddGraphPayload = action.payload;

            const newState = {
                ...state,
                graphs: {
                    ...state.graphs,
                    [propertyAdd]: GraphStateFactory.defaultInstanceState(propertyAdd, state.sharedScale)
                }
            }

            const newAProps = state.availableGraphs.filter(property => !Object.keys(newState.graphs).includes(property.slug));

            newState.availableGraphs = newAProps;

            return newState;
        case GraphActions.REMOVE_GRAPH:

            const { property: propertyRemove }: RemoveGraphPayload = action.payload;

            const updatedState = {
                ...state,
                graphs: Object.fromEntries(Object.entries(state.graphs)
                    .filter(([key, graph]) => key !== propertyRemove))
            }

            const updatedAvailableProps = Properties.all().filter(property => !Object.keys(updatedState.graphs).includes(property.slug));

            updatedState.availableGraphs = updatedAvailableProps;

            return updatedState;


        case GraphActions.RESET_ALL:
            return GraphStateFactory.defaultState();


        case GraphActions.SET_SHARED_SCALE:
            const { scale: scaleSetAll }: SetSharedScalePayload = action.payload;
            return {
                ...state,
                sharedScale: scaleSetAll,
                graphs: updatedInstances(instance => {
                    return {
                        ...instance,
                        scale: scaleSetAll
                    }
                })
            }

        case GraphActions.SET_INSTANCE_DOMAIN:

            const { property: propertyDomain, domain, range }: SetInstanceDomainPayload = action.payload;

            const entry = state.graphs[propertyDomain]!;

            let d: Array<number | "auto"> = ["auto", "auto"];

            if (domain === GraphDomain.DEFAULT) {
                d = [entry.property.min!, entry.property.max!]
            }

            if (domain === GraphDomain.MANUAL) {

                if (entry.domainMin === "auto" )
                    d[0] = entry.property.min!;
                if (entry.domainMax === "auto")
                    d[1] = entry.property.max!;

                if (range) {
                    d = [range.min, range.max]
                } else {
                    d = [entry.property.min ?? "auto", entry.property.max ?? "auto"]
                }
            }

            return {
                ...state,
                graphs: {
                    ...state.graphs,
                    [propertyDomain]: {
                        ...state.graphs[propertyDomain],
                        domain,
                        domainMin: d[0],
                        domainMax: d[1]
                    }
                }
            }

        case GraphActions.SET_INSTANCE_HEIGHT:

            const { scale, property: propertyHeight }: SetInstanceHeightPayload = action.payload;

            const st = {
                ...state,
                graphs: {
                    ...state.graphs,
                    [propertyHeight]: {
                        ...state.graphs[propertyHeight],
                        scale: scale
                    }
                }
            }

            st.sharedScale = getSharedScale(st);

            return st;

        case GraphActions.SET_INSTANCE_PROPERTY:
            const { fromProperty, toProperty }: SetInstancePropertyPayload = action.payload;

            const newGraphs = Object.fromEntries(Object.entries(state.graphs)
                .map(([key, entry]) => {

                    if (key !== fromProperty)
                        return [key, entry];

                    const definition = Properties.one(toProperty);

                    const newProperty = [toProperty, {
                        ...entry,
                        property: definition,
                        domain: GraphDomain.DEFAULT,
                        domainMin: definition.min,
                        domainMax: definition.max,
                    }];

                    return newProperty;

                }));

            const newAvailableProperties = Properties.all().filter(property => !Object.keys(newGraphs).includes(property.slug))

            return {
                ...state,
                availableGraphs: newAvailableProperties,
                graphs: newGraphs
            }

        case GraphActions.SELECT_TOOL:
            return {
                ...state,
                activeTool: action.payload.tool
            }

        case GraphActions.SELECTION_START:
            return {
                ...state,
                isSelecting: true,
                selectionStart: action.payload.timestamp,
                selectionEnd: undefined,
                graphs: Object.fromEntries(Object.entries(state.graphs)
                    .map(([key, entry]) => {

                        if (key === action.payload.property) {
                            return [
                                key,
                                {
                                    ...entry,
                                    isSelecting: true
                                }
                            ]
                        }

                        return [key, entry]
                    })
                )
            }

        case GraphActions.SELECTION_END:
            return {
                ...state,
                isSelecting: false,
                selectionEnd: action.payload.timestamp,
                graphs: Object.fromEntries(Object.entries(state.graphs)
                    .map(([key, entry]) => {

                        if (key === action.payload.property) {
                            return [
                                key,
                                {
                                    ...entry,
                                    isSelecting: false
                                }
                            ]
                        }

                        return [key, entry]
                    })
                )
            }

        case GraphActions.SELECTION_REMOVE:
            return {
                ...state,
                isSelecting: false,
                selectionStart: undefined,
                selectionEnd: undefined
            }

        case GraphActions.BAR_SET_EXPANDED:
            return {
                ...state,
                barExpanded: action.payload as boolean
            }

        case GraphActions.BAR_SET_CONTENT:
            return {
                ...state,
                barContent: action.payload.content
            }

        case GraphActions.SET_TOUR_PASSED_STATE:
            return {
                ...state,
                tourPassed: action.payload.tourState,
                tourCurrentStep: action.payload.tourState ? 0 : state.tourCurrentStep
            }

        case GraphActions.SET_TOUR_RUNNING:
            return {
                ...state,
                tourActive: action.payload.tourRunning
            }

        case GraphActions.SET_TOUR_CURRENT_STEP:
            return {
                ...state,
                tourCurrentStep: action.payload.currentStep
            }


        default:
            return state;


    }

}