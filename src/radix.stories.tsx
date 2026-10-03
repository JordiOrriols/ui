import type { Meta, StoryObj } from "@storybook/react-vite";
import * as R from "./radix";
import { User } from "./icons";

export default {
  title: "Radix/Official primitives",
  parameters: {
    docs: {
      description: {
        component:
          "Direct upstream exports: no wrappers, styling, or API changes. These examples are intentionally unstyled. Use Views for the extracted Ladders design.",
      },
    },
  },
} satisfies Meta;
type Story = StoryObj;
export const Accordion: Story = {
  render: () => (
    <R.Accordion.Root type="single" collapsible>
      <R.Accordion.Item value="item">
        <R.Accordion.Header>
          <R.Accordion.Trigger>Details</R.Accordion.Trigger>
        </R.Accordion.Header>
        <R.Accordion.Content>Accordion content</R.Accordion.Content>
      </R.Accordion.Item>
    </R.Accordion.Root>
  ),
};
export const AccessibleIcon: Story = {
  render: () => (
    <R.AccessibleIcon.Root label="User">
      <User />
    </R.AccessibleIcon.Root>
  ),
};
export const AlertDialog: Story = {
  render: () => (
    <R.AlertDialog.Root>
      <R.AlertDialog.Trigger>Confirm</R.AlertDialog.Trigger>
      <R.AlertDialog.Portal>
        <R.AlertDialog.Overlay />
        <R.AlertDialog.Content>
          <R.AlertDialog.Title>Delete?</R.AlertDialog.Title>
          <R.AlertDialog.Description>This cannot be undone.</R.AlertDialog.Description>
          <R.AlertDialog.Cancel>Cancel</R.AlertDialog.Cancel>
          <R.AlertDialog.Action>Delete</R.AlertDialog.Action>
        </R.AlertDialog.Content>
      </R.AlertDialog.Portal>
    </R.AlertDialog.Root>
  ),
};
export const AspectRatio: Story = {
  render: () => (
    <div style={{ width: 300 }}>
      <R.AspectRatio.Root ratio={16 / 9}>
        <div className="h-full bg-slate-100">16:9</div>
      </R.AspectRatio.Root>
    </div>
  ),
};
export const Avatar: Story = {
  render: () => (
    <R.Avatar.Root>
      <R.Avatar.Image src="/missing-avatar.png" alt="Ada" />
      <R.Avatar.Fallback>AL</R.Avatar.Fallback>
    </R.Avatar.Root>
  ),
};
export const Checkbox: Story = {
  render: () => (
    <R.Checkbox.Root aria-label="Accept" defaultChecked>
      <R.Checkbox.Indicator>Checked</R.Checkbox.Indicator>
    </R.Checkbox.Root>
  ),
};
export const Collapsible: Story = {
  render: () => (
    <R.Collapsible.Root>
      <R.Collapsible.Trigger>Expand</R.Collapsible.Trigger>
      <R.Collapsible.Content>More content</R.Collapsible.Content>
    </R.Collapsible.Root>
  ),
};
export const ContextMenu: Story = {
  render: () => (
    <R.ContextMenu.Root>
      <R.ContextMenu.Trigger>Right-click here</R.ContextMenu.Trigger>
      <R.ContextMenu.Portal>
        <R.ContextMenu.Content>
          <R.ContextMenu.Item>Copy</R.ContextMenu.Item>
        </R.ContextMenu.Content>
      </R.ContextMenu.Portal>
    </R.ContextMenu.Root>
  ),
};
export const Dialog: Story = {
  render: () => (
    <R.Dialog.Root>
      <R.Dialog.Trigger>Open</R.Dialog.Trigger>
      <R.Dialog.Portal>
        <R.Dialog.Content>
          <R.Dialog.Title>Details</R.Dialog.Title>
          <R.Dialog.Description>Dialog content</R.Dialog.Description>
          <R.Dialog.Close>Close</R.Dialog.Close>
        </R.Dialog.Content>
      </R.Dialog.Portal>
    </R.Dialog.Root>
  ),
};
export const Direction: Story = {
  render: () => (
    <R.Direction.Provider dir="rtl">
      <R.Toolbar.Root>
        <R.Toolbar.Button>Right to left</R.Toolbar.Button>
      </R.Toolbar.Root>
    </R.Direction.Provider>
  ),
};
export const DropdownMenu: Story = {
  render: () => (
    <R.DropdownMenu.Root>
      <R.DropdownMenu.Trigger>Actions</R.DropdownMenu.Trigger>
      <R.DropdownMenu.Portal>
        <R.DropdownMenu.Content>
          <R.DropdownMenu.Item>Save</R.DropdownMenu.Item>
          <R.DropdownMenu.Item disabled>Unavailable</R.DropdownMenu.Item>
        </R.DropdownMenu.Content>
      </R.DropdownMenu.Portal>
    </R.DropdownMenu.Root>
  ),
};
export const Form: Story = {
  render: () => (
    <R.Form.Root onSubmit={(event) => event.preventDefault()}>
      <R.Form.Field name="email">
        <R.Form.Label>Email</R.Form.Label>
        <R.Form.Control type="email" required />
        <R.Form.Message match="typeMismatch">Invalid email</R.Form.Message>
      </R.Form.Field>
      <R.Form.Submit>Submit</R.Form.Submit>
    </R.Form.Root>
  ),
};
export const HoverCard: Story = {
  render: () => (
    <R.HoverCard.Root>
      <R.HoverCard.Trigger href="#profile">Profile</R.HoverCard.Trigger>
      <R.HoverCard.Portal>
        <R.HoverCard.Content>Profile details</R.HoverCard.Content>
      </R.HoverCard.Portal>
    </R.HoverCard.Root>
  ),
};
export const Label: Story = {
  render: () => (
    <>
      <R.Label.Root htmlFor="radix-name">Name</R.Label.Root>
      <input id="radix-name" />
    </>
  ),
};
export const Menubar: Story = {
  render: () => (
    <R.Menubar.Root>
      <R.Menubar.Menu>
        <R.Menubar.Trigger>File</R.Menubar.Trigger>
        <R.Menubar.Portal>
          <R.Menubar.Content>
            <R.Menubar.Item>New</R.Menubar.Item>
          </R.Menubar.Content>
        </R.Menubar.Portal>
      </R.Menubar.Menu>
    </R.Menubar.Root>
  ),
};
export const NavigationMenu: Story = {
  render: () => (
    <R.NavigationMenu.Root>
      <R.NavigationMenu.List>
        <R.NavigationMenu.Item>
          <R.NavigationMenu.Trigger>Learn</R.NavigationMenu.Trigger>
          <R.NavigationMenu.Content>
            <R.NavigationMenu.Link href="#docs">Documentation</R.NavigationMenu.Link>
          </R.NavigationMenu.Content>
        </R.NavigationMenu.Item>
      </R.NavigationMenu.List>
    </R.NavigationMenu.Root>
  ),
};
export const Popover: Story = {
  render: () => (
    <R.Popover.Root>
      <R.Popover.Trigger>More</R.Popover.Trigger>
      <R.Popover.Portal>
        <R.Popover.Content>
          Popover content<R.Popover.Close>Close</R.Popover.Close>
        </R.Popover.Content>
      </R.Popover.Portal>
    </R.Popover.Root>
  ),
};
export const Portal: Story = {
  render: () => (
    <R.Portal.Root>
      <p>Portaled to the document body</p>
    </R.Portal.Root>
  ),
};
export const Progress: Story = {
  render: () => (
    <R.Progress.Root value={60} aria-label="Progress">
      <R.Progress.Indicator>60%</R.Progress.Indicator>
    </R.Progress.Root>
  ),
};
export const RadioGroup: Story = {
  render: () => (
    <R.RadioGroup.Root defaultValue="one" aria-label="Choice">
      {["one", "two"].map((value) => (
        <R.RadioGroup.Item key={value} value={value} aria-label={value}>
          <R.RadioGroup.Indicator />
          {value}
        </R.RadioGroup.Item>
      ))}
    </R.RadioGroup.Root>
  ),
};
export const ScrollArea: Story = {
  render: () => (
    <R.ScrollArea.Root style={{ height: 100, width: 200 }}>
      <R.ScrollArea.Viewport style={{ height: "100%" }}>
        {Array.from({ length: 20 }, (_, index) => (
          <p key={index}>Row {index}</p>
        ))}
      </R.ScrollArea.Viewport>
      <R.ScrollArea.Scrollbar orientation="vertical">
        <R.ScrollArea.Thumb />
      </R.ScrollArea.Scrollbar>
    </R.ScrollArea.Root>
  ),
};
export const Select: Story = {
  render: () => (
    <R.Select.Root defaultValue="one">
      <R.Select.Trigger aria-label="Choice">
        <R.Select.Value />
      </R.Select.Trigger>
      <R.Select.Portal>
        <R.Select.Content>
          <R.Select.Viewport>
            {["one", "two"].map((value) => (
              <R.Select.Item key={value} value={value}>
                <R.Select.ItemText>{value}</R.Select.ItemText>
                <R.Select.ItemIndicator>Selected</R.Select.ItemIndicator>
              </R.Select.Item>
            ))}
          </R.Select.Viewport>
        </R.Select.Content>
      </R.Select.Portal>
    </R.Select.Root>
  ),
};
export const Separator: Story = {
  render: () => (
    <>
      <p>Before</p>
      <R.Separator.Root />
      <p>After</p>
    </>
  ),
};
export const Slider: Story = {
  render: () => (
    <R.Slider.Root defaultValue={[50]} max={100} step={1}>
      <R.Slider.Track>
        <R.Slider.Range />
      </R.Slider.Track>
      <R.Slider.Thumb aria-label="Volume" />
    </R.Slider.Root>
  ),
};
export const Slot: Story = {
  render: () => (
    <R.Slot.Root className="text-indigo-700">
      <button>Slotted button</button>
    </R.Slot.Root>
  ),
};
export const Switch: Story = {
  render: () => (
    <R.Switch.Root aria-label="Enabled">
      <R.Switch.Thumb />
    </R.Switch.Root>
  ),
};
export const Tabs: Story = {
  render: () => (
    <R.Tabs.Root defaultValue="one">
      <R.Tabs.List>
        <R.Tabs.Trigger value="one">One</R.Tabs.Trigger>
        <R.Tabs.Trigger value="two">Two</R.Tabs.Trigger>
      </R.Tabs.List>
      <R.Tabs.Content value="one">First panel</R.Tabs.Content>
      <R.Tabs.Content value="two">Second panel</R.Tabs.Content>
    </R.Tabs.Root>
  ),
};
export const Toast: Story = {
  render: () => (
    <R.Toast.Provider>
      <R.Toast.Root defaultOpen>
        <R.Toast.Title>Saved</R.Toast.Title>
        <R.Toast.Description>Your changes were saved.</R.Toast.Description>
        <R.Toast.Close>Close</R.Toast.Close>
      </R.Toast.Root>
      <R.Toast.Viewport />
    </R.Toast.Provider>
  ),
};
export const Toggle: Story = {
  render: () => <R.Toggle.Root aria-label="Bold">Bold</R.Toggle.Root>,
};
export const ToggleGroup: Story = {
  render: () => (
    <R.ToggleGroup.Root type="single" defaultValue="left" aria-label="Alignment">
      {["left", "center", "right"].map((value) => (
        <R.ToggleGroup.Item key={value} value={value} aria-label={value}>
          {value}
        </R.ToggleGroup.Item>
      ))}
    </R.ToggleGroup.Root>
  ),
};
export const Toolbar: Story = {
  render: () => (
    <R.Toolbar.Root aria-label="Actions">
      <R.Toolbar.Button>Save</R.Toolbar.Button>
      <R.Toolbar.Separator />
      <R.Toolbar.Link href="#docs">Help</R.Toolbar.Link>
    </R.Toolbar.Root>
  ),
};
export const Tooltip: Story = {
  render: () => (
    <R.Tooltip.Provider>
      <R.Tooltip.Root>
        <R.Tooltip.Trigger>Help</R.Tooltip.Trigger>
        <R.Tooltip.Portal>
          <R.Tooltip.Content>Helpful information</R.Tooltip.Content>
        </R.Tooltip.Portal>
      </R.Tooltip.Root>
    </R.Tooltip.Provider>
  ),
};
export const VisuallyHidden: Story = {
  render: () => (
    <button>
      <User aria-hidden />
      <R.VisuallyHidden.Root>User profile</R.VisuallyHidden.Root>
    </button>
  ),
};
export const PasswordToggleField: Story = {
  render: () => (
    <R.unstable_PasswordToggleField.Root>
      <R.unstable_PasswordToggleField.Input aria-label="Password" />
      <R.unstable_PasswordToggleField.Toggle>
        Show/hide password
      </R.unstable_PasswordToggleField.Toggle>
    </R.unstable_PasswordToggleField.Root>
  ),
};
export const OneTimePasswordField: Story = {
  render: () => (
    <R.unstable_OneTimePasswordField.Root>
      <R.unstable_OneTimePasswordField.Input aria-label="One time password" />
    </R.unstable_OneTimePasswordField.Root>
  ),
};
