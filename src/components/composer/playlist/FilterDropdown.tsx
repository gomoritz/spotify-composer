import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"
import { Filter } from "@components/PlaylistPicker"

type Props = {
	current: Filter
	options: string[]
	setFilter: React.Dispatch<React.SetStateAction<Filter>>
}

const FilterDropdown: React.FC<Props> = ({ current, options, setFilter }) => {
	const [expanded, setExpanded] = useState(false)

	const changeFilter = (option: Filter) => {
		setExpanded(false)
		setFilter(option)
	}
	return (
		<div className="sticky z-20 flex justify-end mt-10">
			<div className="relative w-52 block text-left">
				<div>
					<button
						onClick={() => setExpanded(prev => !prev)}
						type="button"
						className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
						id="options-menu"
						aria-expanded="true"
						aria-haspopup="true"
					>
						{current[0].toUpperCase() + current.substr(1, current.length - 1)} playlists
						<svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fillRule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
				<AnimatePresence>
					{expanded && (
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: -10 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.25 }}
							className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
							role="menu"
							aria-orientation="vertical"
							aria-labelledby="options-menu"
						>
							<div className="py-1" role="none">
								{options.map(
									option =>
										option !== current && (
											<p
												onClick={() => changeFilter(option as Filter)}
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
												key={option}
											>
												{option[0].toUpperCase() + option.substr(1, option.length)} playlists
											</p>
										)
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default FilterDropdown
