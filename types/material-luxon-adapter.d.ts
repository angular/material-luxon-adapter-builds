import * as i0 from '@angular/core';
import { InjectionToken, Provider } from '@angular/core';
import { DateAdapter, MatDateFormats } from '@angular/material/core';
import { DateTime, CalendarSystem } from 'luxon';

/** Configurable options for the `LuxonDateAdapter`. */
interface MatLuxonDateAdapterOptions {
    /**
     * Turns the use of utc dates on or off.
     * Changing this will change how Angular Material components like DatePicker output dates.
     */
    useUtc: boolean;
    /**
     * Sets the first day of week.
     * Changing this will change how Angular Material components like DatePicker shows start of week.
     */
    firstDayOfWeek?: number;
    /**
     * Sets the output Calendar.
     * Changing this will change how Angular Material components like DatePicker output dates.
     */
    defaultOutputCalendar: CalendarSystem;
}
/** InjectionToken for LuxonDateAdapter to configure options. */
declare const MAT_LUXON_DATE_ADAPTER_OPTIONS: InjectionToken<MatLuxonDateAdapterOptions>;
/** Adapts Luxon Dates for use with Angular Material. */
declare class LuxonDateAdapter extends DateAdapter<DateTime> {
    private _useUTC;
    private _firstDayOfWeek;
    private _defaultOutputCalendar;
    constructor();
    getYear(date: DateTime): number;
    getMonth(date: DateTime): number;
    getDate(date: DateTime): number;
    getDayOfWeek(date: DateTime): number;
    getMonthNames(style: 'long' | 'short' | 'narrow'): string[];
    getDateNames(): string[];
    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[];
    getYearName(date: DateTime): string;
    getFirstDayOfWeek(): number;
    getNumDaysInMonth(date: DateTime): number;
    clone(date: DateTime): DateTime;
    createDate(year: number, month: number, date: number): DateTime;
    today(): DateTime;
    parse(value: unknown, parseFormat: string | string[]): DateTime | null;
    format(date: DateTime, displayFormat: string): string;
    addCalendarYears(date: DateTime, years: number): DateTime;
    addCalendarMonths(date: DateTime, months: number): DateTime;
    addCalendarDays(date: DateTime, days: number): DateTime;
    toIso8601(date: DateTime): string;
    /**
     * Returns the given value if given a valid Luxon or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) and valid Date objects into valid DateTime and empty
     * string into null. Returns an invalid date for all other values.
     */
    deserialize(value: unknown): DateTime | null;
    isDateInstance(obj: unknown): obj is DateTime;
    isValid(date: DateTime): boolean;
    invalid(): DateTime;
    setTime(target: DateTime, hours: number, minutes: number, seconds: number): DateTime;
    getHours(date: DateTime): number;
    getMinutes(date: DateTime): number;
    getSeconds(date: DateTime): number;
    parseTime(value: unknown, parseFormat: string | string[]): DateTime | null;
    addSeconds(date: DateTime, amount: number): DateTime;
    /** Gets the options that should be used when constructing a new `DateTime` object. */
    private _getOptions;
    static ɵfac: i0.ɵɵFactoryDeclaration<LuxonDateAdapter, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LuxonDateAdapter>;
}

declare const MAT_LUXON_DATE_FORMATS: MatDateFormats;

declare class LuxonDateModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<LuxonDateModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<LuxonDateModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<LuxonDateModule>;
}
declare class MatLuxonDateModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLuxonDateModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatLuxonDateModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatLuxonDateModule>;
}
declare function provideLuxonDateAdapter(formats?: MatDateFormats): Provider[];

export { LuxonDateAdapter, LuxonDateModule, MAT_LUXON_DATE_ADAPTER_OPTIONS, MAT_LUXON_DATE_FORMATS, MatLuxonDateModule, provideLuxonDateAdapter };
export type { MatLuxonDateAdapterOptions };
