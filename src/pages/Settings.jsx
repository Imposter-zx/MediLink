import React, { useState } from 'react';
import { 
    User, Lock, Heart, Bell, Eye, Shield, 
    Download, Trash2, AlertTriangle, Save, Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';
import Slider from '../components/ui/Slider';
import TagsInput from '../components/ui/TagsInput';
import FileUpload from '../components/ui/FileUpload';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore, THEMES, CONTRAST_MODES } from '../stores/themeStore';
import ConfirmModal from '../components/ui/ConfirmModal';

const SECTIONS = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'medical', label: 'Medical Preferences', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'privacy', label: 'Privacy', icon: Shield },
];

const Settings = () => {
    const [activeSection, setActiveSection] = useState('account');
    const [saved, setSaved] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const { user } = useAuthStore();
    const themeStore = useThemeStore();
    
    // Account state
    const [accountData, setAccountData] = useState({
        fullName: user?.name || 'John Doe',
        email: user?.email || 'patient@medilink.com',
        phone: '+1 (555) 123-4567',
        profilePicture: null
    });
    
    // Security state
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
        activeSessions: [
            { device: 'Windows PC - Chrome', location: 'New York, US', lastActive: '2 minutes ago', current: true },
            { device: 'iPhone 14 Pro', location: 'New York, US', lastActive: '1 day ago', current: false },
        ]
    });
    
    // Medical preferences state
    const [medicalData, setMedicalData] = useState({
        preferredPharmacy: 'CVS Pharmacy - Main St',
        deliveryAddress: '123 Medical Lane\nNew York, NY 10001',
        allergies: ['Penicillin', 'Peanuts'],
        chronicConditions: ['Hypertension', 'Type 2 Diabetes']
    });
    
    // Notifications state
    const [notificationsData, setNotificationsData] = useState({
        medicationReminders: true,
        deliveryUpdates: true,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true
    });
    
    // Accessibility state - directly from themeStore
    const accessibilityData = {
        fontSize: themeStore.fontSizeMultiplier,
        highContrast: themeStore.contrastMode === CONTRAST_MODES.HIGH,
        darkMode: themeStore.theme === THEMES.DARK_MEDICAL,
        reduceAnimations: false // Could be added to themeStore
    };
    
    // Privacy state
    const [privacyData, setPrivacyData] = useState({
        shareDataWithPharmacy: true,
        shareDataForResearch: false,
        allowMarketing: false
    });
    
    const handleSaveAccount = () => {
        // In production, this would call an API
        console.log('Saving account data:', accountData);
        showSaveConfirmation();
    };
    
    const handleChangePassword = () => {
        if (securityData.newPassword !== securityData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        console.log('Changing password...');
        setSecurityData({
            ...securityData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        showSaveConfirmation();
    };
    
    const handleDownloadData = () => {
        const data = {
            account: accountData,
            medical: medicalData,
            notifications: notificationsData,
            privacy: privacyData,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medilink-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    const handleDeleteAccount = () => {
        console.log('Deleting account...');
        setShowDeleteModal(false);
        // In production, this would call an API and logout
    };
    
    const showSaveConfirmation = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };
    
    const renderSection = () => {
        switch (activeSection) {
            case 'account':
                return <AccountSection 
                    data={accountData}
                    setData={setAccountData}
                    onSave={handleSaveAccount}
                />;
            case 'security':
                return <SecuritySection 
                    data={securityData}
                    setData={setSecurityData}
                    onChangePassword={handleChangePassword}
                />;
            case 'medical':
                return <MedicalSection 
                    data={medicalData}
                    setData={setMedicalData}
                />;
            case 'notifications':
                return <NotificationsSection 
                    data={notificationsData}
                    setData={setNotificationsData}
                />;
            case 'accessibility':
                return <AccessibilitySection 
                    data={accessibilityData}
                    themeStore={themeStore}
                />;
            case 'privacy':
                return <PrivacySection 
                    data={privacyData}
                    setData={setPrivacyData}
                    onDownloadData={handleDownloadData}
                    onDeleteAccount={() => setShowDeleteModal(true)}
                />;
            default:
                return null;
        }
    };
    
    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
                    <p className="text-lg text-muted-foreground">
                        Manage your account, preferences, and privacy settings
                    </p>
                </div>
                
                {/* Save Confirmation */}
                {saved && (
                    <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <Check size={18} className="text-primary-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            Settings saved successfully!
                        </p>
                    </div>
                )}
                
                {/* Two-Column Layout */}
                <div className="grid lg:grid-cols-[280px_1fr] gap-6">
                    {/* Left Sidebar - Navigation */}
                    <aside className="lg:sticky lg:top-24 h-fit">
                        <Card className="overflow-hidden">
                            <nav className="p-2">
                                {SECTIONS.map((section) => {
                                    const Icon = section.icon;
                                    const isActive = activeSection === section.id;
                                    
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-md"
                                                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            <Icon size={20} />
                                            <span className="font-medium">{section.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </Card>
                    </aside>
                    
                    {/* Right Content Area */}
                    <main>
                        {renderSection()}
                    </main>
                </div>
            </div>
            
            {/* Delete Account Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                description="Are you absolutely sure you want to delete your account? This action cannot be undone. All your medical records, prescriptions, and personal data will be permanently deleted."
                confirmText="Delete Account"
                variant="danger"
            />
        </div>
    );
};

// Account Section Component
const AccountSection = ({ data, setData, onSave }) => (
    <Card>
        <CardHeader>
            <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <FileUpload
                id="profile-picture"
                label="Profile Picture"
                description="Upload a profile photo. Maximum 5MB."
                currentImage={data.profilePicture}
                onChange={(file, preview) => setData({ ...data, profilePicture: preview })}
            />
            
            <div className="space-y-2">
                <label htmlFor="fullName" className="block text-base font-semibold text-foreground">
                    Full Name
                </label>
                <input
                    type="text"
                    id="fullName"
                    value={data.fullName}
                    onChange={(e) => setData({ ...data, fullName: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-input bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                />
            </div>
            
            <div className="space-y-2">
                <label htmlFor="email" className="block text-base font-semibold text-foreground">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-input bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                />
            </div>
            
            <div className="space-y-2">
                <label htmlFor="phone" className="block text-base font-semibold text-foreground">
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phone"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-input bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                />
            </div>
            
            <div className="pt-4">
                <Button onClick={onSave} className="w-full sm:w-auto">
                    <Save size={18} />
                    Save Changes
                </Button>
            </div>
        </CardContent>
    </Card>
);

// Security Section Component
const SecuritySection = ({ data, setData, onChangePassword }) => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="currentPassword" className="block text-base font-semibold text-foreground">
                        Current Password
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={data.currentPassword}
                        onChange={(e) => setData({ ...data, currentPassword: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border-2 border-input bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-base font-semibold text-foreground">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={data.newPassword}
                        onChange={(e) => setData({ ...data, newPassword: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border-2 border-input bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-base font-semibold text-foreground">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={data.confirmPassword}
                        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border-2 border-input bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
                
                <Button onClick={onChangePassword}>
                    Update Password
                </Button>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
                <Toggle
                    id="2fa"
                    label="Enable Two-Factor Authentication"
                    description="Add an extra layer of security to your account by requiring a verification code in addition to your password."
                    checked={data.twoFactorEnabled}
                    onChange={(checked) => setData({ ...data, twoFactorEnabled: checked })}
                />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {data.activeSessions.map((session, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-foreground flex items-center gap-2">
                                    {session.device}
                                    {session.current && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                            Current
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {session.location} • {session.lastActive}
                                </p>
                            </div>
                            {!session.current && (
                                <Button variant="ghost" size="sm">
                                    Sign Out
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                <Button variant="outline" className="w-full">
                    Sign Out All Other Devices
                </Button>
            </CardContent>
        </Card>
    </div>
);

// Medical Preferences Section Component
const MedicalSection = ({ data, setData }) => (
    <Card>
        <CardHeader>
            <CardTitle>Medical Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="pharmacy" className="block text-base font-semibold text-foreground">
                    Preferred Pharmacy
                </label>
                <select
                    id="pharmacy"
                    value={data.preferredPharmacy}
                    onChange={(e) => setData({ ...data, preferredPharmacy: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-input bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                >
                    <option>CVS Pharmacy - Main St</option>
                    <option>Walgreens - Park Ave</option>
                    <option>Rite Aid - Downtown</option>
                    <option>Local Pharmacy - Elm St</option>
                </select>
            </div>
            
            <div className="space-y-2">
                <label htmlFor="deliveryAddress" className="block text-base font-semibold text-foreground">
                    Delivery Address
                </label>
                <textarea
                    id="deliveryAddress"
                    rows={3}
                    value={data.deliveryAddress}
                    onChange={(e) => setData({ ...data, deliveryAddress: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary resize-none"
                />
            </div>
            
            <TagsInput
                id="allergies"
                label="Allergies"
                description="Add any known allergies or sensitivities"
                tags={data.allergies}
                onChange={(tags) => setData({ ...data, allergies: tags })}
                placeholder="e.g., Penicillin, Peanuts"
            />
            
            <TagsInput
                id="conditions"
                label="Chronic Conditions"
                description="List any ongoing medical conditions"
                tags={data.chronicConditions}
                onChange={(tags) => setData({ ...data, chronicConditions: tags })}
                placeholder="e.g., Diabetes, Hypertension"
            />
        </CardContent>
    </Card>
);

// Notifications Section Component
const NotificationsSection = ({ data, setData }) => (
    <Card>
        <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <Toggle
                id="medication-reminders"
                label="Medication Reminders"
                description="Receive notifications when it's time to take your medication"
                checked={data.medicationReminders}
                onChange={(checked) => setData({ ...data, medicationReminders: checked })}
            />
            
            <Toggle
                id="delivery-updates"
                label="Delivery Updates"
                description="Get notified about order status and delivery tracking"
                checked={data.deliveryUpdates}
                onChange={(checked) => setData({ ...data, deliveryUpdates: checked })}
            />
            
            <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Notification Channels</h3>
                <div className="space-y-4">
                    <Toggle
                        id="email-notifications"
                        label="Email Notifications"
                        description="Receive updates via email"
                        checked={data.emailNotifications}
                        onChange={(checked) => setData({ ...data, emailNotifications: checked })}
                    />
                    
                    <Toggle
                        id="sms-notifications"
                        label="SMS Notifications"
                        description="Receive updates via text message"
                        checked={data.smsNotifications}
                        onChange={(checked) => setData({ ...data, smsNotifications: checked })}
                    />
                    
                    <Toggle
                        id="push-notifications"
                        label="Push Notifications"
                        description="Receive updates in your browser or mobile app"
                        checked={data.pushNotifications}
                        onChange={(checked) => setData({ ...data, pushNotifications: checked })}
                    />
                </div>
            </div>
        </CardContent>
    </Card>
);

// Accessibility Section Component
const AccessibilitySection = ({ data, themeStore }) => (
    <Card>
        <CardHeader>
            <CardTitle>Accessibility Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <Slider
                id="font-size"
                label="Font Size"
                description="Adjust text size for better readability"
                value={data.fontSize}
                min={0.8}
                max={1.5}
                step={0.1}
                onChange={(value) => themeStore.setFontSizeMultiplier(value)}
                formatValue={(v) => `${Math.round(v * 100)}%`}
            />
            
            <Toggle
                id="high-contrast"
                label="High Contrast Mode"
                description="Increase contrast for better visibility"
                checked={data.highContrast}
                onChange={(checked) => themeStore.setContrastMode(checked ? CONTRAST_MODES.HIGH : CONTRAST_MODES.NORMAL)}
            />
            
            <Toggle
                id="dark-mode"
                label="Dark Mode"
                description="Use dark medical theme for reduced eye strain"
                checked={data.darkMode}
                onChange={(checked) => themeStore.setTheme(checked ? THEMES.DARK_MEDICAL : THEMES.LIGHT_COMFORT)}
            />
            
            <Toggle
                id="reduce-animations"
                label="Reduce Animations"
                description="Minimize motion effects for better focus"
                checked={data.reduceAnimations}
                onChange={(checked) => {
                    if (checked) {
                        document.documentElement.classList.add('reduce-motion');
                    } else {
                        document.documentElement.classList.remove('reduce-motion');
                    }
                }}
            />
        </CardContent>
    </Card>
);

// Privacy Section Component
const PrivacySection = ({ data, setData, onDownloadData, onDeleteAccount }) => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Data Sharing Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Toggle
                    id="share-pharmacy"
                    label="Share Data with Pharmacy"
                    description="Allow your pharmacy to access relevant medical information"
                    checked={data.shareDataWithPharmacy}
                    onChange={(checked) => setData({ ...data, shareDataWithPharmacy: checked })}
                />
                
                <Toggle
                    id="share-research"
                    label="Share Anonymized Data for Research"
                    description="Help improve healthcare by sharing anonymized medical data"
                    checked={data.shareDataForResearch}
                    onChange={(checked) => setData({ ...data, shareDataForResearch: checked })}
                />
                
                <Toggle
                    id="allow-marketing"
                    label="Allow Marketing Communications"
                    description="Receive promotional emails and special offers"
                    checked={data.allowMarketing}
                    onChange={(checked) => setData({ ...data, allowMarketing: checked })}
                />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Your Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Download a copy of your data or permanently delete your account and all associated data.
                </p>
                
                <Button variant="outline" onClick={onDownloadData} className="w-full sm:w-auto">
                    <Download size={18} />
                    Download My Data
                </Button>
            </CardContent>
        </Card>
        
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Danger Zone
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                
                <Button variant="destructive" onClick={onDeleteAccount}>
                    <Trash2 size={18} />
                    Delete Account
                </Button>
            </CardContent>
        </Card>
    </div>
);

export default Settings;
