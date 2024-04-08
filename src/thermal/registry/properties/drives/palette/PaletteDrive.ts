import { ThermalPalettes } from "@/thermal/file/palettes";
import { ThermalRegistry } from "../../../ThermalRegistry";
import { AbstractProperty, IBaseProperty } from "../../abstractProperty";

export type PaletteId = keyof typeof ThermalPalettes;

export interface IWithPalette extends IBaseProperty {
    palette: PaletteDrive
}

export class PaletteDrive extends AbstractProperty< PaletteId, ThermalRegistry > {

    public get availablePalettes() {
        return ThermalPalettes;
    }

    /** All the current palette properties should be accessed through this property. */
    public get currentPalette() {
        return this.availablePalettes[ this.value ];
    }

    /** @deprecated Should not be used at all. Use `currentPalette` instead */
    public get currentPixels() {
        return this.currentPalette.pixels;
    }

    
    protected validate(value: PaletteId): PaletteId {
        return value;
    }

    /** Any changes to the value should propagate directly to every instance. */
    protected afterSetEffect(value: PaletteId) {

        console.log( "Dostal jsem změnu palety", value );
        this.parent.forEveryInstance( instance => instance.recievePalette(value) );
    }

    public setPalette( key: PaletteId ) {
        this.value = key;
    }

}