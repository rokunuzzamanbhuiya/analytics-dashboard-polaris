import React from 'react';
import { Icon } from '@shopify/polaris';

/**
 * Reusable metric card component
 */
const MetricCard = ({ title, value, icon, loading = false }) => {
  return (
    <div className="metric-card">
      <div className="metric-card-inner">
        <h3>{title}</h3>
        <Icon source={icon} />
      </div>
      <h1>
        {loading ? (
          <span className="loading-placeholder">---</span>
        ) : (
          value
        )}
      </h1>
    </div>
  );
};

export default MetricCard;
