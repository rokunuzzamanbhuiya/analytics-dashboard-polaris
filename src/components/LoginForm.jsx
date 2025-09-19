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

const LoginForm = ({ isOpen, onClose, onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShopifyLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Get OAuth URL from backend
      const response = await fetch('/api/auth/shopify-login');
      
      if (!response.ok) {
        throw new Error('Failed to initiate Shopify login');
      }

      const data = await response.json();
      
      // Redirect to Shopify OAuth
      window.location.href = data.authUrl;
      
    } catch (error) {
      console.error('Shopify login error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Login to Shopify Analytics"
      primaryAction={{
        content: 'Login with Shopify',
        onAction: handleShopifyLogin,
        loading: loading,
        disabled: loading
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
            {/* Error Banner */}
            {error && (
              <Banner status="critical">
                <p>{error}</p>
              </Banner>
            )}

            {/* Shopify Login Info */}
            <Card sectioned>
              <BlockStack gap="200">
                <Text variant="headingMd" as="h3">
                  Login with Shopify
                </Text>
                <Text variant="bodyMd" color="subdued">
                  You'll be redirected to Shopify to authenticate with your store account.
                  After login, you'll be redirected back to the dashboard.
                </Text>
                <Text variant="bodySm" color="subdued">
                  Make sure you have admin access to the Shopify store.
                </Text>
              </BlockStack>
            </Card>
          </BlockStack>
        </Box>
      </Modal.Section>
    </Modal>
  );
};

export default LoginForm;
