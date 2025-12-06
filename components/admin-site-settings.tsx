"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Save, Mail, Phone, MapPin, ExternalLink, Loader2 } from "lucide-react"

interface SiteSetting {
  id: string
  key: string
  value: string
  description: string
}

interface AdminSiteSettingsProps {
  initialSettings: SiteSetting[]
}

export function AdminSiteSettings({ initialSettings }: AdminSiteSettingsProps) {
  const [settings, setSettings] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    initialSettings.forEach((s) => {
      initial[s.key] = s.value
    })
    return initial
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const supabase = createClient()

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value, updated_at: new Date().toISOString() })
          .eq("key", key)

        if (error) throw error
      }

      setMessage({ type: "success", text: "Settings saved successfully!" })
    } catch (error) {
      console.error("Error saving settings:", error)
      setMessage({ type: "error", text: "Failed to save settings. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span style={{ color: "#1A0D66" }}>Site Settings</span>
        </CardTitle>
        <CardDescription>Manage contact information and links displayed across the website</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Email */}
        <div className="space-y-2">
          <Label htmlFor="contact_email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" style={{ color: "#E6A940" }} />
            Contact Email
          </Label>
          <Input
            id="contact_email"
            type="email"
            value={settings.contact_email || ""}
            onChange={(e) => handleChange("contact_email", e.target.value)}
            placeholder="info@elevatefinconsult.com"
          />
          <p className="text-xs text-muted-foreground">Email displayed in the footer contact section</p>
        </div>

        {/* Contact Phone */}
        <div className="space-y-2">
          <Label htmlFor="contact_phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" style={{ color: "#E6A940" }} />
            Contact Phone
          </Label>
          <Input
            id="contact_phone"
            type="tel"
            value={settings.contact_phone || ""}
            onChange={(e) => handleChange("contact_phone", e.target.value)}
            placeholder="+250 XXX XXX XXX"
          />
          <p className="text-xs text-muted-foreground">Phone number displayed in the footer contact section</p>
        </div>

        {/* Contact Location */}
        <div className="space-y-2">
          <Label htmlFor="contact_location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: "#E6A940" }} />
            Office Location
          </Label>
          <Input
            id="contact_location"
            type="text"
            value={settings.contact_location || ""}
            onChange={(e) => handleChange("contact_location", e.target.value)}
            placeholder="Kigali, Rwanda"
          />
          <p className="text-xs text-muted-foreground">Location displayed in the footer contact section</p>
        </div>

        {/* Consulting Website URL */}
        <div className="space-y-2">
          <Label htmlFor="consulting_website_url" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" style={{ color: "#E6A940" }} />
            Consulting Website URL
          </Label>
          <Input
            id="consulting_website_url"
            type="url"
            value={settings.consulting_website_url || ""}
            onChange={(e) => handleChange("consulting_website_url", e.target.value)}
            placeholder="https://www.elevatefinconsult.com"
          />
          <p className="text-xs text-muted-foreground">
            Link for the "Visit Our Consulting Website" button and footer link
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
          <Button onClick={handleSave} disabled={saving} className="ml-auto" style={{ backgroundColor: "#C89333" }}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
