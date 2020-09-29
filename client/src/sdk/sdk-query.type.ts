import { ScreenLockLandscapeRounded } from "@material-ui/icons";
import qs from 'qs';
// enum SdkFilterType {
//   eq,
//   lt,
//   lte,
//   gt,
//   gte,
// }

import { arrWrap } from "../helpers/arr-wrap.helper"
import { OrUndefined } from "../types/or-undefined.type";

// export interface ISdkQueryFilterEq {
//   _t: SdkFilterType.eq,
//   value: string | number;
// }

// export interface ISdkQueryFilterLt {
//   _t: SdkFilterType.lt,
//   value: string | number;
// }

// export interface ISdkQueryFilterLte {
//   _t: SdkFilterType.lte,
//   value: string | number;
// }

// export interface ISdkQueryFilterGt {
//   _t: SdkFilterType.gt,
//   value: string | number;
// }

// export interface ISdkQueryFilterGte {
//   _t: SdkFilterType.gte,
//   value: string | number;
// }

// export interface ISdkFilter

class QsParam {
  static from(arg: { field: string; value: string; }): QsParam { return new QsParam(arg.field, arg.value) }
  protected constructor(public readonly field: string, public readonly value: string) {}
  toEntry(): [string, string] { return [this.field, this.value]; }
}


export interface ISdkParamable {
  toParam(): QsParam | QsParam[];
}

export class SdkFilterEq implements ISdkParamable {
  static create(arg: { field: string, value: string | number }): SdkFilterEq { return new SdkFilterEq(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_eq`, value: `${this.value}` })}
}

export class SdkFilterGt implements ISdkParamable {
  static create(arg: { field: string, value: string | number }): SdkFilterGt { return new SdkFilterGt(arg.field, arg.value)}
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_gt`, value: `${this.value}` })}
}

export class SdkFilterGte implements ISdkParamable {
  static create(arg: { field: string, value: string | number }): SdkFilterGte { return new SdkFilterGte(arg.field, arg.value)}
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_gte`, value: `${this.value}` })}
}

export class SdkFilterLt implements ISdkParamable {
  static create(arg: { field: string, value: string | number }): SdkFilterLt { return new SdkFilterLt(arg.field, arg.value)}
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_lte`, value: `${this.value}` })}
}

export class SdkFilterLte implements ISdkParamable {
  static create(arg: { field: string, value: string | number }): SdkFilterLte { return new SdkFilterLte(arg.field, arg.value)}
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_lte`, value: `${this.value}` })}
}

export class SdkFilterIn implements ISdkParamable {
  static create(arg: { field: string, values: (string | number)[] }): SdkFilterIn { return new SdkFilterIn(arg.field, arg.values)}
  protected constructor(protected readonly field: string, protected readonly values: (string | number)[]) {}
  toParam() { return this.values.map(value => QsParam.from({ field: `${this.field}_in`, value: `${value}` })) }
}

export class SdkFilterNIn implements ISdkParamable {
  static create(arg: { field: string, values: (string | number)[] }): SdkFilterNIn { return new SdkFilterNIn(arg.field, arg.values)}
  protected constructor(protected readonly field: string, protected readonly values: (string | number)[]) {}
  toParam() { return this.values.map(value => QsParam.from({ field: `${this.field}_nin`, value: `${value}` })) }
}

export class SdkFilterContains implements ISdkParamable {
  static create(arg: { field: string, value: string | number }): SdkFilterContains { return new SdkFilterContains(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_contains`, value: `${this.value}` })}
}

export class SdkFilterNContains implements ISdkParamable {
  static create(arg: { field: string, value: string | number }): SdkFilterNContains { return new SdkFilterNContains(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_ncontains`, value: `${this.value}` })}
}

export class SdkFilterContainss implements ISdkParamable {
  static create(arg: { field: string, value: string | number }): SdkFilterContainss { return new SdkFilterContainss(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_containss`, value: `${this.value}` })}
}

export class SdkFilterNContainss implements ISdkParamable {
  static create(arg: { field: string, value: string | number }): SdkFilterNContainss { return new SdkFilterNContainss(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_ncontainss`, value: `${this.value}` })}
}

export class SdkFilterNull implements ISdkParamable {
  static create(arg: { field: string, value: boolean }): SdkFilterNull { return new SdkFilterNull(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: boolean) {}
  toParam() { return QsParam.from({ field: `${this.field}_null`, value: `${this.value}` })}
}

export enum SdkSortDir { Asc = 'ASC', Desc = 'DESC', }
export class SdkSort {
  static create(arg: { field: string, value: SdkSortDir }): SdkSort { return new SdkSort(arg.field, arg.value); }
  protected constructor(public readonly field: string, public readonly value: SdkSortDir) {}
}




// https://strapi.io/documentation/3.0.0-beta.x/content-api/parameters.html
export class SdkQuery {
  static create(): SdkQuery { return new SdkQuery(); }
  filters: ISdkParamable[] = [];
  sorts: SdkSort[] = [];
  limit?: number;
  skip?: number;
  constructor() {};
  setLimit(to: number) {
    this.limit = to;
    return this;
  }
  setSkip(to: number) {
    this.skip = to;
    return this;
  }
  addFilter(filter: ISdkParamable): SdkQuery {
    this.filters.push(filter);
    return this;
  }
  addSort(sort: SdkSort): SdkQuery {
    this.sorts.push(sort);
    return this;
  }
  toSearch(): URLSearchParams {
    const filterEntries = this
      .filters
      .flatMap(filter => arrWrap(filter.toParam()))
      .map(param => param.toEntry());
    const sortEntry: OrUndefined<[string, string]> = this.sorts.length
      ? [ '_sort', this.sorts.map(sort => `${sort.field}:${sort.value}`).join(','), ]
      : undefined;
    const skip = this.skip;
    const limit = this.limit;

    const qsEntries = [...filterEntries];
    if (sortEntry) qsEntries.push(sortEntry);
    if (skip !== undefined) qsEntries.push(['_start', skip.toString()]);
    if (limit !== undefined) qsEntries.push(['_limit', limit.toString()]);
    const search = new URLSearchParams(qsEntries);
    return search;
  }
}