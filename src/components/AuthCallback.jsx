import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spinner, Card, Text, Box } from '@shopify/polaris';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const shop = searchParams.get('shop');
        const state = searchParams.get('state');

        if (!code || !shop) {
          throw new Error('Missing OAuth parameters');
        }

        // Exchange code for access token
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            shop,
            state,
            redirect_uri: window.location.origin + '/auth/callback'
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const data = await response.json();
        
        // Store user data in localStorage
        localStorage.setItem('shopify_user', JSON.stringify(data.user));
        localStorage.setItem('shopify_access_token', data.access_token);
        
        setStatus('success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        
        // Redirect to home page after error
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Card>
        <Box padding="400">
          {status === 'processing' && (
            <div style={{ textAlign: 'center' }}>
              <Spinner accessibilityLabel="Processing authentication" size="large" />
              <Text as="p" variant="bodyMd" style={{ marginTop: '16px' }}>
                Processing Shopify authentication...
              </Text>
            </div>
          )}
          
          {status === 'success' && (
            <div style={{ textAlign: 'center' }}>
              <Text as="h2" variant="headingMd" tone="success">
                ✅ Authentication Successful!
              </Text>
              <Text as="p" variant="bodyMd" style={{ marginTop: '8px' }}>
                Redirecting to dashboard...
              </Text>
            </div>
          )}
          
          {status === 'error' && (
            <div style={{ textAlign: 'center' }}>
              <Text as="h2" variant="headingMd" tone="critical">
                ❌ Authentication Failed
              </Text>
              <Text as="p" variant="bodyMd" style={{ marginTop: '8px' }}>
                There was an error processing your authentication. Redirecting to home page...
              </Text>
            </div>
          )}
        </Box>
      </Card>
    </div>
  );
};

export default AuthCallback;
