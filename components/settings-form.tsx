"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Database, Save, Server, FileIcon as FileStorage } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SettingsForm() {
  const { toast } = useToast()

  // MongoDB settings
  const [mongoSettings, setMongoSettings] = useState({
    connectionString: process.env.MONGODB_URI || "",
    databaseName: "bilingo",
    isConnected: false,
  })

  // Firebase settings
  const [firebaseSettings, setFirebaseSettings] = useState({
    apiKey: process.env.FIREBASE_API_KEY || "",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
    isConnected: false,
  })

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "BILINGO Admin",
    enableNotifications: true,
    enableAudioPreview: true,
    defaultLanguage: "English",
  })

  const handleSaveMongoSettings = () => {
    // In a real app, you would save these settings to your environment or config
    toast({
      title: "MongoDB Settings Saved",
      description: "Your database connection settings have been updated.",
    })

    // Simulate connection
    setMongoSettings({
      ...mongoSettings,
      isConnected: true,
    })
  }

  const handleSaveFirebaseSettings = () => {
    // In a real app, you would save these settings to your environment or config
    toast({
      title: "Firebase Settings Saved",
      description: "Your storage settings have been updated.",
    })

    // Simulate connection
    setFirebaseSettings({
      ...firebaseSettings,
      isConnected: true,
    })
  }

  const handleSaveGeneralSettings = () => {
    toast({
      title: "General Settings Saved",
      description: "Your application settings have been updated.",
    })
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="database">MongoDB</TabsTrigger>
        <TabsTrigger value="storage">Firebase Storage</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your application preferences and settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={generalSettings.siteName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">Default Language</Label>
              <Input
                id="defaultLanguage"
                value={generalSettings.defaultLanguage}
                onChange={(e) => setGeneralSettings({ ...generalSettings, defaultLanguage: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between space-y-0 pt-2">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <Switch
                id="notifications"
                checked={generalSettings.enableNotifications}
                onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, enableNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between space-y-0 pt-2">
              <Label htmlFor="audioPreview">Enable Audio Preview</Label>
              <Switch
                id="audioPreview"
                checked={generalSettings.enableAudioPreview}
                onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, enableAudioPreview: checked })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveGeneralSettings} className="ml-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="database">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              MongoDB Connection
            </CardTitle>
            <CardDescription>
              Configure your MongoDB database connection for storing course and user data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Server className={`h-5 w-5 ${mongoSettings.isConnected ? "text-green-600" : "text-amber-600"}`} />
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${mongoSettings.isConnected ? "text-green-800" : "text-amber-800"}`}
                  >
                    {mongoSettings.isConnected ? "Connected to MongoDB" : "Not Connected"}
                  </h3>
                  <div className={`mt-2 text-sm ${mongoSettings.isConnected ? "text-green-700" : "text-amber-700"}`}>
                    <p>
                      {mongoSettings.isConnected
                        ? "Your application is successfully connected to MongoDB."
                        : "Configure your connection string below to connect to MongoDB."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="connectionString">Connection String</Label>
              <Input
                id="connectionString"
                value={mongoSettings.connectionString}
                onChange={(e) => setMongoSettings({ ...mongoSettings, connectionString: e.target.value })}
                placeholder="mongodb+srv://username:password@cluster.mongodb.net/database"
              />
              <p className="text-sm text-muted-foreground">
                Your MongoDB connection string including username and password.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="databaseName">Database Name</Label>
              <Input
                id="databaseName"
                value={mongoSettings.databaseName}
                onChange={(e) => setMongoSettings({ ...mongoSettings, databaseName: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveMongoSettings} className="ml-auto">
              <Save className="mr-2 h-4 w-4" />
              Save & Connect
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="storage">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileStorage className="mr-2 h-5 w-5" />
              Firebase Storage
            </CardTitle>
            <CardDescription>Configure Firebase Storage for storing audio files and media.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Server className={`h-5 w-5 ${firebaseSettings.isConnected ? "text-green-600" : "text-amber-600"}`} />
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${firebaseSettings.isConnected ? "text-green-800" : "text-amber-800"}`}
                  >
                    {firebaseSettings.isConnected ? "Connected to Firebase" : "Not Connected"}
                  </h3>
                  <div className={`mt-2 text-sm ${firebaseSettings.isConnected ? "text-green-700" : "text-amber-700"}`}>
                    <p>
                      {firebaseSettings.isConnected
                        ? "Your application is successfully connected to Firebase Storage."
                        : "Configure your Firebase settings below to connect to Firebase Storage."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={firebaseSettings.apiKey}
                onChange={(e) => setFirebaseSettings({ ...firebaseSettings, apiKey: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authDomain">Auth Domain</Label>
              <Input
                id="authDomain"
                value={firebaseSettings.authDomain}
                onChange={(e) => setFirebaseSettings({ ...firebaseSettings, authDomain: e.target.value })}
                placeholder="project-id.firebaseapp.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                value={firebaseSettings.projectId}
                onChange={(e) => setFirebaseSettings({ ...firebaseSettings, projectId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageBucket">Storage Bucket</Label>
              <Input
                id="storageBucket"
                value={firebaseSettings.storageBucket}
                onChange={(e) => setFirebaseSettings({ ...firebaseSettings, storageBucket: e.target.value })}
                placeholder="project-id.appspot.com"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveFirebaseSettings} className="ml-auto">
              <Save className="mr-2 h-4 w-4" />
              Save & Connect
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

