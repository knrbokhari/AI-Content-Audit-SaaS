import Select from "@/components/ui/select/select";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  GetOptionLabel,
  GetOptionValue,
} from "react-select";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectInputProps<T extends FieldValues, O = SelectOption> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;

  options: O[];

  getOptionLabel?: GetOptionLabel<O>;
  getOptionValue?: GetOptionValue<O>;

  isMulti?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  isLoading?: boolean;

  onInputChange?: (value: string) => void;
  onBlur?: () => void;
}

function SelectInput<T extends FieldValues, O = SelectOption>({
  control,
  name,
  rules,
  options,
  getOptionLabel,
  getOptionValue,
  isMulti = false,
  isClearable = false,
  disabled = false,
  isLoading = false,
  onInputChange,
  onBlur,
}: SelectInputProps<T, O>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <Select
          {...field}
          options={options}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isMulti={isMulti}
          isClearable={isClearable}
          isLoading={isLoading}
          isDisabled={disabled}
          onInputChange={onInputChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}

export default SelectInput;