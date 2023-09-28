import { type ButtonProps } from 'react-aria-components';
import { useFormState } from 'react-hook-form';
import Button from './Button';

export default function ControlledButton({
  isDisabled,
  ...props
}: ButtonProps) {
  const { errors } = useFormState();
  return (
    <Button
      {...props}
      isDisabled={
        !!isDisabled ||
        Object.keys(errors).filter((v) => !v.startsWith('root')).length > 0
      }
    />
  );
}
