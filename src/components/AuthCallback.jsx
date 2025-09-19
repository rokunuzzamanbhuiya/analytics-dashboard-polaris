import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Card, Text, Button, Banner, Box, BlockStack } from '@shopify/polaris';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      // Get the authorization code from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const shop = urlParams.get('shop');
      const error = urlParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`OAuth error: ${error}`);
        return;
      }

      if (!code || !shop) {
        setStatus('error');
        setMessage('Missing authorization code or shop parameter');
        return;
      }

      setStatus('processing');
      setMessage('Processing authentication...');

      // Exchange authorization code for access token
      const tokenResponse = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          shop,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange authorization code');
      }

      const tokenData = await tokenResponse.json();
      const { access_token, user: userData } = tokenData;

      setMessage('Checking user access...');

      // Check if user has access (you can customize this logic)
      const userHasAccess = checkUserAccess(userData);

      // Store user data and access token
      localStorage.setItem('shopify_user', JSON.stringify({
        ...userData,
        access_token,
        shop,
        hasAccess: userHasAccess,
      }));

      setUser(userData);
      setHasAccess(userHasAccess);
      setStatus('success');
      setMessage(userHasAccess 
        ? 'Login successful! You have access to the dashboard.' 
        : 'Access denied. You do not have permission to access this dashboard.');

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage(`Authentication failed: ${error.message}`);
    }
  };

  const checkUserAccess = (user) => {
    // Customize this logic based on your access requirements
    // For example, check user role, email domain, etc.
    
    // Example: Allow admin users
    if (user.role === 'admin') {
      return true;
    }

    // Example: Allow specific email domains
    const allowedDomains = ['yourcompany.com', 'admin.com'];
    const userDomain = user.email.split('@')[1];
    if (allowedDomains.includes(userDomain)) {
      return true;
    }

    // Example: Allow specific users by email
    const allowedEmails = ['admin@yourcompany.com', 'manager@yourcompany.com'];
    if (allowedEmails.includes(user.email)) {
      return true;
    }

    // Default: deny access
    return false;
  };

  const handleRetry = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('shopify_user');
    navigate('/');
  };

  if (status === 'processing') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <Spinner size="large" />
        <Text variant="headingMd" as="h2">Processing Authentication...</Text>
        <Text variant="bodyMd" color="subdued">{message}</Text>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <Card sectioned>
        {status === 'success' && (
          <Box padding="400">
            <BlockStack gap="400">
              {user && (
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: hasAccess ? '#00a047' : '#d72c0d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 auto 1rem'
                    }}
                  >
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                  <Text variant="headingLg" as="h2">
                    {user.first_name} {user.last_name}
                  </Text>
                  <Text variant="bodyMd" color="subdued">
                    {user.email}
                  </Text>
                </div>
              )}
              
              <Banner
                status={hasAccess ? 'success' : 'critical'}
                title={hasAccess ? 'Login Successful!' : 'Access Denied'}
              >
                <p>{message}</p>
              </Banner>

              <div style={{ textAlign: 'center' }}>
                {hasAccess ? (
                  <Text variant="bodyMd" color="subdued">
                    Redirecting to dashboard...
                  </Text>
                ) : (
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Button onClick={handleRetry}>Try Again</Button>
                    <Button onClick={handleLogout} variant="secondary">Logout</Button>
                  </div>
                )}
              </div>
            </BlockStack>
          </Box>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <Banner status="critical" title="Authentication Failed">
              <p>{message}</p>
            </Banner>
            <div style={{ marginTop: '1rem' }}>
              <Button onClick={handleRetry}>Try Again</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuthCallback;