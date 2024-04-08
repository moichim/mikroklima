import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { AbstractProperty, IBaseProperty } from "../../abstractProperty";

export interface IWithAnalysis extends IBaseProperty {

    analysis: AnalysisState

}

type AnalysisValue = {
    min: number,
    minX: number,
    minY: number

    max: number,
    maxX: number,
    maxY: number,

    avg: number
}

export class AnalysisState extends AbstractProperty< AnalysisValue, ThermalGroup > {

    protected validate(value: AnalysisValue): AnalysisValue {
        throw new Error("Method not implemented.");
    }
    protected afterSetEffect(value: AnalysisValue) {
        throw new Error("Method not implemented.");
    }

}