import { cn } from '@lib/utils';
import { NavLink, useLocation } from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
interface Props {
	className?: string;
	text?: string;
	href: string;
	Icon: any;
}
export async function loader() {}

const Navlink = ({ className, text, href, Icon }: Props) => {
	const location = useLocation();

	const active = location.pathname === href;
	console.log(active);
	return (
		<div className="w-full rounded-md pr-6 pl-2 relative">
			{active ? (
				<motion.div
					layoutId="underline"
					className={
						'absolute lg:h-full lg:w-full lg:bg-slate-400 lg:bg-opacity-20 lg:rounded-md sm:bg-primary-500 sm:w-[30%] sm:ml-2 sm:h-[2px] sm:bottom-0 h-full w-full bg-slate-400 bg-opacity-20 rounded-md'
					}
				></motion.div>
			) : (
				''
			)}
			<NavLink
				to={href}
				className={({ isActive, isPending }) =>
					cn(
						`${
							isActive ? 'text-primary-600' : 'text-gray-600'
						} w-full flex items-center gap-3 z-30`,
						className
					)
				}
			>
				{Icon}
				<p className="m-0 lg:flex flex md:hidden">{text}</p>
			</NavLink>
		</div>
	);
};

export default Navlink;
