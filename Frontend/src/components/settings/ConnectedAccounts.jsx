import { useState } from "react";
import SettingSection from "./SettingSection";
import { HelpCircle, Plus } from "lucide-react";

const ConnectedAccounts = () => {
	const [connectedAccounts, setConnectedAccounts] = useState([
		{
			id: 1,
			name: "Google",
			connected: true,
			icon: "/google.png",
			url: "https://accounts.google.com"
		},
		{
			id: 2,
			name: "Facebook",
			connected: false,
			icon: "/facebook.svg",
			url: "https://www.facebook.com"
		},
		{
			id: 3,
			name: "Twitter",
			connected: true,
			icon: "/x.png",
			url: "https://x.com"
		},
	]);

	const handleConnectToggle = (account) => {
		setConnectedAccounts(
			connectedAccounts.map((acc) => {
				if (acc.id === account.id) {
					return {
						...acc,
						connected: !acc.connected,
					};
				}
				return acc;
			})
		);
		// Open the connection authentication link in a new tab
		window.open(account.url, "_blank");
	};

	const handleAddAccount = () => {
		const service = prompt("Enter the service domain you wish to link (e.g., github.com):");
		if (service) {
			const cleanUrl = service.replace(/^(https?:\/\/)?(www\.)?/, "");
			window.open(`https://${cleanUrl}`, "_blank");
		}
	};

	return (
		<SettingSection icon={HelpCircle} title={"Connected Accounts"}>
			{connectedAccounts.map((account) => (
				<div key={account.id} className='flex items-center justify-between py-3'>
					<div 
						className='flex gap-1 cursor-pointer hover:text-white group transition'
						onClick={() => window.open(account.url, "_blank")}
						title={`Go to ${account.name}`}
					>
						<img src={account.icon} alt='Social img' className='size-6 object-cover rounded-full mr-2 group-hover:scale-105 transition' />
						<span className='text-gray-300 group-hover:text-white font-medium'>{account.name}</span>
					</div>
					<button
						className={`px-3 py-1 rounded text-sm font-semibold ${
							account.connected ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
						} transition duration-200`}
						onClick={() => handleConnectToggle(account)}
					>
						{account.connected ? "Connected" : "Connect"}
					</button>
				</div>
			))}
			<button 
				onClick={handleAddAccount}
				className='mt-4 flex items-center text-indigo-400 hover:text-indigo-300 font-semibold transition duration-200'
			>
				<Plus size={18} className='mr-2' /> Add Account
			</button>
		</SettingSection>
	);
};

export default ConnectedAccounts;
