declare namespace Mod {
  export interface Dynamic { [x: string]: any; }
  export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
  export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
  export type Modify<T, R> = Omit<T, keyof R> & R;
  export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
  export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
  export type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]; };
  export type MethodsOf<T> = Pick<T, { [K in keyof T]: T[K] extends (...[]) => any ? K : never }[keyof T]>
  export type PropertiesOf<T> = Omit<T, keyof MethodsOf<T>>
  export type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
      T[P] extends object ? RecursivePartial<T[P]> :
        T[P]
  };
  export type RequiredPick<T, P extends string> = Required<Exclude<T, P>> & Omit<T, P>;
  export type PickType<T, P> =  Pick<T, { [K in keyof T]: T[K] extends P ? K : never }[keyof T]>
  export type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
    : Lowercase<S>

  export type ConstructorOf<T, U= object, P=any[]> = (new (...args: P) => T)&U

  export type AddPayloadOf<T> = Mod.Writeable<Partial<Mod.PropertiesOf<T>>>;
}

// @todo: should check if we can use things from following links

// more type mods for readonly
// https://stackoverflow.com/questions/62361475/recursively-exclude-readonly-properties-in-typescript

// more on readonly but also immutable
// https://github.com/microsoft/TypeScript/issues/13923#issuecomment-653675557

// Basic Mongo Querying for typehinting
declare namespace MongoQuery {
    type logical = '$and' | '$not' | '$nor' | '$or'
    type SearchTypes<T, P = keyof T> = typeof T[P] | Mod.Writeable<Partial<{
        $eq: typeof T[P] | null,
        $gt: typeof T[P] | null,
        $gte: typeof T[P] | null,
        $lt: typeof T[P] | null,
        $lte: typeof T[P] | null,
        $ne: typeof T[P] | null,
        $nin: (typeof T[P])[],
        $in: (typeof T[P])[],
    }>>;

    export type Filter<T> = Partial<{
        [P in keyof T]: SearchTypes<Mod.Writeable<T>, P> | T[P]
    } & {
        $and: Filter<T>[],
        $not: Filter<T>[],
        $nor: Filter<T>[],
        $or: Filter<T>[],
    }>
}

declare namespace Path {
  type PathImpl<T, Key extends keyof T> =
    Key extends string
      ? T[Key] extends Record<string, any>
        ? | `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}`
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
        : never
      : never;

  type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

  export type Path<T> = PathImpl2<T> extends string | keyof T ? PathImpl2<T> : keyof T;

  export type Value<T, P extends Path<T>> =
    P extends `${infer Key}.${infer Rest}`
      ? Key extends keyof T
        ? Rest extends Path<T[Key]>
          ? Value<T[Key], Rest>
          : never
        : never
      : P extends keyof T
        ? T[P]
        : never;
}
