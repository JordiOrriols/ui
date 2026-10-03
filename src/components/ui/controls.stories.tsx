import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "./label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

export default {
  title: "UI/Copied Ladders controls",
  tags: ["autodocs"],
  subcomponents: {
    Input,
    Label,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  },
} satisfies Meta;
type Story = StoryObj;
export const Fields: Story = {
  render: () => (
    <div className="space-y-3 max-w-sm">
      <Label htmlFor="example">Email</Label>
      <Input id="example" type="email" placeholder="you@example.com" />
      <Input aria-label="Disabled" disabled placeholder="Disabled input" />
      <Input aria-label="Invalid" aria-invalid defaultValue="Invalid value" />
    </div>
  ),
};
export const TabNavigation: Story = {
  render: () => (
    <Tabs defaultValue="one">
      <TabsList>
        <TabsTrigger value="one">Overview</TabsTrigger>
        <TabsTrigger value="two">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Overview content</TabsContent>
      <TabsContent value="two">Details content</TabsContent>
    </Tabs>
  ),
};
export const ConfirmationDialog: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger>Delete item</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The item will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
