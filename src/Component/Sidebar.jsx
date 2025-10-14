import { useState } from "react"
import { Link } from "react-router-dom"
import {
	Bars3Icon,
	XMarkIcon,
	HomeIcon,
	UserGroupIcon,
	ChevronDownIcon,
	ChartBarIcon,
	Cog6ToothIcon,
	ClipboardDocumentListIcon, DocumentChartBarIcon, DocumentTextIcon 
	} from "@heroicons/react/24/outline"

export const Sidebar = ({open, setOpen}) =>{
	// const [open, setOpen] = useState(true)          // controls sidebar open/close
	const [openForms, setOpenForms] = useState(false)
	const [openSettings, setOpenSettings] = useState(false) 
	const [openRecords, setOpenRecords] = useState(false)

	return (
		<div
		className={`fixed top-0 left-0 h-full bg-gradient-to-b from-emerald-900 via-teal-800 to-black backdrop-blur-lg border-r border-white/20 shadow-xl z-50 transition-all duration-300 ${
    	open ? "w-56" : "w-16"
		} flex flex-col`}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4 text-white">
				<span className="font-bold tracking-wide">{open && "Peak Budget System"}</span>
				<button onClick={() => setOpen(!open)}>
					{open ? (
						<XMarkIcon className="h-6 w-6 text-gray-300 hover:text-white transition" />
					) : (
						<Bars3Icon className="h-6 w-6 text-gray-300 hover:text-white transition" />
					)}
				</button>
			</div>

			{/* Nav */}
			<nav className="flex-1 px-2 space-y-2 text-gray-300">
				<Link
					to="/dashboard"
					className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition"
				>
					<HomeIcon className="h-5 w-5" />
					{open && "Dashboard"}
				</Link>
				<Link
					to="/budget-estimate"
					className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition"
				>
					<DocumentChartBarIcon  className="h-5 w-5" />
					{open && "Budget Estimate"}
				</Link>
				{/* Request Forms expandable */}
				<div>
					<button
					onClick={() => setOpenForms(!openForms)}
					className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition w-full justify-between"
					>
					<span className="flex items-center gap-2">
						<DocumentTextIcon className="h-5 w-5" />
						{open && "Request Forms"}
					</span>
					{open && (
						<ChevronDownIcon
						className={`h-4 w-4 transition-transform ${
							openForms ? "rotate-180" : ""
						}`}
						/>
					)}
					</button>
					{openForms && open && (
					<div className="ml-8 space-y-1">
						<Link
						to="/budget-request"
						className="block p-1 text-sm hover:underline"
						>
						{/* <a href="#" className="block p-1 text-sm hover:underline"> */}
						Budget
						{/* </a> */}
						</Link>
						<Link
						to="/realignment-request"
						className="block p-1 text-sm hover:underline"
						>
						{/* <a href="#" className="block p-1 text-sm hover:underline"> */}
						Re-alignment
						{/* </a> */}
						</Link>
					</div>
					)}
				</div>
				{/* Records expandable */}
				<div>
					<button
					onClick={() => setOpenRecords(!openRecords)}
					className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition w-full justify-between"
					>
						<span className="flex items-center gap-2">
							<ClipboardDocumentListIcon  className="h-5 w-5" />
							{open && "Records"}
						</span>
						{open && (
							<ChevronDownIcon
							className={`h-4 w-4 transition-transform ${
								openRecords ? "rotate-180" : ""
							}`}
							/>
						)}
					</button>
					{openRecords && open && (
					<div className="ml-8 space-y-1">
						<Link
						to="/budget-request-record"
						className="block p-1 text-sm hover:underline"
						>
							Budget Request
						</Link>
						<Link
						to="/realignment-request-record"
						className="block p-1 text-sm hover:underline"
						>
							Re-alignment Request
						</Link>
					</div>
					)}
				</div>
				<a
					href="#"
					className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
				>
					<ChartBarIcon className="h-5 w-5" />
					{open && "Reports"}
				</a>
				{/* Request Forms expandable */}
				<div>
					<button
					onClick={() => setOpenSettings(!openSettings)}
					className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 hover:text-white transition w-full justify-between"
					>
						<span className="flex items-center gap-2">
							<Cog6ToothIcon className="h-5 w-5" />
							{open && "Settings"}
						</span>
						{open && (
							<ChevronDownIcon
							className={`h-4 w-4 transition-transform ${
								openSettings ? "rotate-180" : ""
							}`}
							/>
						)}
					</button>
					{openSettings && open && (
					<div className="ml-8 space-y-1">
						<Link
						to="/user-management"
						className="block p-1 text-sm hover:underline"
						>
							User
						</Link>
						<Link
						to="/budget-source-management"
						className="block p-1 text-sm hover:underline"
						>
							Budget Source
						</Link>
						<Link
						to="/category-management"
						className="block p-1 text-sm hover:underline"
						>
							Category
						</Link>
						<Link
						to="/location-management"
						className="block p-1 text-sm hover:underline"
						>
							Location
						</Link>
						<Link
						to="/project-management"
						className="block p-1 text-sm hover:underline"
						>
							Project
						</Link>
						<Link
						to="/expense-account-management"
						className="block p-1 text-sm hover:underline"
						>
							Expense Account
						</Link>
					</div>
					)}
				</div>
			</nav>
			{/* Profile */}
			<div className="p-4 border-t border-white/20 flex items-center gap-3 bg-white/5 hover:bg-white/10 transition">
				<img
					src="https://i.pravatar.cc/40"
					alt="profile"
					className="h-9 w-9 rounded-full border-2 border-white/30"
				/>
				{open && (
					<span className="text-sm font-medium text-gray-200 tracking-wide">
					Tom Cook
					</span>
				)}
			</div>
		</div>
	)
}
