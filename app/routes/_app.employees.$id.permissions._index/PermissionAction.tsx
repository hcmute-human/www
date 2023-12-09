import Checkbox from '@components/Checkbox';

interface Props {
  text: string;
  defaultSelected: boolean;
  onChange: (isSelected: boolean) => void;
  isError: boolean;
}

export default function PermissionAction({ text, defaultSelected, onChange, isError }: Props) {
  return (
    <div>
      <Checkbox
        isRequired
        id="rememberMe"
        name="rememberMe"
        defaultSelected={defaultSelected}
        onChange={onChange}
        className="flex gap-x-2 items-center w-fit"
      >
        <span className={isError ? 'text-negative-500' : undefined}>{text}</span>
      </Checkbox>
    </div>
  );
}
