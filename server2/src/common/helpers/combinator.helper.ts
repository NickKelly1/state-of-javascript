import { IJson } from "../interfaces/json.interface";
import { OrUndefined } from "../types/or-undefined.type";
import { Printable } from "../types/printable.type";

export interface ICombinatorInput<K, A, B> {
  a: Map<K, A>;
  b: Map<K, B>;
}

class CombinatorJoin<K, A, B> {
  constructor(
    protected readonly keys: K[],
    protected readonly input: ICombinatorInput<K, A, B>,
  ) {
    //
  }

  protected _a: OrUndefined<Map<K, A>>;
  get a(): Map<K, A> {
    if (this._a) return this._a;
    this._a = new Map(this.keys.map(k => [k, this.input.a.get(k)!]));
    return this._a;
  }

  protected _b: OrUndefined<Map<K, B>>;
  get b(): Map<K, B> {
    if (this._b) return this._b;
    this._b = new Map(this.keys.map(k => [k, this.input.b.get(k)!]));
    return this._b;
  }

  toDebug() { 
    return {
      a: this.a,
      b: this.b,
    }
  }
}

class CombinatorDifference<K, A, B> {
  constructor(
    protected readonly de: Combinator<K, A, B>,
    protected readonly input: ICombinatorInput<K, A, B>,
  ) {
    //
  }

  protected _aNotBKeys: OrUndefined<K[]>
  public get aNotBKeys(): K[] {
    if (this._aNotBKeys) return this._aNotBKeys;
    this._aNotBKeys = this.de.aKeys.filter(k => !this.input.b.has(k));
    return this._aNotBKeys;
  }

  protected _bNotAKeys: OrUndefined<K[]>
  public get bNotAKeys(): K[] {
    if (this._bNotAKeys) return this._bNotAKeys;
    this._bNotAKeys = this.de.bKeys.filter(k => !this.input.a.has(k));
    return this._bNotAKeys;
  }

  protected _aNotB: OrUndefined<Map<K, A>>;
  get aNotB(): Map<K, A> {
    if (this._aNotB) return this._aNotB;
    this._aNotB = new Map(this.aNotBKeys.map(k => [k, this.input.a.get(k)!]));
    return this._aNotB;
  }

  protected _bNotA: OrUndefined<Map<K, B>>;
  get bNotA(): Map<K, B> {
    if (this._bNotA) return this._bNotA;
    this._bNotA = new Map(this.bNotAKeys.map(k => [k, this.input.b.get(k)!]));
    return this._bNotA;
  }

  toDebug() {
    return {
      aNotBKeys: this.aNotBKeys,
      bNotAKeys: this.bNotAKeys,
      aNotB: this.aNotB, bNotA: this.bNotA,
    }
  }
}

// compare 2 maps in different ways
// everything is lazy loaded
// TODO: use a lazy loader function / class / proxy or something to make it neater...
export class Combinator<K, A, B> {
  constructor(public readonly input: ICombinatorInput<K, A, B>) {
    //
  }

  // keys in "a"
  protected _aKeys: OrUndefined<K[]>
  public get aKeys(): K[] {
    if (this._aKeys) return this._aKeys;
    this._aKeys = Array.from(this.input.a.keys());
    return this._aKeys;
  }

  // keys in "b"
  protected _bKeys: OrUndefined<K[]>
  public get bKeys(): K[] {
    if (this._bKeys) return this._bKeys;
    this._bKeys = Array.from(this.input.b.keys());
    return this._bKeys;
  }

  // keys in "a" that are also in "b"
  protected _aJoinBKeys: OrUndefined<K[]>
  protected get aJoinBKeys(): K[] {
    if (this._aJoinBKeys) return this._aJoinBKeys;
    this._aJoinBKeys = this.aKeys.filter(k => this.input.b.has(k));
    return this._aJoinBKeys;
  }

  // keys in "b" that are also in "a"
  protected _bJoinAKeys: OrUndefined<K[]>
  protected get bJoinAKeys(): K[] {
    if (this._bJoinAKeys) return this._bJoinAKeys;
    this._bJoinAKeys = this.bKeys.filter(k => this.input.a.has(k));
    return this._bJoinAKeys;
  }

  // join a -> b
  protected _aJoinB: OrUndefined<CombinatorJoin<K, A, B>>
  public get aJoinB(): CombinatorJoin<K, A, B> {
    if (this._aJoinB) return this._aJoinB;
    this._aJoinB = new CombinatorJoin(this.aJoinBKeys, this.input);
    return this._aJoinB;
  }

  // join b -> a
  protected _bJoinA: OrUndefined<CombinatorJoin<K, A, B>>
  public get bJoinA(): CombinatorJoin<K, A, B> {
    if (this._bJoinA) return this._bJoinA;
    this._bJoinA = new CombinatorJoin(this.bJoinAKeys, this.input);
    return this._bJoinA;
  }

  // difference b * a | a * b
  protected _diff: OrUndefined<CombinatorDifference<K, A, B>>
  public get diff(): CombinatorDifference<K, A, B> {
    if (this._diff) return this._diff;
    this._diff = new CombinatorDifference(this, this.input);
    return this._diff;
  }

  toDebug() {
    return {
      aKeys: this.aKeys,
      bKeys: this.bKeys,
      aJoinBKeys: this.aJoinBKeys,
      bJoinAKeys: this.bJoinAKeys,
      aJoinB: this.aJoinB.toDebug(),
      bJoinA: this.bJoinA.toDebug(),
      diff: this.diff.toDebug(),
    }
  }
}