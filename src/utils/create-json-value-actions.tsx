import TitleIcon from "@mui/icons-material/Title";
import NumbersIcon from "@mui/icons-material/Numbers";
import DataArrayIcon from "@mui/icons-material/DataArray";
import DataObjectIcon from "@mui/icons-material/DataObject";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CloseIcon from "@mui/icons-material/Close";

export function newCreateJsonValueActions(
  onSelect: (jsonType: string) => void
) {
  return [
    {
      label: "String",
      icon: <TitleIcon />,
      action: () => onSelect("string"),
    },
    {
      label: "Number",
      icon: <NumbersIcon />,
      action: () => onSelect("number"),
    },
    {
      label: "Boolean",
      icon: <ToggleOffIcon />,
      action: () => onSelect("boolean"),
    },
    {
      label: "Object",
      icon: <DataObjectIcon />,
      action: () => onSelect("object"),
    },
    {
      label: "Array",
      icon: <DataArrayIcon />,
      action: () => onSelect("array"),
    },
    {
      label: "Null",
      icon: <CloseIcon />,
      action: () => onSelect("null"),
    },
  ];
}
