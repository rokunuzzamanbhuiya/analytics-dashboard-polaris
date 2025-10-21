import React, { useState } from 'react';
import {
  Modal,
  Button,
  Text,
  Card,
  Box,
  Banner,
  BlockStack
} from '@shopify/polaris';
import config from '../config/shopify';

const LoginForm = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${config.api.baseUrl}/auth/email-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok || !result.hasAccess) {
        setError(result.message || 'No access to any store.');
        setLoading(false);
        return;
      }
      onLogin(result.user || { email, hasAccess: true });
    } catch (e) {
      setError('Network error or server not responding.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setLoading(false);
    setEmail('');
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Login to Shopify Analytics"
      primaryAction={{
        content: loading ? 'Loading...' : 'Login',
        onAction: handleSubmit,
        loading,
        disabled: loading || !email
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleClose,
          disabled: loading
        }
      ]}
    >
      <Modal.Section>
        <Box padding="400">
          <BlockStack gap="400">
            {error && (
              <Banner status="critical">
                <p>{error}</p>
              </Banner>
            )}
            <Card sectioned>
              <BlockStack gap="200">
                <Text variant="headingMd" as="h3">
                  Login with Email
                </Text>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  style={{ padding: '8px', fontSize: '16px', width: '100%' }}
                  disabled={loading}
                />
              </BlockStack>
            </Card>
          </BlockStack>
        </Box>
      </Modal.Section>
    </Modal>
  );
};

export default LoginForm;
