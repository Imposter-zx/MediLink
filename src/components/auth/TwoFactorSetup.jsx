import React, { useState } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';

/**
 * Two-Factor Authentication Setup Component
 * Guides users through TOTP setup with Google Authenticator, Authy, etc.
 */
function TwoFactorSetup() {
  const [step, setStep] = useState('intro');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Generate TOTP secret and QR code
   */
  const handleGenerateSecret = async () => {
    setLoading(true);
    try {
      // Call backend to generate secret
      const response = await fetch('/api/auth/2fa/generate', {
        method: 'POST',
      });

      const data = await response.json();
      setSecret(data.secret);
      setQrCode(data.qrCode);
      setStep('scan');
    } catch (error) {
      console.error('Failed to generate secret:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify TOTP token
   */
  const handleVerifyToken = async () => {
    if (!totpToken || totpToken.length !== 6) {
      alert('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, token: totpToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setBackupCodes(data.backupCodes);
        setStep('backup');
      } else {
        alert('Invalid code. Please try again.');
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Complete 2FA setup
   */
  const handleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, backupCodes }),
      });

      if (response.ok) {
        setStep('complete');
      }
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copy backup codes to clipboard
   */
  const handleCopyBackupCodes = () => {
    const text = backupCodes.join('\n');
    navigator.clipboard.writeText(text);
    alert('Backup codes copied to clipboard');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Two-Factor Authentication Setup</h2>

      {/* Step 1: Introduction */}
      {step === 'intro' && (
        <div className="space-y-4">
          <p className="text-gray-600">Protect your MediLink account with two-factor authentication (2FA).</p>

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold mb-2">What you'll need:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>An authenticator app (Google Authenticator, Authy, Microsoft Authenticator)</li>
              <li>A way to store backup codes safely</li>
              <li>5 minutes to complete setup</li>
            </ul>
          </div>

          <button
            onClick={handleGenerateSecret}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Get Started'}
          </button>
        </div>
      )}

      {/* Step 2: Scan QR Code */}
      {step === 'scan' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold mb-4">Step 1: Scan QR Code</h3>
            {qrCode && (
              <div className="flex justify-center mb-4">
                <QRCode value={qrCode} size={256} />
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded p-4 text-sm">
            <p className="font-semibold mb-2">Can't scan the code?</p>
            <p>Enter this key manually in your authenticator app:</p>
            <code className="block bg-white p-2 rounded mt-2 text-center font-mono text-lg break-all">{secret}</code>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Step 2: Enter verification code</p>
            <input
              type="text"
              value={totpToken}
              onChange={e => setTotpToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full p-2 border rounded text-center text-2xl tracking-widest"
            />
            <p className="text-xs text-gray-500 mt-1">6-digit code from your authenticator app</p>
          </div>

          <button
            onClick={handleVerifyToken}
            disabled={loading || totpToken.length !== 6}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </div>
      )}

      {/* Step 3: Backup Codes */}
      {step === 'backup' && (
        <div className="space-y-4">
          <h3 className="font-semibold">Save Your Backup Codes</h3>

          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-sm text-red-800 font-semibold mb-2">⚠️ Important</p>
            <p className="text-sm text-red-700">
              These codes are your last resort for account recovery if you lose access to your authenticator app. Save them in a secure location.
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, i) => (
                <div key={i} className="bg-white p-2 rounded text-sm font-mono text-center">
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyBackupCodes}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              Copy Codes
            </button>
            <button
              onClick={() => {
                const element = document.createElement('a');
                element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(backupCodes.join('\n'))}`);
                element.setAttribute('download', 'medilink_backup_codes.txt');
                element.click();
              }}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              Download Codes
            </button>
          </div>

          <button
            onClick={handleComplete}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Enabling...' : '✓ Complete Setup'}
          </button>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 'complete' && (
        <div className="space-y-4 text-center">
          <div className="text-6xl">✅</div>
          <h3 className="text-2xl font-bold text-green-600">Two-Factor Authentication Enabled!</h3>
          <p className="text-gray-600">Your account is now protected with 2FA.</p>

          <div className="bg-green-50 border border-green-200 rounded p-4 text-left">
            <p className="font-semibold mb-2">What's next:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>You'll be asked for a 2FA code on your next login</li>
              <li>Keep your backup codes in a safe place</li>
              <li>Never share your authenticator code with anyone</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setStep('intro');
              setSecret('');
              setQrCode('');
              setTotpToken('');
              setBackupCodes([]);
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

export default TwoFactorSetup;
