import { GoogleScope } from "@/graphql/google/google"
import { addDays, differenceInDays, subDays, subMonths } from "date-fns"
import { TimePeriod } from "./actions"
import { correct } from "./reducer"
import { TimeRound } from "./timeUtils/rounding"
import { TimeFormat } from "./timeUtils/formatting"

type TimeType = {
    from: number,
    to: number
}

export type TimeStoragePresetType = TimeType & {
    name: string
}

export type TimeStorageType = TimeType & {
    defaultFrom: number,
    defaultTo: number,
    modificationMode: TimePeriod,
    currentPreset?: TimeStoragePresetType,

    fromLowerHours: number,
    fromRiseHours: number,
    toLowerHours: number,
    toRiseHours: number,

    presets: {
        [index: string]: TimeStoragePresetType
    },
    selectionFrom?: number,
    selectionTo?: number,
    selectionCursor?: number,
    hasSelection: boolean,
    isSelecting: boolean

}

export const timeStorageDefaults: TimeStorageType = {
    defaultFrom: 0,
    defaultTo: 0,
    modificationMode: TimePeriod.DAY,
    presets: {},
    from: 0,
    to: 0,
    fromLowerHours: 0,
    fromRiseHours: 0,
    toLowerHours: 0,
    toRiseHours: 0,
    hasSelection: false,
    isSelecting: false
}

const MONTHS = {
    1: "leden",
    2: "únor",
    3: "březen",
    4: "duben",
    5: "květen",
    6: "červen",
    7: "červenec",
    8: "srpen",
    9: "září",
    10: "říjen",
    11: "listopad",
    12: "prosinec"
};

const calculatePresets = (from: number, to: number): {
    [index: string]: TimeStoragePresetType
} => {

    const f = TimeRound.down(from, TimePeriod.DAY);
    const t = TimeRound.up(to, TimePeriod.DAY);

    const durationInDays = Math.abs(differenceInDays(f, t));

    // If less than a week, return no preset
    if (durationInDays <= 7) {
        return {};
    }

    const presets: { [index: string]: TimeStoragePresetType } = {
        LAST_7_DAYS: {
            from: TimeRound.down( subDays(t, 7), TimePeriod.DAY ).getTime(),
            to: t.getTime(),
            name: "Posledních 7 dní",
        },
        WHOLE: {
            from: f.getTime(),
            to: t.getTime(),
            name: "Celé období"
        }
    };

    // If less than a month, return last week or entire month
    if (durationInDays <= 31) {

        return presets;
    }

    // If more than month, return a predefined set and all months

    let { LAST_7_DAYS, WHOLE } = presets;

    const minMonth = f.getUTCMonth() + 1;
    const minYear = f.getUTCFullYear();
    const maxMonth = t.getUTCMonth() + 1;
    const maxYear = t.getUTCFullYear();

    const months: { [index: string]: TimeStoragePresetType } = {};

    const getPresetID = (year: number, month: number) => `preset_${year}_${month}`;

    for (let year = minYear; year <= maxYear; year++) {

        if (minYear === maxYear) {

            for (let month = minMonth; month <= maxMonth; month++) {

                let calculatedFrom = f;

                let name = [
                    MONTHS[ month as keyof typeof MONTHS ],
                    year
                ];

                if ( month === minMonth ) {
                    name.push( `(od ${TimeFormat.humanDate(f)})` );
                }

                if (month !== minMonth) {
                    const frm = new Date();
                    frm.setUTCDate(5);
                    frm.setUTCFullYear(year);
                    frm.setUTCMonth(month - 1);
                    calculatedFrom = TimeRound.down(frm, TimePeriod.MONTH);
                }

                let calculatedTo = t;

                if (month !== maxMonth) {
                    const tto = new Date;
                    tto.setUTCDate(6);
                    tto.setUTCFullYear(year);
                    tto.setUTCMonth(month - 1);
                    calculatedTo = TimeRound.up(tto, TimePeriod.MONTH);
                }


                months[getPresetID(year, month)] = {
                    name: name.join(" "),
                    from: calculatedFrom.getTime(),
                    to: calculatedTo.getTime()
                }

            }

        } else if (year === minYear) {

            for (let month = minMonth; month <= 12; month++) {

                let calculatedFrom = f;

                let name = [
                    MONTHS[ month as keyof typeof MONTHS ],
                    year
                ];

                if ( month === minMonth ) {
                    name.push( `(od ${TimeFormat.humanDate(f)})` );
                }

                if ( month === maxMonth ) {
                    name.push( `(do ${TimeFormat.humanDate(t)})` );
                }

                if (month !== minMonth) {
                    const frm = new Date();
                    frm.setUTCDate(5);
                    frm.setUTCFullYear(year);
                    frm.setUTCMonth(month - 1);
                    calculatedFrom = TimeRound.down(frm, TimePeriod.MONTH);
                }

                let calculatedTo = new Date;
                calculatedTo.setUTCDate(5);
                calculatedTo.setUTCFullYear(year);
                calculatedTo.setUTCMonth(month - 1);
                calculatedTo = TimeRound.up(calculatedTo, TimePeriod.MONTH);


                months[getPresetID(year, month)] = {
                    name: name.join(" "),
                    from: calculatedFrom.getTime(),
                    to: calculatedTo.getTime()
                }

            }

        } else if (year === maxYear) {

            for (let month = 1; month <= maxMonth; month++) {

                let name = [
                    MONTHS[ month as keyof typeof MONTHS ],
                    year
                ];

                if ( month === maxMonth ) {
                    name.push( `(do ${TimeFormat.humanDate(t)})` );
                }

                let calculatedFrom = new Date();
                calculatedFrom.setUTCDate(5);
                calculatedFrom.setUTCFullYear(year);
                calculatedFrom.setUTCMonth(month - 1);
                calculatedFrom = TimeRound.down(calculatedFrom, TimePeriod.MONTH);

                let calculatedTo = t;

                if (month !== maxMonth) {
                    calculatedTo = new Date;
                    calculatedTo.setUTCDate(8);
                    calculatedTo.setUTCFullYear(year);
                    calculatedTo.setUTCMonth(month - 1);
                    calculatedTo = TimeRound.up(calculatedTo, TimePeriod.MONTH);
                }

                months[getPresetID(year, month)] = {
                    name: name.join(" "),
                    from: calculatedFrom.getTime(),
                    to: calculatedTo.getTime()
                }

            }

        } else {

            for (let month = 1; month <= 12; month++) {

                let calculatedFrom = new Date();
                calculatedFrom.setUTCDate(5);
                calculatedFrom.setUTCFullYear(year);
                calculatedFrom.setUTCMonth(month - 1);
                calculatedFrom = TimeRound.down(calculatedFrom, TimePeriod.MONTH);

                let calculatedTo = new Date();
                calculatedTo.setUTCDate(5);
                calculatedTo.setUTCFullYear(year);
                calculatedTo.setUTCMonth(month - 1);
                calculatedTo = TimeRound.up(calculatedTo, TimePeriod.MONTH);

                months[getPresetID(year, month)] = {
                    name: [
                        MONTHS[month as keyof typeof MONTHS],
                        year
                    ].join(" "),
                    from: calculatedFrom.getTime(),
                    to: calculatedTo.getTime()
                }

            }

        }

    }


    return {
        LAST_7_DAYS,
        ...months,
        WHOLE
    }


}

export const getDefaultsFromScope = (
    scope: GoogleScope
): TimeStorageType => {

    const fromTmp = new Date;
    fromTmp.setUTCMonth( 9 );
    fromTmp.setUTCDate(30);
    fromTmp.setUTCFullYear( 2023 );
    fromTmp.setUTCHours( 0 );
    fromTmp.setUTCMinutes( 0 );
    fromTmp.setUTCMilliseconds( 0 );
    fromTmp.setUTCSeconds(0);

    const initialFrom = fromTmp.getTime();
    const initialTo = addDays(TimeRound.up(new Date, TimePeriod.DAY), 0).getTime();

    const presets = calculatePresets(initialFrom, initialTo);

    const currentPreset = presets.WHOLE;

    return correct({

        ...timeStorageDefaults,

        defaultFrom: initialFrom,
        defaultTo: initialTo,

        modificationMode: TimePeriod.DAY,

        from: currentPreset.from,
        to: currentPreset.to,

        presets: presets,
        currentPreset: currentPreset

    })

}