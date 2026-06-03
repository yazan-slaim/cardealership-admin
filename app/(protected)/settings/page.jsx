'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Paintbrush, Phone } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [dealership, setDealership] = useState({
    name: '',
    themeColors: {
      primary: '#ef4444',
      secondary: '#f97316'
    },
    contactInfo: {
      phone: '',
      email: '',
      address: '',
      whatsapp: ''
    }
  });

  useEffect(() => {
    if (session?.user?.dealershipId) {
      fetchDealership();
    }
  }, [session]);

  const fetchDealership = async () => {
    try {
      const res = await fetch(`/api/dealerships/${session.user.dealershipId}`);
      if (res.ok) {
        const data = await res.json();
        setDealership({
          name: data.name || '',
          themeColors: {
            primary: data.themeColors?.primary || '#ef4444',
            secondary: data.themeColors?.secondary || '#f97316'
          },
          contactInfo: {
            phone: data.contactInfo?.phone || '',
            email: data.contactInfo?.email || '',
            address: data.contactInfo?.address || '',
            whatsapp: data.contactInfo?.whatsapp || ''
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dealerships/${session.user.dealershipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dealership)
      });
      if (res.ok) {
        toast.success('Settings updated successfully!');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dealership Settings</h1>
        <p className="text-slate-500">Configure your dealership information, branding, and theme colors.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            General Information
          </CardTitle>
          <CardDescription>
            Basic details about your dealership.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Dealership Name</label>
            <Input
              value={dealership.name}
              onChange={(e) => setDealership({ ...dealership, name: e.target.value })}
              placeholder="Elite Motors"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush className="w-5 h-5 text-purple-600" />
            Branding & Themes
          </CardTitle>
          <CardDescription>
            Colors used on your public website storefront.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Primary Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                className="w-12 h-10 p-0 cursor-pointer border-none"
                value={dealership.themeColors.primary}
                onChange={(e) => setDealership({
                  ...dealership,
                  themeColors: { ...dealership.themeColors, primary: e.target.value }
                })}
              />
              <Input
                value={dealership.themeColors.primary}
                onChange={(e) => setDealership({
                  ...dealership,
                  themeColors: { ...dealership.themeColors, primary: e.target.value }
                })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Secondary Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                className="w-12 h-10 p-0 cursor-pointer border-none"
                value={dealership.themeColors.secondary}
                onChange={(e) => setDealership({
                  ...dealership,
                  themeColors: { ...dealership.themeColors, secondary: e.target.value }
                })}
              />
              <Input
                value={dealership.themeColors.secondary}
                onChange={(e) => setDealership({
                  ...dealership,
                  themeColors: { ...dealership.themeColors, secondary: e.target.value }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />
            Contact Info
          </CardTitle>
          <CardDescription>
            Contact details displayed on your website.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Phone Number</label>
            <Input
              value={dealership.contactInfo.phone}
              onChange={(e) => setDealership({
                ...dealership,
                contactInfo: { ...dealership.contactInfo, phone: e.target.value }
              })}
              placeholder="+962 7 9000 0000"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">WhatsApp Number</label>
            <Input
              value={dealership.contactInfo.whatsapp}
              onChange={(e) => setDealership({
                ...dealership,
                contactInfo: { ...dealership.contactInfo, whatsapp: e.target.value }
              })}
              placeholder="+962 7 9000 0000"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email Address</label>
            <Input
              value={dealership.contactInfo.email}
              onChange={(e) => setDealership({
                ...dealership,
                contactInfo: { ...dealership.contactInfo, email: e.target.value }
              })}
              placeholder="contact@elitemotors.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Physical Address</label>
            <Input
              value={dealership.contactInfo.address}
              onChange={(e) => setDealership({
                ...dealership,
                contactInfo: { ...dealership.contactInfo, address: e.target.value }
              })}
              placeholder="Amman, Jordan"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
