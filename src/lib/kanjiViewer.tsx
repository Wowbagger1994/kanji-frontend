import React, { useState, useEffect } from "react";
import KanjivgAnimate from "./KanjivgAnimate";

// Define constants and types for better TypeScript integration
const colours = ["red", "orange", "green", "blue", "goldenrod"];
const kanjiSVGID = "kanji-svg";

// Interface for properties passed to the component
interface KanjiViewerProps {
	codepoint_ucs: string;
}

// KanjiViewer component
const KanjiViewer: React.FC<KanjiViewerProps> = ({ codepoint_ucs }) => {
	const [svg, setSvg] = useState<SVGElement | null>(null);
	const [strokeOrdersVisible, setStrokeOrdersVisible] = useState(false);
	const [colorGroups, setColorGroups] = useState(false);
	const [radicalsVisible, setRadicalsVisible] = useState(false);
	const [kanjiCharacter, setKanjiCharacter] = useState(codepoint_ucs);

	// Load the SVG for the kanji character
	useEffect(() => {
		if (codepoint_ucs) {
			loadKanjiVG(codepoint_ucs);
		}
	}, [codepoint_ucs]);

	// Load KanjiVG data from URL (replace with actual API fetching if needed)
	const loadKanjiVG = async (codepoint_ucs?: string) => {
		try {
			const url = `/kanji/0${codepoint_ucs}.svg`;
			const response = await fetch(url, {
				headers: { "Content-Type": "image/svg+xml" },
			});
			const svgData = await response.text();
			const parser = new DOMParser();
			const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
			const svgElement = svgDoc.documentElement as unknown as SVGElement;
			setSvg(svgElement);
			new KanjivgAnimate("#animate");
		} catch (error) {
			console.error("Error loading KanjiVG data:", error);
		}
	};

	// Handle showing radicals
	const handleRadicals = () => {
		setRadicalsVisible(!radicalsVisible);
	};

	// Handle showing color groups
	const handleColorGroups = () => {
		setColorGroups(!colorGroups);
	};

	// Handle displaying stroke orders
	const handleStrokeOrders = () => {
		setStrokeOrdersVisible(!strokeOrdersVisible);
	};

	return (
		<div>
			{/* <div>
				<label>
					<input
						type="checkbox"
						checked={strokeOrdersVisible}
						onChange={handleStrokeOrders}
					/>
					Display Stroke Orders
				</label>
				<label>
					<input
						type="checkbox"
						checked={colorGroups}
						onChange={handleColorGroups}
					/>
					Display Color Groups
				</label>
				<label>
					<input
						type="checkbox"
						checked={radicalsVisible}
						onChange={handleRadicals}
					/>
					Display Radicals
				</label>
			</div> */}

			<div>
				{svg ? (
					<div>
						<figure>
							{/* Display the loaded SVG */}
							<svg
								id="kanji-svg"
								dangerouslySetInnerHTML={{
									__html: svg.outerHTML,
								}}
							/>
							<figcaption>{kanjiCharacter}</figcaption>
						</figure>
					</div>
				) : (
					<p>Loading Kanji...</p>
				)}
			</div>
		</div>
	);
};

export default KanjiViewer;
