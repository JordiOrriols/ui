import * as R from "../radix";
import { renderRadixDemo } from "../radix-demos";
export default {
  title: "Radix/NavigationMenu",
  component: R.NavigationMenu.Root,
  tags: ["autodocs"],
};
export const Interactive = { render: () => renderRadixDemo("NavigationMenu") };
