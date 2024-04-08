import { ThermalFileInstance } from "../../file/ThermalFileInstance";
import { AbstractInstanceAnalysis } from "../abstractAnalysis";

export class RectAnalysis extends AbstractInstanceAnalysis {

    protected tl: {x: number, y: number};
    protected br: {x:number,y: number};

    public static startSelecting(
        file: ThermalFileInstance,
        x: number,
        y: number
    ) {

        const instance = new RectAnalysis( file, {
            min: NaN,
            max: NaN,
            minX: x,
            maxX: x,
            minY: y,
            maxY: y,
            avg: NaN,
            centerX: x,
            centerY: y
        } );

    }

    public startGrabbing(
        x: number,
        y: number
    ) {

    }

    public endGrabbing(
        x: number,
        y: number
    ) {



    }

    public onDragCenter(
        x: number,
        y: number
    ) {

        const newTL = 

    }



    protected getPixels(): number[] {
        throw new Error("Method not implemented.");
    }
    protected forEveryPixel(fn: (pixel: number, x: number, y: number) => any) {
        throw new Error("Method not implemented.");
    }
    protected validate(value: { min: number; minX: number; minY: number; max: number; maxX: number; maxY: number; avg: number; }): { min: number; minX: number; minY: number; max: number; maxX: number; maxY: number; avg: number; } {
        throw new Error("Method not implemented.");
    }
    protected afterSetEffect(value: { min: number; minX: number; minY: number; max: number; maxX: number; maxY: number; avg: number; }) {
        throw new Error("Method not implemented.");
    }

    

}