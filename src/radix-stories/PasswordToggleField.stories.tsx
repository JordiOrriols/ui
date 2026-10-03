import * as R from "../radix";
import { renderRadixDemo } from "../radix-demos";
export default {
  title: "Radix/PasswordToggleField",
  component: R.unstable_PasswordToggleField.Root,
  tags: ["autodocs"],
};
export const Interactive = { render: () => renderRadixDemo("unstable_PasswordToggleField") };
