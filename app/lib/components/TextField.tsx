import { cn } from "@lib/utils";
import { forwardRef } from "react";
import Input from "./Input";
import Label from "./Label";
import {
  type TextFieldProps,
  Text,
  TextField as AriaTextField,
} from "react-aria-components";

interface Props extends TextFieldProps {
  name: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  {
    label,
    labelClassName,
    inputClassName,
    description,
    errorMessage,
    ...props
  }: Props,
  ref
) {
  const invalid = errorMessage != null;
  return (
    <AriaTextField ref={ref} {...props} isInvalid={invalid}>
      <Label className={cn("mb-0.5", labelClassName)}>{label}</Label>
      <Input
        ref={ref}
        name={props.name}
        className={cn(inputClassName, { "peer border-negative-500": invalid })}
      />
      {description ? (
        <Text slot="description" className="text-neutral-700 text-xs mt-0.5">
          {description}
        </Text>
      ) : null}
      {invalid ? (
        <Text
          slot="errorMessage"
          className="text-negative-500 text-xs mt-0.5
					peer-rac-invalid:transition peer-rac-invalid:ease-in-out peer-rac-invalid:duration-300
					peer-rac-invalid:animate-in peer-rac-invalid:fade-in peer-rac-invalid:slide-in-from-top-4"
        >
          {errorMessage}
        </Text>
      ) : null}
    </AriaTextField>
  );
});

export default TextField;
