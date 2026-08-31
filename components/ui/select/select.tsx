/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactSelect, { GroupBase, SelectInstance } from "react-select";
import { selectStyles } from "./select.styles";

const Select = React.forwardRef(
  (
    props: any,
    ref: React.Ref<SelectInstance<any, boolean, GroupBase<any>>>,
  ) => {
    return <ReactSelect ref={ref} styles={selectStyles} {...props} />;
  },
);

Select.displayName = "Select";

export default Select;
