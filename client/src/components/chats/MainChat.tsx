import ChatInput from './ChatInput';
import { useChatContext } from '../../contexts/ChatContext';
import ChatActions from './ChatActions';

export default function MainChat() {
	const { chatboxRefIsEmpty, chatboxRef, type } = useChatContext();

	return (
		<div className='chat-container' style={{ position: 'relative', overflow: 'hidden' }}>
			<div id="chatbox" ref={chatboxRef} className="message-area">
				{!chatboxRefIsEmpty ? null : <ChatActions />}
			</div>
			<ChatInput type={type} />
		</div>
	)
}