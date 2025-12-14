import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Mail, Shield, Briefcase, Plus, Trash2, UserPlus, Lock, Camera, History, Activity, FileText, Edit2, Save, X, Download, Upload } from 'lucide-react';
import { UserRole, User as UserType } from '../types';

export const Profile: React.FC = () => {
  const { currentUser, users, addUser, deleteUser, updateUser, isAdmin, updatePassword, updateAvatar, activityLogs, importLogs } = useAuth();
  const { t, dir } = useLanguage();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SECURITY' | 'ACTIVITY'>('OVERVIEW');
  
  // New User State
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ANALYST' as UserRole,
    department: ''
  });

  // Edit User State
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [editFormData, setEditFormData] = useState<{
      name: string;
      email: string;
      role: UserRole;
      department: string;
      password?: string;
      avatar?: string;
  } | null>(null);

  // Password Change State
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(formData);
    setNewUserOpen(false);
    setFormData({ name: '', email: '', password: '', role: 'ANALYST', department: '' });
  };

  const handleStartEdit = (user: UserType) => {
      setEditingUser(user);
      setEditFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department || '',
          password: '',
          avatar: user.avatar
      });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingUser || !editFormData) return;

      const updates: Partial<UserType> = {
          name: editFormData.name,
          email: editFormData.email,
          role: editFormData.role,
          department: editFormData.department,
          avatar: editFormData.avatar
      };
      
      // Only update password if provided
      if (editFormData.password && editFormData.password.trim() !== '') {
          updates.password = editFormData.password;
      }
      
      // If image changed, set custom flag
      if (editFormData.avatar !== editingUser.avatar) {
          updates.isCustomAvatar = true;
      }

      updateUser(editingUser.id, updates);
      setEditingUser(null);
      setEditFormData(null);
  };

  const handleEditAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && editFormData) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target?.result) {
                  setEditFormData({ ...editFormData, avatar: event.target.result as string });
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (passForm.new !== passForm.confirm) {
        setPassMsg({ type: 'error', text: t('password_fail') });
        return;
    }
    const success = updatePassword(passForm.current, passForm.new);
    if (success) {
        setPassMsg({ type: 'success', text: t('password_success') });
        setPassForm({ current: '', new: '', confirm: '' });
    } else {
        setPassMsg({ type: 'error', text: t('password_fail') });
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                updateAvatar(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activityLogs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `system_logs_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportLogs = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              try {
                  if (event.target?.result) {
                      const importedLogs = JSON.parse(event.target.result as string);
                      if (Array.isArray(importedLogs)) {
                          importLogs(importedLogs);
                          alert(t('logs_imported'));
                      }
                  }
              } catch (err) {
                  console.error("Invalid Log File");
              }
          };
          reader.readAsText(file);
      }
      // Reset input
      e.target.value = ''; 
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Profile Main Card */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {/* Header Tabs */}
        <div className="flex border-b border-slate-700">
            <button 
                onClick={() => setActiveTab('OVERVIEW')}
                className={`flex-1 p-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'OVERVIEW' ? 'bg-slate-700 text-white border-b-2 border-blue-500' : 'text-slate-400 hover:bg-slate-700/50'}`}
            >
                <User size={16} />
                {t('tab_overview')}
            </button>
            <button 
                onClick={() => setActiveTab('SECURITY')}
                className={`flex-1 p-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'SECURITY' ? 'bg-slate-700 text-white border-b-2 border-blue-500' : 'text-slate-400 hover:bg-slate-700/50'}`}
            >
                <Lock size={16} />
                {t('tab_security')}
            </button>
            <button 
                onClick={() => setActiveTab('ACTIVITY')}
                className={`flex-1 p-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'ACTIVITY' ? 'bg-slate-700 text-white border-b-2 border-blue-500' : 'text-slate-400 hover:bg-slate-700/50'}`}
            >
                <History size={16} />
                {t('tab_activity')}
            </button>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[300px]">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'OVERVIEW' && (
                <div className="flex flex-col md:flex-row gap-8 items-start animate-fade-in">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-600 flex items-center justify-center overflow-hidden bg-slate-900 relative group">
                             {currentUser?.isCustomAvatar ? (
                                <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                                    {currentUser?.avatar}
                                </div>
                             )}
                             <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                             </label>
                        </div>
                        <label className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">
                            {t('upload_photo')}
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                        </label>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="space-y-1 p-3 bg-slate-900/50 rounded border border-slate-700/50">
                            <label className="text-xs text-slate-500 uppercase font-bold">{t('full_name')}</label>
                            <div className="text-white font-medium text-lg">{currentUser?.name}</div>
                        </div>
                        <div className="space-y-1 p-3 bg-slate-900/50 rounded border border-slate-700/50">
                            <label className="text-xs text-slate-500 uppercase font-bold">{t('email_label')}</label>
                            <div className="text-white font-medium flex items-center gap-2">
                                <Mail size={16} className="text-slate-500" />
                                {currentUser?.email}
                            </div>
                        </div>
                        <div className="space-y-1 p-3 bg-slate-900/50 rounded border border-slate-700/50">
                            <label className="text-xs text-slate-500 uppercase font-bold">{t('role')}</label>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${currentUser?.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {currentUser?.role}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1 p-3 bg-slate-900/50 rounded border border-slate-700/50">
                            <label className="text-xs text-slate-500 uppercase font-bold">{t('department')}</label>
                            <div className="text-white font-medium flex items-center gap-2">
                                <Briefcase size={16} className="text-slate-500" />
                                {currentUser?.department || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'SECURITY' && (
                <div className="max-w-md mx-auto animate-fade-in">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Lock size={18} className="text-orange-400" />
                        {t('change_password')}
                    </h3>
                    
                    {passMsg && (
                        <div className={`p-3 rounded mb-4 text-sm font-bold ${passMsg.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {passMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">{t('current_password')}</label>
                            <input 
                                type="password" 
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={passForm.current}
                                onChange={e => setPassForm({...passForm, current: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">{t('new_password')}</label>
                            <input 
                                type="password" 
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={passForm.new}
                                onChange={e => setPassForm({...passForm, new: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">{t('confirm_password')}</label>
                            <input 
                                type="password" 
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={passForm.confirm}
                                onChange={e => setPassForm({...passForm, confirm: e.target.value})}
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-colors"
                        >
                            {t('update_password')}
                        </button>
                    </form>
                </div>
            )}

            {/* ACTIVITY TAB */}
            {activeTab === 'ACTIVITY' && (
                <div className="animate-fade-in">
                    <h3 className="text-lg font-bold text-white mb-4">{t('activity_history')}</h3>
                    <div className="border border-slate-700 rounded-lg overflow-hidden">
                        <table className="w-full text-left" dir={dir}>
                            <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3">{t('action')}</th>
                                    <th className="px-6 py-3">{t('details')}</th>
                                    <th className="px-6 py-3 text-right">{t('timestamp')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 bg-slate-800/50">
                                {activityLogs.filter(log => log.userId === currentUser?.id).map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-700/30">
                                        <td className="px-6 py-3">
                                            <span className="px-2 py-1 bg-slate-700 rounded text-xs font-mono text-blue-300">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-slate-300 text-sm">{log.details}</td>
                                        <td className="px-6 py-3 text-right text-slate-500 text-xs font-mono">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {activityLogs.filter(log => log.userId === currentUser?.id).length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">
                                            No recent activity found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* ADMIN SECTIONS */}
      {isAdmin && (
        <>
            {/* User Management */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden relative">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Shield className="text-purple-500" />
                        {t('user_management')}
                    </h2>
                    <button 
                        onClick={() => setNewUserOpen(!newUserOpen)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                        <Plus size={16} />
                        {t('add_user')}
                    </button>
                </div>

                {/* EDIT USER MODAL OVERLAY */}
                {editingUser && editFormData && (
                    <div className="absolute inset-0 z-20 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                        <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 w-full max-w-lg shadow-2xl">
                             <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Edit2 size={18} className="text-blue-400"/>
                                    {t('edit_user')}
                                </h3>
                                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                                    <X size={20} />
                                </button>
                             </div>

                             <form onSubmit={handleSaveEdit} className="space-y-4">
                                <div className="flex justify-center mb-4">
                                    <div className="w-20 h-20 rounded-full border-2 border-slate-500 overflow-hidden relative group">
                                         {editFormData.avatar && editFormData.avatar.startsWith('data') ? (
                                            <img src={editFormData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                         ) : (
                                            <div className="w-full h-full bg-slate-700 flex items-center justify-center text-xl font-bold">{editFormData.avatar?.substring(0,2).toUpperCase()}</div>
                                         )}
                                          <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="text-white" size={16} />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleEditAvatarUpload} />
                                         </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-400">{t('full_name')}</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                            value={editFormData.name}
                                            onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400">{t('email_label')}</label>
                                        <input 
                                            type="email" 
                                            required
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                            value={editFormData.email}
                                            onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-400">{t('role')}</label>
                                        <select
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                            value={editFormData.role}
                                            onChange={e => setEditFormData({...editFormData, role: e.target.value as UserRole})}
                                        >
                                            <option value="ANALYST">Analyst</option>
                                            <option value="VIEWER">Viewer</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400">{t('department')}</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                            value={editFormData.department}
                                            onChange={e => setEditFormData({...editFormData, department: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400">{t('password_label')}</label>
                                    <input 
                                        type="password" 
                                        placeholder={t('leave_blank_pass')}
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                        value={editFormData.password}
                                        onChange={e => setEditFormData({...editFormData, password: e.target.value})}
                                    />
                                </div>
                                
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 text-sm font-bold">{t('cancel')}</button>
                                    <button type="submit" className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white text-sm font-bold flex items-center justify-center gap-2">
                                        <Save size={16} />
                                        {t('save_changes')}
                                    </button>
                                </div>
                             </form>
                        </div>
                    </div>
                )}

                {/* ADD USER FORM */}
                {newUserOpen && (
                    <div className="p-6 bg-slate-900/30 border-b border-slate-700 animate-fade-in">
                        <h3 className="text-white font-bold mb-4">{t('add_user')}</h3>
                        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder={t('full_name')}
                                required
                                className="bg-slate-900 border border-slate-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                            <input 
                                type="email" 
                                placeholder={t('email_label')}
                                required
                                className="bg-slate-900 border border-slate-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                            <input 
                                type="password" 
                                placeholder={t('password_label')}
                                required
                                className="bg-slate-900 border border-slate-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                            <select
                                className="bg-slate-900 border border-slate-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                            >
                                <option value="ANALYST">Analyst</option>
                                <option value="VIEWER">Viewer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                             <input 
                                type="text" 
                                placeholder={t('department')}
                                className="bg-slate-900 border border-slate-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.department}
                                onChange={e => setFormData({...formData, department: e.target.value})}
                            />
                            <button 
                                type="submit"
                                className="bg-green-600 hover:bg-green-500 text-white font-bold rounded p-3 flex items-center justify-center gap-2"
                            >
                                <UserPlus size={18} />
                                {t('create_user')}
                            </button>
                        </form>
                    </div>
                )}

                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left" dir={dir}>
                        <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">{t('full_name')}</th>
                                <th className="px-6 py-4">{t('email_label')}</th>
                                <th className="px-6 py-4">{t('role')}</th>
                                <th className="px-6 py-4 text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs overflow-hidden">
                                            {user.isCustomAvatar ? (
                                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                user.avatar
                                            )}
                                        </div>
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 font-mono text-sm">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-600/20 text-slate-400'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => handleStartEdit(user)}
                                            className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded-full transition-colors"
                                            title={t('edit')}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        {user.id !== currentUser?.id ? (
                                            <button 
                                                onClick={() => deleteUser(user.id)}
                                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-full transition-colors"
                                                title={t('delete')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        ) : (
                                            <div className="w-8"></div> // Spacer
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* System Logs (Admin Only) */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                 <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="text-slate-400" />
                        {t('tab_system_logs')}
                    </h2>
                    <div className="flex gap-2">
                         <label className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-xs font-bold cursor-pointer flex items-center gap-2 transition-colors">
                             <Upload size={14} />
                             {t('import_logs')}
                             <input type="file" accept=".json" className="hidden" onChange={handleImportLogs} />
                         </label>
                         <button 
                            onClick={handleExportLogs}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors"
                         >
                             <Download size={14} />
                             {t('export_logs')}
                         </button>
                    </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left" dir={dir}>
                         <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-medium sticky top-0">
                            <tr>
                                <th className="px-6 py-3">{t('user')}</th>
                                <th className="px-6 py-3">{t('action')}</th>
                                <th className="px-6 py-3">{t('details')}</th>
                                <th className="px-6 py-3 text-right">{t('timestamp')}</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-slate-700 bg-slate-800/50">
                             {activityLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-700/30">
                                    <td className="px-6 py-3 text-white font-medium text-xs">
                                        {log.userName}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-mono 
                                            ${log.action.includes('DELETE') ? 'bg-red-500/20 text-red-300' : 
                                              log.action.includes('ADD') || log.action.includes('IMPORT') ? 'bg-green-500/20 text-green-300' : 
                                              log.action.includes('UPDATE') ? 'bg-orange-500/20 text-orange-300' :
                                              'bg-slate-700 text-blue-300'}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-slate-300 text-xs">{log.details}</td>
                                    <td className="px-6 py-3 text-right text-slate-500 text-xs font-mono">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                             ))}
                             {activityLogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                                        System logs empty.
                                    </td>
                                </tr>
                             )}
                         </tbody>
                    </table>
                </div>
            </div>
        </>
      )}
    </div>
  );
};