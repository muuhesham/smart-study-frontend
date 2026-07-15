import "./profile.css";
import { useEffect, useState } from "react";
import api from '../../services/axios'
import { backendUrl } from "../../constants/backendUrl";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import profile from '../../assets/profile.png';

function Profile() {
    const navigate = useNavigate();

    const token = localStorage.getItem("auth");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dailyStudyHours, setDailyStudyHours] = useState(0);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 

    const [originalName, setOriginalName] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [originalHours, setOriginalHours] = useState(0);

    const getProfile = async () => {
        try {
            const response = await api.get(
                `${backendUrl}/api/profile/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const user = response.data.data;

            setName(user.name);
            setEmail(user.email);
            setDailyStudyHours(user.dailyStudyHours); 

            setOriginalName(user.name);
        setOriginalEmail(user.email);
       setOriginalHours(user.dailyStudyHours);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    const handleSave = async () => {
    try {

        if (name !== originalName) {
            await api.put(
                `${backendUrl}/api/profile/update-name`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }

        if (email !== originalEmail) {
            await api.put(
                `${backendUrl}/api/profile/update-email`,
                { newEmail: email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }

        if (dailyStudyHours !== originalHours) {
            await api.put(
                `${backendUrl}/api/profile/update-daily-hours`,
                { newDailyHours: dailyStudyHours },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }
        toast.success("Profile Updated Successfully ✅");

        getProfile();

    } catch (error) {
        toast.error("Update Failed");
    }
};

    const handleChangePassword = async () => {

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        try {

            const response = await api.put(
                `${backendUrl}/api/profile/change-password`,
                {
                    currentPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            localStorage.clear();
            localStorage.setItem(
                "auth",
                response.data.data.token
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                toast.success("Password Changed Successfully ✅");
            }, 2000);

            navigate('/');
            

        } catch (error) {
            toast.error("Failed To Change Password");
        }
    };

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(
                `${backendUrl}/api/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            localStorage.removeItem("auth");

            navigate("/");

        } catch (error) {
            toast.error("Delete Failed");
        }
    };

    return (
        <div className="profile-page">

            <h1 className="profile-title">
                My Profile
            </h1>

            <div className="profile-card">

                <div className="profile-image"><img src={profile} alt="Default Profile Picture" /></div>

                <div className="profile-info">

                    <div className="profile-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="profile-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="profile-group">
                        <label>Daily Study Hours</label>
                        <input
                            type="number"
                            value={dailyStudyHours}
                            onChange={(e) =>
                                setDailyStudyHours(Number(e.target.value))
                            }
                        />
                    </div>

                    <button
                        className="save-btn"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>

                    <hr />

                    <h2 style={{
                        fontWeight: "bolder"
                    }}>Change Password</h2>

                    <div className="profile-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                        />
                    </div>

                    <div className="profile-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                        />
                    </div>  
                                        <div className="profile-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                        />
                    </div>

                    <button
                        className="save-btn"
                        onClick={handleChangePassword}
                    >
                        Change Password
                    </button>

                    <hr />

                    <button
                        className="delete-btn"
                        onClick={handleDelete}
                    >
                        Delete Account
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Profile;