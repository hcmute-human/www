import {
  OverlayArrow,
  Tooltip,
  type TooltipProps,
} from 'react-aria-components';

interface MyTooltipProps extends Omit<TooltipProps, 'children'> {
  children: React.ReactNode;
}

export default function MyTooltip({ children, ...props }: MyTooltipProps) {
  return (
    <Tooltip {...props}>
      <OverlayArrow>
        <svg width={8} height={8}>
          <path d="M0 0,L4 4,L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </Tooltip>
  );
}
