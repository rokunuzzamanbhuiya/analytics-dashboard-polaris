import React, { useState } from 'react';
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  Banner,
  Text,
  BlockStack,
  InlineStack,
  Box,
  Layout,
  Divider
} from '@shopify/polaris';
import config from '../config/shopify';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Making API call to:', `${config.api.baseUrl}/auth/email-login`);
      console.log('Email being sent:', email);
      
      const response = await fetch(`${config.api.baseUrl}/auth/email-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      
      if (!response.ok || !result.hasAccess) {
        setError(result.message || 'No access to any store.');
        setLoading(false);
        return;
      }
      
      // Store user data in localStorage
      localStorage.setItem('shopify_user', JSON.stringify(result.user));
      onLoginSuccess(result.user);
    } catch (e) {
      console.error('Login error:', e);
      setError('Network error or server not responding.');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '450px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '40px 30px',
          textAlign: 'center',
          color: 'black'
        }}>
          <Text variant="headingLg" as="h1">
            Shopify Analytics
          </Text>
          <Text variant="bodyLg" style={{ opacity: 0.9, marginTop: '8px' }}>
            Sign in to your dashboard
          </Text>
        </div>

        <div style={{ margin: '24px' }}><Divider /></div>
        
        
        <Box padding="600">
          <BlockStack gap="400">
            {error && (
              <Banner status="critical">
                <p>{error}</p>
              </Banner>
            )}

            <form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                  autoComplete="email"
                  autoFocus
                />
                
                <div style={{ marginTop: '24px' }}>
                  <Button
                    submit
                    variant="primary"
                    size="large"
                    loading={loading}
                    disabled={loading || !email}
                    fullWidth
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </FormLayout>
            </form>

            <Divider />
            
            <Text variant="bodySm" color="subdued" alignment="center">
              Make sure you have access to the Shopify store to use this dashboard.
            </Text>
          </BlockStack>
        </Box>
      </div>
    </div>
  );
};

export default LoginPage;
