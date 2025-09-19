import React from 'react';
import {
  IndexTable,
  Text,
  Spinner,
} from '@shopify/polaris';

/**
 * Reusable dashboard table component that works with existing CSS system
 */
const DashboardTable = ({
  title,
  items = [],
  columns = [],
  rowRenderer,
  loading = false,
  emptyMessage = "No data available",
  darkMode = false
}) => {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="dashboard-table-card">
      <div className="table-header">
        <h2 className="table-title">{title}</h2>
      </div>
      
      {loading ? (
        <div className="table-loading">
          <Spinner accessibilityLabel="Loading data" size="large" />
        </div>
      ) : safeItems.length === 0 ? (
        <div className="table-empty">
          <Text as="p" tone="subdued">
            {emptyMessage}
          </Text>
        </div>
      ) : (
        <div className="table-content">
          <IndexTable
            resourceName={{ singular: "item", plural: "items" }}
            itemCount={safeItems.length}
            selectable={false}
            headings={columns}
          >
            {safeItems.map((item, index) => rowRenderer(item, index))}
          </IndexTable>
        </div>
      )}
    </div>
  );
};

export default DashboardTable;
