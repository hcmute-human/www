export default function Typography({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={className ? 'typo ' + className : className} />
  );
}
