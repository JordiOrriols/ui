import * as R from "../radix";
import { renderRadixDemo } from "../radix-demos";
export default {
  title: "Radix/OneTimePasswordField",
  component: R.unstable_OneTimePasswordField.Root,
  tags: ["autodocs"],
};
export const Interactive = { render: () => renderRadixDemo("unstable_OneTimePasswordField") };
