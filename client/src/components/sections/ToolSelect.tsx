import { useChatContext } from '../../contexts/ChatContext';

interface Props {
  tools: any;
}

export default function ToolSelect(props: Props) {
  const { chatPayload, setChatPayload } = useChatContext();

  return (
    <div className="row">
      {props.tools.map((tool: any, index: any) => (
        <div className="col-6 col-md-3" key={index}> {/* Updated this line for responsiveness */}
          <div 
            className="card" 
            style={{ 
              backgroundColor: chatPayload.tools?.includes(tool.value) ? '#f8f8f8' : '', 
              cursor: 'pointer', 
              boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
            onClick={() => {
              const isSelected = chatPayload.tools?.includes(tool.value);
              setChatPayload((prevState: any) => ({
                ...prevState,
                tools: isSelected
                  ? prevState.tools.filter((item: any) => item !== tool.value)
                  : [...prevState.tools, tool.value]
              }));
            }}
          >
            <div className="card-header" style={{ padding: '0.5rem' }}>
              <h5 className="card-title" style={{ fontSize: 14 }}>{tool.label}</h5>
            </div>
            <div className="card-body" style={{ padding: '0.5rem' }}>
              <p className="card-text">{tool.description || ''}</p>
            </div>
            <div className="card-footer" style={{ padding: '0.5rem' }}>
              <input 
                type="checkbox" 
                className="form-check-input" 
                value={tool.value} 
                checked={chatPayload.tools?.includes(tool.value)}
                readOnly
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
