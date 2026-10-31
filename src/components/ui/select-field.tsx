import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  indicatorClassName?: string;
}

export interface SelectFieldProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Select.Trigger>,
  "value" | "defaultValue" | "onChange" | "children" | "dir"
> {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  required?: boolean;
  placeholder?: string;
}

// Radix reserves "" for an unset value; apps also use it for valid "all"/"none" choices.
const EMPTY_VALUE = "__ui_select_empty__";
const encode = (value: string) => (value === "" ? EMPTY_VALUE : value);

export const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  function SelectField(
    {
      options,
      value,
      defaultValue,
      onValueChange,
      name,
      required,
      disabled,
      placeholder,
      className,
      ...props
    },
    ref
  ) {
    if (options.some((option) => option.value === EMPTY_VALUE))
      throw new Error(`SelectField option value "${EMPTY_VALUE}" is reserved`);
    const emptyOption = options.find((option) => option.value === "");
    const encodeValue = (current: string) =>
      current === "" && emptyOption?.disabled ? "" : encode(current);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? options[0]?.value ?? ""
    );
    const current = value ?? uncontrolledValue;
    const trigger = React.useRef<HTMLButtonElement>(null);
    const initialValue = defaultValue ?? options[0]?.value ?? "";
    React.useEffect(() => {
      const form = trigger.current?.form;
      if (!form) return;
      const reset = () => setUncontrolledValue(initialValue);
      form.addEventListener("reset", reset);
      return () => form.removeEventListener("reset", reset);
    }, [initialValue]);
    const groups = new Map<string, SelectOption[]>();
    for (const option of options) {
      if (option.value === "" && option.disabled) continue;
      const key = option.group ?? "";
      const group = groups.get(key) ?? [];
      group.push(option);
      groups.set(key, group);
    }
    return (
      <>
        <Select.Root
          value={encodeValue(current)}
          onValueChange={(next) => {
            const decoded = next === EMPTY_VALUE ? "" : next;
            setUncontrolledValue(decoded);
            onValueChange?.(decoded);
          }}
          disabled={disabled}
          required={required}
        >
          <Select.Trigger
            ref={(element) => {
              trigger.current = element;
              if (typeof ref === "function") ref(element);
              else if (ref) ref.current = element;
            }}
            disabled={disabled}
            data-slot="select-trigger"
            className={cn(
              "flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&>span:first-child]:truncate",
              className
            )}
            {...props}
          >
            <Select.Value placeholder={placeholder ?? emptyOption?.label} />
            <Select.Icon>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              position="popper"
              sideOffset={4}
              className="z-[100] max-h-[min(320px,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
            >
              <Select.ScrollUpButton className="flex items-center justify-center py-1">
                <ChevronUp className="size-4" />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-1">
                {[...groups].map(([group, items]) => (
                  <Select.Group key={group}>
                    {group && (
                      <Select.Label className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {group}
                      </Select.Label>
                    )}
                    {items.map((option) => (
                      <Select.Item
                        key={option.value}
                        value={encode(option.value)}
                        disabled={option.disabled}
                        className="relative flex cursor-default select-none items-center rounded-sm py-2 pr-8 pl-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      >
                        <Select.ItemText>
                          {option.indicatorClassName ? (
                            <span className="inline-flex min-w-0 items-center gap-2">
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "size-2 shrink-0 rounded-full",
                                  option.indicatorClassName
                                )}
                              />
                              <span className="truncate">{option.label}</span>
                            </span>
                          ) : (
                            option.label
                          )}
                        </Select.ItemText>
                        <Select.ItemIndicator className="absolute right-2 flex items-center">
                          <Check className="size-4" aria-hidden="true" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Group>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton className="flex items-center justify-center py-1">
                <ChevronDown className="size-4" />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        {name && <input type="hidden" name={name} value={current} disabled={disabled} />}
      </>
    );
  }
);
