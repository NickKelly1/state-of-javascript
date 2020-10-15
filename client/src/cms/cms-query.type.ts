import { ScreenLockLandscapeRounded } from "@material-ui/icons";
import qs from 'qs';

import { arrWrap } from "../helpers/arr-wrap.helper"
import { OrUndefined } from "../types/or-undefined.type";

class QsParam {
  static from(arg: { field: string; value: string; }): QsParam { return new QsParam(arg.field, arg.value) }
  protected constructor(public readonly field: string, public readonly value: string) {}
  toEntry(): [string, string] { return [this.field, this.value]; }
}


export interface ICmsParamable {
  toParam(): QsParam | QsParam[];
}

export class CmsFilterEq implements ICmsParamable {
  static create(arg: { field: string, value: string | number }): CmsFilterEq { return new CmsFilterEq(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_eq`, value: `${this.value}` })}
}

export class CmsFilterGt implements ICmsParamable {
  static create(arg: { field: string, value: string | number }): CmsFilterGt { return new CmsFilterGt(arg.field, arg.value)}
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_gt`, value: `${this.value}` })}
}

export class CmsFilterGte implements ICmsParamable {
  static create(arg: { field: string, value: string | number }): CmsFilterGte { return new CmsFilterGte(arg.field, arg.value)}
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_gte`, value: `${this.value}` })}
}

export class CmsFilterLt implements ICmsParamable {
  static create(arg: { field: string, value: string | number }): CmsFilterLt { return new CmsFilterLt(arg.field, arg.value)}
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_lte`, value: `${this.value}` })}
}

export class CmsFilterLte implements ICmsParamable {
  static create(arg: { field: string, value: string | number }): CmsFilterLte { return new CmsFilterLte(arg.field, arg.value)}
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_lte`, value: `${this.value}` })}
}

export class CmsFilterIn implements ICmsParamable {
  static create(arg: { field: string, values: (string | number)[] }): CmsFilterIn { return new CmsFilterIn(arg.field, arg.values)}
  protected constructor(protected readonly field: string, protected readonly values: (string | number)[]) {}
  toParam() { return this.values.map(value => QsParam.from({ field: `${this.field}_in`, value: `${value}` })) }
}

export class CmsFilterNIn implements ICmsParamable {
  static create(arg: { field: string, values: (string | number)[] }): CmsFilterNIn { return new CmsFilterNIn(arg.field, arg.values)}
  protected constructor(protected readonly field: string, protected readonly values: (string | number)[]) {}
  toParam() { return this.values.map(value => QsParam.from({ field: `${this.field}_nin`, value: `${value}` })) }
}

export class CmsFilterContains implements ICmsParamable {
  static create(arg: { field: string, value: string | number }): CmsFilterContains { return new CmsFilterContains(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_contains`, value: `${this.value}` })}
}

export class CmsFilterNContains implements ICmsParamable {
  static create(arg: { field: string, value: string | number }): CmsFilterNContains { return new CmsFilterNContains(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_ncontains`, value: `${this.value}` })}
}

export class CmsFilterContainss implements ICmsParamable {
  static create(arg: { field: string, value: string | number }): CmsFilterContainss { return new CmsFilterContainss(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_containss`, value: `${this.value}` })}
}

export class CmsFilterNContainss implements ICmsParamable {
  static create(arg: { field: string, value: string | number }): CmsFilterNContainss { return new CmsFilterNContainss(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: string | number) {}
  toParam() { return QsParam.from({ field: `${this.field}_ncontainss`, value: `${this.value}` })}
}

export class CmsFilterNull implements ICmsParamable {
  static create(arg: { field: string, value: boolean }): CmsFilterNull { return new CmsFilterNull(arg.field, arg.value) }
  protected constructor(protected readonly field: string, protected readonly value: boolean) {}
  toParam() { return QsParam.from({ field: `${this.field}_null`, value: `${this.value}` })}
}

export enum CmsSortDir { Asc = 'ASC', Desc = 'DESC', }
export class CmsSort {
  static create(arg: { field: string, value: CmsSortDir }): CmsSort { return new CmsSort(arg.field, arg.value); }
  protected constructor(public readonly field: string, public readonly value: CmsSortDir) {}
}




// https://strapi.io/documentation/3.0.0-beta.x/content-api/parameters.html
export class CmsQuery {
  static create(): CmsQuery { return new CmsQuery(); }
  filters: ICmsParamable[] = [];
  sorts: CmsSort[] = [];
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
  addFilter(filter: ICmsParamable): CmsQuery {
    this.filters.push(filter);
    return this;
  }
  addSort(sort: CmsSort): CmsQuery {
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