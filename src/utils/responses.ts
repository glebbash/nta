export type Ok<T = unknown> = { ok: true; data: T };
export type Err<Type extends string, Info = undefined> = {
  ok: false;
  type: Type;
  info: Info;
};
