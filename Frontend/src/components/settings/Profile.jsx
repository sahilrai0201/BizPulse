import { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import SettingSection from "./SettingSection";
import axios from "axios";

const Profile = () => {
	const [profile, setProfile] = useState({
		businessName: "Loading...",
		email: "Loading...",
		mobileNumber: "",
		gstNumber: ""
	});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/user/profile`);
				if (response.status === 200) {
					setProfile({
						businessName: response.data.BusinessName || "N/A",
						email: response.data.email || "N/A",
						mobileNumber: response.data.mobileNumber || "N/A",
						gstNumber: response.data.gstNumber || "N/A"
					});
				}
			} catch (err) {
				console.error("Error fetching user profile:", err);
				setProfile({
					businessName: "Error loading profile",
					email: "Please try signing in again",
					mobileNumber: "N/A",
					gstNumber: "N/A"
				});
			}
		};
		fetchProfile();
	}, []);

	const handleLogout = () => {
		if (window.confirm("Are you sure you want to logout?")) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
	};

	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className='flex flex-col sm:flex-row items-center mb-6'>
				<img
					src='/mr_bean.jpg'
					alt='Profile'
					className='rounded-full w-20 h-20 object-cover mr-4 mb-4 sm:mb-0'
				/>

				<div className="text-left flex-grow">
					<h3 className='text-xl font-bold text-gray-100'>{profile.businessName}</h3>
					<p className='text-gray-400 mb-2'>{profile.email}</p>
					
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm text-gray-300">
						<div>
							<strong className="text-gray-400">Mobile:</strong> {profile.mobileNumber}
						</div>
						<div>
							<strong className="text-gray-400">GST:</strong> {profile.gstNumber}
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-4 mt-6">
				<button 
					onClick={handleLogout}
					className='flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto cursor-pointer'
				>
					<LogOut size={16} className="mr-2" />
					Logout
				</button>
			</div>
		</SettingSection>
	);
};

export default Profile;
