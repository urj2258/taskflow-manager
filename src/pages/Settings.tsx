import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, saveSettings, clearAllTasks, logout } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Settings as SettingsIcon, Moon, Sun, Palette, Trash2, LogOut, Info } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(getSettings());
  const [isDark, setIsDark] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const handleThemeToggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const newSettings = { ...settings, theme: newIsDark ? 'dark' as const : 'light' as const };
    setSettings(newSettings);
    saveSettings(newSettings);
    toast.success(`${newIsDark ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleClearTasks = () => {
    clearAllTasks();
    setShowClearDialog(false);
    toast.success('All tasks cleared successfully');
  };

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const accentColors = [
    { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
    { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
    { name: 'Green', value: 'green', color: 'bg-green-500' },
    { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
    { name: 'Pink', value: 'pink', color: 'bg-pink-500' },
  ];

  const handleAccentChange = (color: string) => {
    const newSettings = { ...settings, accentColor: color };
    setSettings(newSettings);
    saveSettings(newSettings);
    toast.success(`Accent color changed to ${color}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your TaskFlow experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how TaskFlow looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <div>
                  <Label htmlFor="dark-mode" className="text-base font-medium cursor-pointer">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark theme
                  </p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={isDark}
                onCheckedChange={handleThemeToggle}
              />
            </div>

            {/* Accent Color Selection */}
            <div className="p-4 rounded-xl bg-accent/50">
              <Label className="text-base font-medium mb-3 block">
                Accent Color
              </Label>
              <div className="flex gap-3 flex-wrap">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleAccentChange(color.value)}
                    className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      settings.accentColor === color.value
                        ? 'border-primary bg-accent'
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full ${color.color} shadow-lg ${
                        settings.accentColor === color.value ? 'ring-4 ring-primary/20' : ''
                      }`}
                    />
                    <span className="text-xs font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-primary" />
              Data Management
            </CardTitle>
            <CardDescription>
              Manage your tasks and application data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-destructive/10 border-2 border-destructive/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-destructive mb-1">Clear All Tasks</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all your tasks. This action cannot be undone.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowClearDialog(true)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-primary" />
              Account
            </CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-accent/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Logout</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your TaskFlow account
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutDialog(true)}
                  className="flex-shrink-0"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              About TaskFlow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Version:</strong> 2.0.0
              </p>
              <p>
                <strong className="text-foreground">Description:</strong> A modern, beautiful task
                management application designed to boost your productivity.
              </p>
              <p>
                <strong className="text-foreground">Features:</strong> Task management, Categories,
                Calendar view, Reports, Notes, Reminders, and more.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clear Tasks Confirmation */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Tasks</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure? This will permanently delete all your tasks and this action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearTasks}
              className="bg-destructive hover:bg-destructive/90"
            >
              Clear All Tasks
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You'll need to login again to access your tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
