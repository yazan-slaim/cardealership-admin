'use client';

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Globe, ExternalLink, Settings, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';

const PageContainer = styled.div`
  padding: 32px;
  max-width: 800px;
  margin: 0 auto;
`;

const WebsiteURL = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
  margin-top: 16px;
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

export default function WebsiteSettingsPage() {
  const { data: session } = useSession();
  const [subdomain, setSubdomain] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');

  // Fetch current dealership settings
  useEffect(() => {
    if (session?.user?.dealershipId) {
      fetchDealership();
    }
  }, [session]);

  const fetchDealership = async () => {
    try {
      // In a real app, you'd fetch the dealership by ID
      // For this demo, we'll simulate an already generated site if they have a subdomain
      const res = await fetch(`/api/dealerships/${session.user.dealershipId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.subdomain) {
          setSubdomain(data.subdomain);
          setIsGenerated(true);
          setLiveUrl(`http://${data.subdomain}.localhost:3001`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    if (!subdomain) {
      toast.error('Please enter a subdomain name');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/dealerships/${session.user.dealershipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subdomain }),
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }
      
      setIsGenerated(true);
      setLiveUrl(`http://${subdomain}.localhost:3001`);
      toast.success('Website Generated Successfully!');
    } catch (error) {
      toast.error('Failed to generate website');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Website Engine</h1>
        <p className="text-slate-500">Generate and manage your dealership's live storefront in 1-click.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Domain Settings
          </CardTitle>
          <CardDescription>
            Choose the web address where your customers will find you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isGenerated ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Your Subdomain</label>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="e.g. elitemotors" 
                    value={subdomain} 
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  />
                  <span className="text-slate-500 bg-slate-100 px-3 py-2 rounded-md border">
                    .yourplatform.com
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={handleGenerate} 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Generating Layouts & Infrastructure...' : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Website (1-Click)
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div>
              <div className="bg-green-50 text-green-700 p-4 rounded-md border border-green-200 mb-4 flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">Your website is LIVE and automatically syncing inventory.</span>
              </div>
              
              <WebsiteURL href={liveUrl} target="_blank">
                <Globe className="w-5 h-5" />
                {liveUrl}
                <ExternalLink className="w-4 h-4 ml-auto" />
              </WebsiteURL>

              <div className="mt-6 pt-6 border-t border-slate-100 flex gap-4">
                <Button variant="outline" onClick={() => toast.info('Theme editor coming soon!')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Customize Theme
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
