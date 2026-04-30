import * as i0 from '@angular/core';
import { InjectionToken, inject, Injectable, NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { DateTime, Info } from 'luxon';

const MAT_LUXON_DATE_ADAPTER_OPTIONS = new InjectionToken('MAT_LUXON_DATE_ADAPTER_OPTIONS', {
  providedIn: 'root',
  factory: () => ({
    useUtc: false,
    defaultOutputCalendar: 'gregory'
  })
});
function range(length, valueFunction) {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}
class LuxonDateAdapter extends DateAdapter {
  _useUTC;
  _firstDayOfWeek;
  _defaultOutputCalendar;
  constructor() {
    super();
    const dateLocale = inject(MAT_DATE_LOCALE, {
      optional: true
    });
    const options = inject(MAT_LUXON_DATE_ADAPTER_OPTIONS, {
      optional: true
    });
    this._useUTC = !!options?.useUtc;
    this._firstDayOfWeek = options?.firstDayOfWeek;
    this._defaultOutputCalendar = options?.defaultOutputCalendar || 'gregory';
    this.setLocale(dateLocale || DateTime.local().locale);
  }
  getYear(date) {
    return date.year;
  }
  getMonth(date) {
    return date.month - 1;
  }
  getDate(date) {
    return date.day;
  }
  getDayOfWeek(date) {
    return date.weekday;
  }
  getMonthNames(style) {
    return Info.months(style, {
      locale: this.locale,
      outputCalendar: this._defaultOutputCalendar
    });
  }
  getDateNames() {
    const dtf = new Intl.DateTimeFormat(this.locale, {
      day: 'numeric',
      timeZone: 'utc'
    });
    return range(31, i => dtf.format(DateTime.utc(2017, 1, i + 1).toJSDate()));
  }
  getDayOfWeekNames(style) {
    const days = Info.weekdays(style, {
      locale: this.locale
    });
    days.unshift(days.pop());
    return days;
  }
  getYearName(date) {
    return date.toFormat('yyyy', this._getOptions());
  }
  getFirstDayOfWeek() {
    return this._firstDayOfWeek ?? Info.getStartOfWeek({
      locale: this.locale
    });
  }
  getNumDaysInMonth(date) {
    return date.daysInMonth;
  }
  clone(date) {
    return DateTime.fromObject(date.toObject(), this._getOptions());
  }
  createDate(year, month, date) {
    const options = this._getOptions();
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }
    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }
    const result = this._useUTC ? DateTime.utc(year, month + 1, date, options) : DateTime.local(year, month + 1, date, options);
    if (!this.isValid(result)) {
      throw Error(`Invalid date "${date}". Reason: "${result.invalidReason}".`);
    }
    return result;
  }
  today() {
    const options = this._getOptions();
    return this._useUTC ? DateTime.utc(options) : DateTime.local(options);
  }
  parse(value, parseFormat) {
    const options = this._getOptions();
    if (typeof value == 'string' && value.length > 0) {
      const iso8601Date = DateTime.fromISO(value, options);
      if (this.isValid(iso8601Date)) {
        return iso8601Date;
      }
      const formats = Array.isArray(parseFormat) ? parseFormat : [parseFormat];
      if (!parseFormat.length) {
        throw Error('Formats array must not be empty.');
      }
      for (const format of formats) {
        const fromFormat = DateTime.fromFormat(value, format, options);
        if (this.isValid(fromFormat)) {
          return fromFormat;
        }
      }
      return this.invalid();
    } else if (typeof value === 'number') {
      return DateTime.fromMillis(value, options);
    } else if (value instanceof Date) {
      return DateTime.fromJSDate(value, options);
    } else if (value instanceof DateTime) {
      return DateTime.fromMillis(value.toMillis(), options);
    }
    return null;
  }
  format(date, displayFormat) {
    if (!this.isValid(date)) {
      throw Error('LuxonDateAdapter: Cannot format invalid date.');
    }
    if (this._useUTC) {
      return date.setLocale(this.locale).setZone('utc').toFormat(displayFormat);
    } else {
      return date.setLocale(this.locale).toFormat(displayFormat);
    }
  }
  addCalendarYears(date, years) {
    return date.reconfigure(this._getOptions()).plus({
      years
    });
  }
  addCalendarMonths(date, months) {
    return date.reconfigure(this._getOptions()).plus({
      months
    });
  }
  addCalendarDays(date, days) {
    return date.reconfigure(this._getOptions()).plus({
      days
    });
  }
  toIso8601(date) {
    return date.toISO();
  }
  deserialize(value) {
    const options = this._getOptions();
    let date;
    if (value instanceof Date) {
      date = DateTime.fromJSDate(value, options);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = DateTime.fromISO(value, options);
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }
  isDateInstance(obj) {
    return obj instanceof DateTime;
  }
  isValid(date) {
    return date.isValid;
  }
  invalid() {
    return DateTime.invalid('Invalid Luxon DateTime object.');
  }
  setTime(target, hours, minutes, seconds) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (hours < 0 || hours > 23) {
        throw Error(`Invalid hours "${hours}". Hours value must be between 0 and 23.`);
      }
      if (minutes < 0 || minutes > 59) {
        throw Error(`Invalid minutes "${minutes}". Minutes value must be between 0 and 59.`);
      }
      if (seconds < 0 || seconds > 59) {
        throw Error(`Invalid seconds "${seconds}". Seconds value must be between 0 and 59.`);
      }
    }
    return this.clone(target).set({
      hour: hours,
      minute: minutes,
      second: seconds,
      millisecond: 0
    });
  }
  getHours(date) {
    return date.hour;
  }
  getMinutes(date) {
    return date.minute;
  }
  getSeconds(date) {
    return date.second;
  }
  parseTime(value, parseFormat) {
    const result = this.parse(value, parseFormat);
    if ((!result || !this.isValid(result)) && typeof value === 'string') {
      return this.parse(value.replace(/[^0-9:(AM|PM)]/gi, ''), parseFormat) || result;
    }
    return result;
  }
  addSeconds(date, amount) {
    return date.reconfigure(this._getOptions()).plus({
      seconds: amount
    });
  }
  _getOptions() {
    return {
      zone: this._useUTC ? 'utc' : undefined,
      locale: this.locale,
      outputCalendar: this._defaultOutputCalendar
    };
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.2.11",
    ngImport: i0,
    type: LuxonDateAdapter,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.2.11",
    ngImport: i0,
    type: LuxonDateAdapter
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.2.11",
  ngImport: i0,
  type: LuxonDateAdapter,
  decorators: [{
    type: Injectable
  }],
  ctorParameters: () => []
});

const MAT_LUXON_DATE_FORMATS = {
  parse: {
    dateInput: 'D',
    timeInput: 't'
  },
  display: {
    dateInput: 'D',
    timeInput: 't',
    monthYearLabel: 'LLL yyyy',
    dateA11yLabel: 'DD',
    monthYearA11yLabel: 'LLLL yyyy',
    timeOptionLabel: 't'
  }
};

class LuxonDateModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.2.11",
    ngImport: i0,
    type: LuxonDateModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.2.11",
    ngImport: i0,
    type: LuxonDateModule
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.2.11",
    ngImport: i0,
    type: LuxonDateModule,
    providers: [{
      provide: DateAdapter,
      useClass: LuxonDateAdapter
    }]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.2.11",
  ngImport: i0,
  type: LuxonDateModule,
  decorators: [{
    type: NgModule,
    args: [{
      providers: [{
        provide: DateAdapter,
        useClass: LuxonDateAdapter
      }]
    }]
  }]
});
class MatLuxonDateModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.2.11",
    ngImport: i0,
    type: MatLuxonDateModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.2.11",
    ngImport: i0,
    type: MatLuxonDateModule
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.2.11",
    ngImport: i0,
    type: MatLuxonDateModule,
    providers: [provideLuxonDateAdapter()]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.2.11",
  ngImport: i0,
  type: MatLuxonDateModule,
  decorators: [{
    type: NgModule,
    args: [{
      providers: [provideLuxonDateAdapter()]
    }]
  }]
});
function provideLuxonDateAdapter(formats = MAT_LUXON_DATE_FORMATS) {
  return [{
    provide: DateAdapter,
    useClass: LuxonDateAdapter
  }, {
    provide: MAT_DATE_FORMATS,
    useValue: formats
  }];
}

export { LuxonDateAdapter, LuxonDateModule, MAT_LUXON_DATE_ADAPTER_OPTIONS, MAT_LUXON_DATE_FORMATS, MatLuxonDateModule, provideLuxonDateAdapter };
//# sourceMappingURL=material-luxon-adapter.mjs.map
