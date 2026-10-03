import { useState, type ElementType, type ReactNode } from "react";
import * as R from "./radix";
import { User } from "./icons";

type RadixDemo = {
  component: ElementType;
  render: () => ReactNode;
};

const triggerStyle = {
  border: "1px solid #94a3b8",
  borderRadius: 4,
  padding: "0.35rem 0.65rem",
  background: "white",
  color: "#0f172a",
};

const itemStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 4,
  padding: "0.25rem 0.5rem",
  background: "white",
  color: "#0f172a",
};

function ToastDemo() {
  const [open, setOpen] = useState(true);
  return (
    <R.Toast.Provider>
      <button type="button" style={triggerStyle} onClick={() => setOpen(true)}>
        Show toast
      </button>
      <R.Toast.Root open={open} onOpenChange={setOpen}>
        <R.Toast.Title>Changes saved</R.Toast.Title>
        <R.Toast.Description>Your project has been updated.</R.Toast.Description>
        <R.Toast.Close aria-label="Dismiss notification" style={triggerStyle}>
          Dismiss
        </R.Toast.Close>
      </R.Toast.Root>
      <R.Toast.Viewport />
    </R.Toast.Provider>
  );
}

const demos: Record<string, RadixDemo> = {
  AccessibleIcon: {
    component: R.AccessibleIcon.Root,
    render: () => (
      <R.AccessibleIcon.Root label="User profile">
        <User aria-hidden />
      </R.AccessibleIcon.Root>
    ),
  },
  Accordion: {
    component: R.Accordion.Root,
    render: () => (
      <R.Accordion.Root type="single" collapsible>
        <R.Accordion.Item value="details">
          <R.Accordion.Header>
            <R.Accordion.Trigger style={triggerStyle}>Account details</R.Accordion.Trigger>
          </R.Accordion.Header>
          <R.Accordion.Content>Interactive accordion content.</R.Accordion.Content>
        </R.Accordion.Item>
      </R.Accordion.Root>
    ),
  },
  AlertDialog: {
    component: R.AlertDialog.Root,
    render: () => (
      <R.AlertDialog.Root>
        <R.AlertDialog.Trigger style={triggerStyle}>Delete item</R.AlertDialog.Trigger>
        <R.AlertDialog.Portal>
          <R.AlertDialog.Overlay />
          <R.AlertDialog.Content>
            <R.AlertDialog.Title>Delete this item?</R.AlertDialog.Title>
            <R.AlertDialog.Description>This action cannot be undone.</R.AlertDialog.Description>
            <R.AlertDialog.Cancel style={triggerStyle}>Cancel</R.AlertDialog.Cancel>{" "}
            <R.AlertDialog.Action style={triggerStyle}>Delete</R.AlertDialog.Action>
          </R.AlertDialog.Content>
        </R.AlertDialog.Portal>
      </R.AlertDialog.Root>
    ),
  },
  AspectRatio: {
    component: R.AspectRatio.Root,
    render: () => (
      <div style={{ width: 300 }}>
        <R.AspectRatio.Root ratio={16 / 9}>
          <div
            style={{
              height: "100%",
              display: "grid",
              placeItems: "center",
              background: "#e2e8f0",
              color: "#334155",
            }}
          >
            16:9 aspect ratio
          </div>
        </R.AspectRatio.Root>
      </div>
    ),
  },
  Avatar: {
    component: R.Avatar.Root,
    render: () => (
      <R.Avatar.Root>
        <R.Avatar.Image src="/missing-avatar.png" alt="Ada Lovelace" />
        <R.Avatar.Fallback delayMs={0} style={{ ...itemStyle, display: "inline-block" }}>
          AL
        </R.Avatar.Fallback>
      </R.Avatar.Root>
    ),
  },
  Checkbox: {
    component: R.Checkbox.Root,
    render: () => (
      <R.Checkbox.Root
        aria-label="Accept the terms"
        style={{ ...itemStyle, minWidth: 28, minHeight: 28 }}
      >
        <R.Checkbox.Indicator>✓</R.Checkbox.Indicator>
      </R.Checkbox.Root>
    ),
  },
  Collapsible: {
    component: R.Collapsible.Root,
    render: () => (
      <R.Collapsible.Root>
        <R.Collapsible.Trigger style={triggerStyle}>Show more</R.Collapsible.Trigger>
        <R.Collapsible.Content>Expanded content is now visible.</R.Collapsible.Content>
      </R.Collapsible.Root>
    ),
  },
  ContextMenu: {
    component: R.ContextMenu.Root,
    render: () => (
      <R.ContextMenu.Root>
        <R.ContextMenu.Trigger
          style={{
            ...triggerStyle,
            display: "grid",
            width: 240,
            height: 100,
            placeItems: "center",
            background: "#f1f5f9",
          }}
        >
          Right-click for actions
        </R.ContextMenu.Trigger>
        <R.ContextMenu.Portal>
          <R.ContextMenu.Content style={{ ...itemStyle, display: "grid", gap: 4 }}>
            <R.ContextMenu.Item style={triggerStyle}>Copy</R.ContextMenu.Item>
            <R.ContextMenu.Item style={triggerStyle}>Rename</R.ContextMenu.Item>
          </R.ContextMenu.Content>
        </R.ContextMenu.Portal>
      </R.ContextMenu.Root>
    ),
  },
  Dialog: {
    component: R.Dialog.Root,
    render: () => (
      <R.Dialog.Root>
        <R.Dialog.Trigger style={triggerStyle}>Open dialog</R.Dialog.Trigger>
        <R.Dialog.Portal>
          <R.Dialog.Overlay />
          <R.Dialog.Content>
            <R.Dialog.Title>Project details</R.Dialog.Title>
            <R.Dialog.Description>Review the current project information.</R.Dialog.Description>
            <R.Dialog.Close style={triggerStyle}>Close</R.Dialog.Close>
          </R.Dialog.Content>
        </R.Dialog.Portal>
      </R.Dialog.Root>
    ),
  },
  Direction: {
    component: R.Direction.Provider,
    render: () => (
      <R.Direction.Provider dir="rtl">
        <R.Toolbar.Root aria-label="Right-to-left actions">
          <R.Toolbar.Button style={triggerStyle}>First</R.Toolbar.Button>
          <R.Toolbar.Button style={triggerStyle}>Second</R.Toolbar.Button>
          <R.Toolbar.Button style={triggerStyle}>Third</R.Toolbar.Button>
        </R.Toolbar.Root>
      </R.Direction.Provider>
    ),
  },
  DropdownMenu: {
    component: R.DropdownMenu.Root,
    render: () => (
      <R.DropdownMenu.Root>
        <R.DropdownMenu.Trigger style={triggerStyle}>Actions</R.DropdownMenu.Trigger>
        <R.DropdownMenu.Portal>
          <R.DropdownMenu.Content style={{ ...itemStyle, display: "grid", gap: 4 }}>
            <R.DropdownMenu.Item style={triggerStyle}>Save</R.DropdownMenu.Item>
            <R.DropdownMenu.Item style={triggerStyle}>Duplicate</R.DropdownMenu.Item>
            <R.DropdownMenu.Item disabled style={{ ...triggerStyle, opacity: 0.5 }}>
              Unavailable
            </R.DropdownMenu.Item>
          </R.DropdownMenu.Content>
        </R.DropdownMenu.Portal>
      </R.DropdownMenu.Root>
    ),
  },
  Form: {
    component: R.Form.Root,
    render: () => (
      <R.Form.Root
        onSubmit={(event) => event.preventDefault()}
        style={{ display: "grid", gap: 8, maxWidth: 280 }}
      >
        <R.Form.Field name="email">
          <R.Form.Label>Email</R.Form.Label>
          <R.Form.Control type="email" required style={itemStyle} />
          <R.Form.Message match="typeMismatch">Enter a valid email address.</R.Form.Message>
        </R.Form.Field>
        <R.Form.Submit style={triggerStyle}>Submit</R.Form.Submit>
      </R.Form.Root>
    ),
  },
  HoverCard: {
    component: R.HoverCard.Root,
    render: () => (
      <R.HoverCard.Root openDelay={100}>
        <R.HoverCard.Trigger href="#profile">
          Hover or focus for profile details
        </R.HoverCard.Trigger>
        <R.HoverCard.Portal>
          <R.HoverCard.Content style={itemStyle}>Ada Lovelace · Engineer</R.HoverCard.Content>
        </R.HoverCard.Portal>
      </R.HoverCard.Root>
    ),
  },
  Label: {
    component: R.Label.Root,
    render: () => (
      <div style={{ display: "grid", gap: 4, maxWidth: 240 }}>
        <R.Label.Root htmlFor="radix-label-email">Email address</R.Label.Root>
        <input id="radix-label-email" type="email" style={itemStyle} />
      </div>
    ),
  },
  Menubar: {
    component: R.Menubar.Root,
    render: () => (
      <R.Menubar.Root>
        <R.Menubar.Menu>
          <R.Menubar.Trigger style={triggerStyle}>File</R.Menubar.Trigger>
          <R.Menubar.Portal>
            <R.Menubar.Content style={{ ...itemStyle, display: "grid", gap: 4 }}>
              <R.Menubar.Item style={triggerStyle}>New</R.Menubar.Item>
              <R.Menubar.Item style={triggerStyle}>Open</R.Menubar.Item>
            </R.Menubar.Content>
          </R.Menubar.Portal>
        </R.Menubar.Menu>
      </R.Menubar.Root>
    ),
  },
  NavigationMenu: {
    component: R.NavigationMenu.Root,
    render: () => (
      <R.NavigationMenu.Root>
        <R.NavigationMenu.List>
          <R.NavigationMenu.Item>
            <R.NavigationMenu.Trigger style={triggerStyle}>Learn</R.NavigationMenu.Trigger>
            <R.NavigationMenu.Content style={itemStyle}>
              <R.NavigationMenu.Link href="#docs">Documentation</R.NavigationMenu.Link>
            </R.NavigationMenu.Content>
          </R.NavigationMenu.Item>
        </R.NavigationMenu.List>
      </R.NavigationMenu.Root>
    ),
  },
  Popover: {
    component: R.Popover.Root,
    render: () => (
      <R.Popover.Root>
        <R.Popover.Trigger style={triggerStyle}>Open popover</R.Popover.Trigger>
        <R.Popover.Portal>
          <R.Popover.Content style={itemStyle}>
            Choose an option. <R.Popover.Close style={triggerStyle}>Close</R.Popover.Close>
          </R.Popover.Content>
        </R.Popover.Portal>
      </R.Popover.Root>
    ),
  },
  Portal: {
    component: R.Portal.Root,
    render: () => (
      <R.Portal.Root>
        <p role="status">This content is rendered through a portal.</p>
      </R.Portal.Root>
    ),
  },
  Progress: {
    component: R.Progress.Root,
    render: () => (
      <R.Progress.Root value={60} aria-label="Upload progress">
        <R.Progress.Indicator
          style={{
            display: "block",
            width: "60%",
            height: 12,
            borderRadius: 6,
            background: "#4f46e5",
          }}
        />
      </R.Progress.Root>
    ),
  },
  RadioGroup: {
    component: R.RadioGroup.Root,
    render: () => (
      <R.RadioGroup.Root defaultValue="standard" aria-label="Shipping speed">
        {[
          ["standard", "Standard"],
          ["express", "Express"],
        ].map(([value, label]) => (
          <label key={value} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <R.RadioGroup.Item value={value} aria-label={label} style={itemStyle}>
              <R.RadioGroup.Indicator>●</R.RadioGroup.Indicator>
            </R.RadioGroup.Item>
            {label}
          </label>
        ))}
      </R.RadioGroup.Root>
    ),
  },
  ScrollArea: {
    component: R.ScrollArea.Root,
    render: () => (
      <R.ScrollArea.Root style={{ height: 120, width: 220, border: "1px solid #cbd5e1" }}>
        <R.ScrollArea.Viewport style={{ height: "100%" }}>
          {Array.from({ length: 12 }, (_, index) => (
            <p key={index} style={{ margin: "0.5rem", borderBottom: "1px solid #e2e8f0" }}>
              Scrollable row {index + 1}
            </p>
          ))}
        </R.ScrollArea.Viewport>
        <R.ScrollArea.Scrollbar orientation="vertical">
          <R.ScrollArea.Thumb />
        </R.ScrollArea.Scrollbar>
      </R.ScrollArea.Root>
    ),
  },
  Select: {
    component: R.Select.Root,
    render: () => (
      <R.Select.Root defaultValue="standard">
        <R.Select.Trigger aria-label="Shipping speed" style={triggerStyle}>
          <R.Select.Value />
        </R.Select.Trigger>
        <R.Select.Portal>
          <R.Select.Content style={itemStyle}>
            <R.Select.Viewport>
              {[
                ["standard", "Standard"],
                ["express", "Express"],
                ["overnight", "Overnight"],
              ].map(([value, label]) => (
                <R.Select.Item key={value} value={value} style={triggerStyle}>
                  <R.Select.ItemText>{label}</R.Select.ItemText>
                  <R.Select.ItemIndicator> ✓</R.Select.ItemIndicator>
                </R.Select.Item>
              ))}
            </R.Select.Viewport>
          </R.Select.Content>
        </R.Select.Portal>
      </R.Select.Root>
    ),
  },
  Separator: {
    component: R.Separator.Root,
    render: () => (
      <div style={{ width: 220 }}>
        <p>Content above the separator</p>
        <R.Separator.Root
          decorative={false}
          orientation="horizontal"
          style={{ display: "block", height: 1, background: "#94a3b8" }}
        />
        <p>Content below the separator</p>
      </div>
    ),
  },
  Slider: {
    component: R.Slider.Root,
    render: () => (
      <R.Slider.Root
        defaultValue={[35]}
        max={100}
        step={1}
        aria-label="Volume"
        style={{ position: "relative", display: "flex", width: 240, height: 24 }}
      >
        <R.Slider.Track
          style={{
            position: "relative",
            flexGrow: 1,
            height: 4,
            margin: "auto",
            background: "#cbd5e1",
          }}
        >
          <R.Slider.Range style={{ position: "absolute", height: "100%", background: "#4f46e5" }} />
        </R.Slider.Track>
        <R.Slider.Thumb
          aria-label="Volume"
          style={{
            display: "block",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#4f46e5",
          }}
        />
      </R.Slider.Root>
    ),
  },
  Slot: {
    component: R.Slot.Root,
    render: () => (
      <R.Slot.Root style={triggerStyle}>
        <a href="#slotted" style={{ color: "inherit" }}>
          Slotted link with merged styles
        </a>
      </R.Slot.Root>
    ),
  },
  Switch: {
    component: R.Switch.Root,
    render: () => (
      <R.Switch.Root
        aria-label="Notifications"
        style={{
          display: "inline-flex",
          alignItems: "center",
          width: 44,
          height: 24,
          padding: 2,
          border: 0,
          borderRadius: 12,
          background: "#94a3b8",
        }}
      >
        <R.Switch.Thumb
          style={{
            display: "block",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "white",
            transition: "transform 120ms",
          }}
        />
      </R.Switch.Root>
    ),
  },
  Tabs: {
    component: R.Tabs.Root,
    render: () => (
      <R.Tabs.Root defaultValue="overview">
        <R.Tabs.List aria-label="Project views">
          <R.Tabs.Trigger value="overview" style={triggerStyle}>
            Overview
          </R.Tabs.Trigger>
          <R.Tabs.Trigger value="activity" style={triggerStyle}>
            Activity
          </R.Tabs.Trigger>
        </R.Tabs.List>
        <R.Tabs.Content value="overview">Project overview content.</R.Tabs.Content>
        <R.Tabs.Content value="activity">Recent project activity.</R.Tabs.Content>
      </R.Tabs.Root>
    ),
  },
  Toast: {
    component: R.Toast.Provider,
    render: () => <ToastDemo />,
  },
  Toggle: {
    component: R.Toggle.Root,
    render: () => (
      <R.Toggle.Root aria-label="Bold" style={triggerStyle}>
        Bold
      </R.Toggle.Root>
    ),
  },
  ToggleGroup: {
    component: R.ToggleGroup.Root,
    render: () => (
      <R.ToggleGroup.Root type="single" defaultValue="left" aria-label="Text alignment">
        {["left", "center", "right"].map((value) => (
          <R.ToggleGroup.Item
            key={value}
            value={value}
            aria-label={`Align ${value}`}
            style={itemStyle}
          >
            {value}
          </R.ToggleGroup.Item>
        ))}
      </R.ToggleGroup.Root>
    ),
  },
  Toolbar: {
    component: R.Toolbar.Root,
    render: () => (
      <R.Toolbar.Root aria-label="Document actions">
        <R.Toolbar.Button style={triggerStyle}>Save</R.Toolbar.Button>
        <R.Toolbar.Separator />
        <R.Toolbar.Link href="#help">Help</R.Toolbar.Link>
      </R.Toolbar.Root>
    ),
  },
  Tooltip: {
    component: R.Tooltip.Provider,
    render: () => (
      <R.Tooltip.Provider>
        <R.Tooltip.Root>
          <R.Tooltip.Trigger style={triggerStyle}>Focus or hover</R.Tooltip.Trigger>
          <R.Tooltip.Portal>
            <R.Tooltip.Content style={itemStyle}>Helpful information</R.Tooltip.Content>
          </R.Tooltip.Portal>
        </R.Tooltip.Root>
      </R.Tooltip.Provider>
    ),
  },
  VisuallyHidden: {
    component: R.VisuallyHidden.Root,
    render: () => (
      <button type="button" aria-label="User profile">
        <User aria-hidden />
        <R.VisuallyHidden.Root>Open user profile</R.VisuallyHidden.Root>
      </button>
    ),
  },
  unstable_OneTimePasswordField: {
    component: R.unstable_OneTimePasswordField.Root,
    render: () => (
      <R.unstable_OneTimePasswordField.Root
        aria-label="One-time code"
        validationType="numeric"
        placeholder="·"
        style={{ display: "flex", gap: 8 }}
      >
        <R.unstable_OneTimePasswordField.Input
          aria-label="One-time code"
          style={{ width: 180, padding: "0.5rem", letterSpacing: "0.5rem" }}
        />
      </R.unstable_OneTimePasswordField.Root>
    ),
  },
  unstable_PasswordToggleField: {
    component: R.unstable_PasswordToggleField.Root,
    render: () => (
      <R.unstable_PasswordToggleField.Root>
        <R.unstable_PasswordToggleField.Input
          aria-label="Password"
          autoComplete="new-password"
          defaultValue="storybook-demo"
          style={{ ...itemStyle, marginRight: 8 }}
        />
        <R.unstable_PasswordToggleField.Toggle style={triggerStyle}>
          <R.unstable_PasswordToggleField.Slot
            visible={<span>Hide password</span>}
            hidden={<span>Show password</span>}
          />
        </R.unstable_PasswordToggleField.Toggle>
      </R.unstable_PasswordToggleField.Root>
    ),
  },
};

export function renderRadixDemo(name: string) {
  const demo = demos[name];
  if (!demo) throw new Error(`Missing interactive story demo for Radix namespace "${name}".`);
  return demo.render();
}
