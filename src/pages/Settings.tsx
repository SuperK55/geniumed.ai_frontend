import React, { useState, useEffect } from 'react';
import { MessageCircle, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { notify } from '@/utils/notifications';

interface WhatsAppStatus {
  connected: boolean;
  verified: boolean;
  phoneNumber: string | null;
  connectedAt: string | null;
}

const Settings = () => {
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  
  // Form state for WhatsApp connection
  const [whatsappForm, setWhatsappForm] = useState({
    phone_id: '',
    access_token: '',
    business_account_id: '',
    phone_number: '',
    display_phone_number: '',
    verified: false
  });

  // Fetch WhatsApp status
  const fetchWhatsAppStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/whatsapp/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWhatsappStatus(data.whatsapp);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhatsAppStatus();
  }, []);

  // Connect WhatsApp Business
  const handleConnectWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setConnecting(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(whatsappForm)
      });

      const data = await response.json();

      if (response.ok) {
        notify.success('WhatsApp Connected!', {
          description: 'Your WhatsApp Business account has been connected successfully.',
          duration: 5000
        });
        
        // Reset form
        setWhatsappForm({
          phone_id: '',
          access_token: '',
          business_account_id: '',
          phone_number: '',
          display_phone_number: '',
          verified: false
        });
        
        // Refresh status
        await fetchWhatsAppStatus();
      } else {
        notify.error('Connection Failed', {
          description: data.error || 'Failed to connect WhatsApp Business account',
          duration: 5000
        });
      }
    } catch (error) {
      notify.error('Connection Error', {
        description: 'Network error occurred',
        duration: 5000
      });
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect WhatsApp Business
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your WhatsApp Business account?')) {
      return;
    }

    try {
      setDisconnecting(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('/api/whatsapp/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        notify.success('WhatsApp Disconnected', {
          description: 'Your WhatsApp Business account has been disconnected.',
          duration: 5000
        });
        
        // Refresh status
        await fetchWhatsAppStatus();
      } else {
        notify.error('Disconnection Failed', {
          description: data.error || 'Failed to disconnect WhatsApp Business account',
          duration: 5000
        });
      }
    } catch (error) {
      notify.error('Disconnection Error', {
        description: 'Network error occurred',
        duration: 5000
      });
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and integrations</p>
      </div>

      {/* WhatsApp Business Integration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">WhatsApp Business</h2>
                <p className="text-sm text-gray-500">Connect your WhatsApp Business account</p>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : whatsappStatus?.connected ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
                {whatsappStatus.verified && (
                  <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Not Connected</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {whatsappStatus?.connected ? (
            /* Connected State */
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-900">Phone Number</span>
                    <span className="text-sm text-green-700">{whatsappStatus.phoneNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-900">Connected At</span>
                    <span className="text-sm text-green-700">
                      {whatsappStatus.connectedAt 
                        ? new Date(whatsappStatus.connectedAt).toLocaleString()
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-900">Status</span>
                    <span className="text-sm text-green-700">
                      {whatsappStatus.verified ? 'Verified by Meta' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-gray-600">
                  Your WhatsApp Business account is connected. All automated messages will be sent from your number.
                </p>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {disconnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 inline-block mr-2 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    'Disconnect'
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Not Connected State - Connection Form */
            <form onSubmit={handleConnectWhatsApp} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">How to Connect</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Create a Meta Business Account at <a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">business.facebook.com</a></li>
                  <li>Set up WhatsApp Business API</li>
                  <li>Get your credentials from Meta Business Manager</li>
                  <li>Enter the credentials below</li>
                </ol>
                <a 
                  href="https://developers.facebook.com/docs/whatsapp/business-management-api/get-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-3 text-sm text-blue-700 hover:text-blue-800 font-medium"
                >
                  View Setup Guide
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsappForm.phone_id}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, phone_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Account ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsappForm.business_account_id}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, business_account_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="987654321"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Token *
                  </label>
                  <input
                    type="password"
                    required
                    value={whatsappForm.access_token}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, access_token: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="EAAxxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsappForm.phone_number}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={whatsappForm.display_phone_number}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, display_phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (234) 567-8900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={whatsappForm.verified}
                      onChange={(e) => setWhatsappForm({ ...whatsappForm, verified: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Number is verified by Meta</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={connecting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Connect WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;














