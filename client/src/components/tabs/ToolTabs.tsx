import React, { useState } from 'react';

interface TabItem {
  name: string;
  icon?: any;  // Use React.ElementType for the icon type
}

interface Props {
  tabs: TabItem[];
  panels: JSX.Element[];
  align?: string;
}

export default function ToolTabs(props: Props) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <ul className="nav nav-tabs" role="tablist" style={{ justifyContent: props.align || 'flex-start', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {props.tabs.map((tab, index) => (
          <li className="nav-item" key={index}>
            <a 
              className={`nav-link ${index === activeTab ? 'active' : ''}`} 
              id={`tab-${index}`} 
              data-toggle="tab" 
              role="tab" 
              href={`#panel-${index}`} 
              aria-controls={`panel-${index}`} 
              aria-selected={index === activeTab} 
              onClick={() => setActiveTab(index)}
            >
              {tab.icon && React.createElement(tab.icon, { style: { marginRight: '5px' } })}
              {tab.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {props.panels.map((panel, index) => (
          <div 
            className={`tab-pane fade ${index === activeTab ? 'show active' : ''}`} 
            id={`panel-${index}`} 
            role="tabpanel" 
            aria-labelledby={`tab-${index}`} 
            key={index}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
