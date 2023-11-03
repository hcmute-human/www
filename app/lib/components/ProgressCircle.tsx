import { type AriaProgressBarProps, useProgressBar } from 'react-aria';

const center = 16;
const strokeWidth = 4;
const r = 16 - strokeWidth;
const c = 2 * r * Math.PI;

export default function ProgressCircle({
  className,
  ...props
}: AriaProgressBarProps & { className?: string }) {
  const { isIndeterminate, value, minValue = 0, maxValue = 100 } = props;
  const { progressBarProps } = useProgressBar(props);

  const percentage = isIndeterminate
    ? 0.25
    : (value! - minValue) / (maxValue - minValue);
  const offset = c - percentage * c;

  return (
    <svg
      {...progressBarProps}
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth={strokeWidth}
      className={className}
    >
      <circle
        role="presentation"
        cx={center}
        cy={center}
        r={r}
        stroke="currentColor"
        className="opacity-20"
      />
      <circle
        role="presentation"
        cx={center}
        cy={center}
        r={r}
        stroke="currentColor"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
        transform="rotate(-90 16 16)"
      >
        {props.isIndeterminate && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            begin="0s"
            dur="1s"
            from="0 16 16"
            to="360 16 16"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
}
