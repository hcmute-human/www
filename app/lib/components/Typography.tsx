export default function Typography({
	className,
	...props
}: React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>) {
	return (
		<div {...props} className={className ? 'typo ' + className : className} />
	);
}
