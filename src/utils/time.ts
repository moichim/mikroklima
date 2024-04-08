import { addDays, format } from "date-fns";

export function stringFromDate(date: Date) {
    return format(date, "yyyy-MM-dd");
}

export function stringFromTimestampFrom(timestamp: number) {

    const date = new Date;
    date.setTime(timestamp);
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    return format(date, "yyyy-MM-dd");
}

export function stringFromTimestampTo(timestamp: number) {

    const date = new Date;
    date.setTime(timestamp);
    date.setUTCHours(23);
    date.setUTCMinutes(59);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    return format(date, "yyyy-MM-dd");
}

export function dateFromString(date: string) {
    return new Date(date);
}

export function stringFromTimestamp(timestamp: number) {
    const date = new Date;
    date.setTime(timestamp);
    return format(date, "yyyy-MM-dd");
}

export function stringLabelFromTimestamp(timestamp: number) {
    const date = new Date;
    date.setTime(timestamp);
    return format(date, "d. M. yyyy H:mm");
}

export function timestampFromFromString(date: string) {
    const d = dateFromString(date);

    d.setUTCHours(0);
    d.setUTCMinutes(0);
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);

    return d.getTime();
}

export function timestampToFromString(date: string) {
    const d = dateFromString(date);

    d.setUTCHours(23);
    d.setUTCMinutes(59);
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);

    return d.getTime();
}

export const getAddedDate = (date: string, numDays: number) => stringFromDate(addDays(dateFromString(date), numDays));

export const getTodayDateString = () => stringFromDate(new Date)