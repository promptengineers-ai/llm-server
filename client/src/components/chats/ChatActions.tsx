
const actions = [
  {
    title: 'Choose from templates',
    description: 'Interpolate variables with a query',
  },
  {
    title: 'Make a query suggestion',
    description: 'Will suggest a query based on your context',
  },
  {
    title: 'Create bot from current settings',
    description: 'Turns current chat settings into a bot',
  },
  {
    title: 'Create an automation',
    description: 'Chain Multiple Actions together in a Single Automation',
  },
];

export default function ChatActions() {

  return (
    <div className="d-flex flex-column h-100 justify-content-end">
      <div className="text-center">
        <div style={{ transform: 'scale(0.85)' }}>
          <div className="row mb-3">
            {actions.map((action, index) => (
              <div className="col-12 col-md-6" key={index}>
                <div 
                  className="card" 
                  onClick={() => alert('Coming Soon')}
                  style={{ cursor: 'pointer', boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                >
                  <div className="card-header">
                    <h5 className="card-title">{action.title}</h5>
                  </div>
                  <div className="card-body">
                    <p className="card-text text-muted">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
