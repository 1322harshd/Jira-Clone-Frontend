import { useState } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/components/settings.css";

function ProfileDetailsForm({currentUser, onSaved}){
    const [detailsForm, setDetailsForm] = useState({name: currentUser?.name || "", email: currentUser?.email || ""});
    const [detailsError, setDetailsError] = useState("");
    const [detailsSuccess, setDetailsSuccess] = useState("");
    const [detailsSaving, setDetailsSaving] = useState(false);

    const handleDetailsChange = (e) => {
        setDetailsForm({...detailsForm, [e.target.name]: e.target.value});
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        setDetailsError("");
        setDetailsSuccess("");
        setDetailsSaving(true);

        try{
            await api.put("/updatedetails", detailsForm);
            onSaved(detailsForm);
            setDetailsSuccess("Details updated successfully.");
        }catch(err){
            setDetailsError(err.response?.data?.message || "Could not update details");
        }finally{
            setDetailsSaving(false);
        }
    };

    return (
        <form className="settings-form" onSubmit={handleDetailsSubmit}>
            <div className="settings-field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" value={detailsForm.name} onChange={handleDetailsChange} />
            </div>

            <div className="settings-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={detailsForm.email} onChange={handleDetailsChange} />
            </div>

            {detailsError && <p className="settings-message settings-message-error">{detailsError}</p>}
            {detailsSuccess && <p className="settings-message settings-message-success">{detailsSuccess}</p>}

            <button type="submit" className="settings-btn" disabled={detailsSaving}>
                {detailsSaving ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}

function ChangePasswordForm(){
    const [passwordForm, setPasswordForm] = useState({oldPassword: "", newPassword: "", confirmPassword: ""});
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordSaving, setPasswordSaving] = useState(false);

    const handlePasswordChange = (e) => {
        setPasswordForm({...passwordForm, [e.target.name]: e.target.value});
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if(passwordForm.newPassword !== passwordForm.confirmPassword){
            setPasswordError("New passwords do not match");
            return;
        }

        setPasswordSaving(true);

        try{
            await api.put("/changepassword", {
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword,
            });
            setPasswordForm({oldPassword: "", newPassword: "", confirmPassword: ""});
            setPasswordSuccess("Password changed successfully.");
        }catch(err){
            setPasswordError(err.response?.data?.message || "Could not change password");
        }finally{
            setPasswordSaving(false);
        }
    };

    return (
        <form className="settings-form" onSubmit={handlePasswordSubmit}>
            <div className="settings-field">
                <label htmlFor="oldPassword">Current Password</label>
                <input id="oldPassword" name="oldPassword" type="password" value={passwordForm.oldPassword} onChange={handlePasswordChange} />
            </div>

            <div className="settings-field">
                <label htmlFor="newPassword">New Password</label>
                <input id="newPassword" name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} />
            </div>

            <div className="settings-field">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
            </div>

            {passwordError && <p className="settings-message settings-message-error">{passwordError}</p>}
            {passwordSuccess && <p className="settings-message settings-message-success">{passwordSuccess}</p>}

            <button type="submit" className="settings-btn" disabled={passwordSaving}>
                {passwordSaving ? "Saving..." : "Change Password"}
            </button>
        </form>
    );
}

export default function Settings(){
    const { currentUser, setCurrentUser } = useAuth();

    const handleDetailsSaved = (updatedFields) => {
        setCurrentUser({...currentUser, ...updatedFields});
    };

    return(
        <main className="settings-page">
            <div className="settings-page-header">
                <span>Account</span>
                <h1>Settings</h1>
            </div>

            <section className="settings-panel">
                <div className="settings-panel-header">
                    <h2>Profile Details</h2>
                    <p>Update your name and email address.</p>
                </div>

                <ProfileDetailsForm key={currentUser?.id || "pending"} currentUser={currentUser} onSaved={handleDetailsSaved} />
            </section>

            <section className="settings-panel">
                <div className="settings-panel-header">
                    <h2>Change Password</h2>
                    <p>Choose a new password for your account.</p>
                </div>

                <ChangePasswordForm />
            </section>
        </main>
    );
}
