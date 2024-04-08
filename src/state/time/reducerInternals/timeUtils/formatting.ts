import { format, formatISO9075 } from "date-fns";
import { AcceptableDateInput, TimeUtilsBase } from "./base";



export class TimeFormat extends TimeUtilsBase {

    /** YYYY-MM-DD */
    public static isoDate = (value: AcceptableDateInput) => {
        value = TimeFormat.inputToDate(value);
        return formatISO9075(value, { representation: "date" });
    }

    /** HH:MM:SS */
    public static isoTime = (value: AcceptableDateInput) => {
        value = TimeFormat.inputToDate(value);
        return formatISO9075(value, { representation: "time" });
    }

    /** YYYY-MM-DD HH:MM:SS */
    public static isoComplete = (value: AcceptableDateInput) => {
        value = TimeFormat.inputToDate(value);
        return formatISO9075(value);
    }

    /** HH:mm */
    public static humanTime = (
        value: AcceptableDateInput,
        showSeconds: boolean = false
    ) => {
        value = TimeFormat.inputToDate(value);
        return format(value, showSeconds ? "HH:mm:ss" : "HH:mm");
    }
    /** j. M. ???? (y) */
    public static humanDate = (
        value: AcceptableDateInput,
        includeYear: boolean = false
    ) => {
        value = TimeFormat.inputToDate(value);
        return format(value, includeYear ? "d. M." : "d. M. yyyy");
    }

    /** Range */
    public static humanRangeDates(from: AcceptableDateInput, to: AcceptableDateInput) {

        from = TimeFormat.inputToDate(from);
        to = TimeFormat.inputToDate(to);

        if (from.getUTCDate() === to.getUTCDate()) {
            return TimeFormat.humanDate(from);
        }

        return [
            TimeFormat.humanDate(from),
            TimeFormat.humanDate(to)
        ].join(" - ");

    }

    public static human(
        date: AcceptableDateInput
    ) {

        return `${TimeFormat.humanDate( date )} ${TimeFormat.humanTime( date, true )} `;

    }
}