import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Github,
  User,
  Users,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Share2,
  Globe,
  LayoutGrid,
  LogIn,
  LogOut,
} from "./icons";

export default { title: "Icons/Ladders", tags: ["autodocs"] } satisfies Meta;
export const Gallery: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {[
        Github,
        User,
        Users,
        Plus,
        Pencil,
        Trash2,
        Eye,
        Share2,
        Globe,
        LayoutGrid,
        LogIn,
        LogOut,
      ].map((Icon, index) => (
        <Icon key={index} size={24} aria-hidden />
      ))}
    </div>
  ),
};
