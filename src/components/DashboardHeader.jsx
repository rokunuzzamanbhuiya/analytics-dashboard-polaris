import React from 'react';
import {
  Text,
  InlineStack,
  Select,
  Button,
} from '@shopify/polaris';

/**
 * Dashboard header component with controls
 */
const DashboardHeader = ({
  lastUpdated,
  dateRange,
  onDateRangeChange,
  onRefresh,
  onToggleTheme,
  loading = false,
  isDarkTheme = false
}) => {
  return (
    <InlineStack align="space-between" blockAlign="center" gap="400">
      <div>
        <Text variant="headingXl" as="h1">
          Dashboard
        </Text>
        <Text variant="bodySm" tone="subdued">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Text>
      </div>
      
      <InlineStack gap="400">
        <Select
          label=""
          labelHidden
          options={[
            { label: "Today", value: "today" },
            { label: "Last 7 days", value: "7d" },
            { label: "All", value: "all" },
          ]}
          value={dateRange}
          onChange={onDateRangeChange}
        />
        
        <Button 
          onClick={onRefresh} 
          loading={loading}
          size="slim"
        >
          Refresh
        </Button>
        
        <Button 
          onClick={onToggleTheme}
          size="slim"
        >
          {isDarkTheme ? "Light Mode" : "Dark Mode"}
        </Button>
      </InlineStack>
    </InlineStack>
  );
};

export default DashboardHeader;
