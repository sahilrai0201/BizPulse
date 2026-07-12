import { useState } from "react";
import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = () => {
	const [name, setName] = useState("Sahil Rai");
	const [email, setEmail] = useState("sahilrai@example.com");

	const handleEditProfile = () => {
		const newName = prompt("Enter your new profile name:", name);
		const newEmail = prompt("Enter your new email address:", email);
		if (newName) {
			setName(newName);
		}
		if (newEmail) {
			setEmail(newEmail);
		}
	};

	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className='flex flex-col sm:flex-row items-center mb-6'>
				<img
					src='/mr_bean.jpg'
					alt='Profile'
					className='rounded-full w-20 h-20 object-cover mr-4'
				/>

				<div className="text-left">
					<h3 className='text-lg font-semibold text-gray-100'>{name}</h3>
					<p className='text-gray-400'>{email}</p>
				</div>
			</div>

			<button 
				onClick={handleEditProfile}
				className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'
			>
				Edit Profile
			</button>
		</SettingSection>
	);
};

export default Profile;
