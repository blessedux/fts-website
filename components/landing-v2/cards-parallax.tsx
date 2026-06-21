"use client";
import { FC } from "react";
import Image from "next/image";

// Types
interface iCardItem {
	title: string;
	description: string;
	tag: string;
	src: string;
	link: string;
	color: string;
	textColor: string;
}

interface iCardProps extends Omit<iCardItem, "src" | "tag"> {
	i: number;
	src: string;
}

// Components
const Card: FC<iCardProps> = ({
	title,
	description,
	color,
	textColor,
	i,
	src,
	link,
}) => {
	const cardInner = (
		<div
			className="relative flex flex-col h-[300px] w-[90vw] max-w-[700px] py-12 px-6 md:px-12
			rotate-0 md:h-[380px] items-center justify-center mx-auto 
			shadow-2xl rounded-2xl overflow-hidden border border-white/5 hover:scale-[1.02] transition-all duration-300 group"
			style={{ backgroundColor: color }}
		>
			<span className="font-bold relative text-2xl md:text-3xl mt-5 text-center leading-tight">
				<span
					className="relative z-10 font-tiemposHeadline font-black tracking-tight"
					style={{ color: textColor }}
				>
					{title}
				</span>
			</span>
			<div
				className="font-manrope text-sm md:text-base font-medium text-center mb-0 z-10 mt-4 tracking-wide text-balance max-w-md opacity-90"
				style={{ lineHeight: 1.5, color: textColor }}
			>
				{description}
			</div>

			{/* Custom Tag */}
			<div 
				className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase border rounded-full opacity-60"
				style={{ borderColor: textColor, color: textColor }}
			>
				Prensa
			</div>

			{/* Decorative Stack Number */}
			<div 
				className="absolute bottom-4 right-4 z-10 text-3xl font-extrabold font-tiemposHeadline opacity-10 select-none"
				style={{ color: textColor }}
			>
				{String(i + 1).padStart(2, '0')}
			</div>

			{/* Click indicator if link is present */}
			{link && (
				<div 
					className="absolute bottom-4 left-4 z-10 text-[10px] font-semibold tracking-wider uppercase opacity-40 group-hover:opacity-80 transition-opacity duration-300"
					style={{ color: textColor }}
				>
					Ver artículo ↗
				</div>
			)}

			{/* Background Image with Overlay */}
			<div className="absolute inset-0 z-0 opacity-[0.08] mix-blend-luminosity group-hover:scale-105 transition-transform duration-700">
				<Image
					className="w-full h-full object-cover"
					src={src}
					alt={title}
					fill
				/>
			</div>
		</div>
	);

	return (
		<div className="h-screen flex items-center justify-center sticky top-0 md:p-0 px-4">
			{link ? (
				<a
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					className="cursor-pointer z-50 block no-underline"
				>
					{cardInner}
				</a>
			) : (
				cardInner
			)}
		</div>
	);
};

/**
 * CardSlide component displays a series of cards in a vertical scroll layout
 * Each card contains a title, description, and decorative elements
 */
interface iCardSlideProps {
	items: iCardItem[];
}

const CardsParallax: FC<iCardSlideProps> = ({ items }) => {
	return (
		<div className="min-h-screen relative pb-[10vh]">
			{items.map((project, i) => {
				return <Card key={`p_${i}`} {...project} i={i} />;
			})}
		</div>
	);
};

export { CardsParallax, type iCardItem };
