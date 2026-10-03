import * as R from "../radix";
import { renderRadixDemo } from "../radix-demos";
export default {
  title: "Radix/VisuallyHidden",
  component: R.VisuallyHidden.Root,
  tags: ["autodocs"],
};
export const Interactive = { render: () => renderRadixDemo("VisuallyHidden") };
