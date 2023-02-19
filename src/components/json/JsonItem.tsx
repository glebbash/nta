import { JsonValue, isArray, isString } from "../../utils/json";
import { FileContext } from "../../hooks/useFileContext";
import { ArrayItem } from "./ArrayItem";
import { BooleanItem } from "./BooleanItem";
import { NullItem } from "./NullItem";
import { NumberItem } from "./NumberItem";
import { ObjectItem } from "./ObjectItem";
import { StringItem } from "./StringItem";

export type JsonItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: JsonValue;
  setValue: (value: JsonValue) => void;
};

export function JsonItem({ ctx, preview, value, setValue }: JsonItemProps) {
  if (value === undefined) {
    throw new Error("Invalid item: undefined");
  }

  if (value === null) {
    return (
      <NullItem ctx={ctx} preview={preview} value={value} setValue={setValue} />
    );
  }

  if (typeof value === "number") {
    return (
      <NumberItem
        ctx={ctx}
        preview={preview}
        value={value}
        setValue={setValue}
      />
    );
  }

  if (isString(value)) {
    return (
      <StringItem
        ctx={ctx}
        preview={preview}
        value={value}
        setValue={setValue}
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <BooleanItem
        ctx={ctx}
        preview={preview}
        value={value}
        setValue={setValue}
      />
    );
  }

  if (isArray(value)) {
    return (
      <ArrayItem
        ctx={ctx}
        preview={preview}
        value={value}
        setValue={setValue}
      />
    );
  }

  return (
    <ObjectItem ctx={ctx} preview={preview} value={value} setValue={setValue} />
  );
}
