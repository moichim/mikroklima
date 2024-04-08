import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { AbstractProperty } from "../registry/properties/abstractProperty";

type AnalysisValue = {
    min: number,
    minX: number,
    minY: number

    max: number,
    maxX: number,
    maxY: number,

    avg: number,

    centerX: number,
    centerY: number
}

export abstract class AbstractInstanceAnalysis extends AbstractProperty<AnalysisValue, ThermalFileInstance> {

    public constructor(
        public readonly parent: ThermalFileInstance,
        public readonly _initial: AnalysisValue
    ) {
        super( parent, _initial );
    }

    protected abstract getPixels(): number[];

    protected abstract forEveryPixel( fn: ( ( pixel: number, x: number, y: number ) => any ) ): any;

    
    public readonly listenerLayer: HTMLDivElement;

    public readonly displayLayer: HTMLDivElement;


}