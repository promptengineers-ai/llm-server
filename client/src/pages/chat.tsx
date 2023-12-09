import ChatInput from '../components/chats/ChatInput';
import ChatActions from '../components/chats/ChatActions';
import { useChatContext } from '../contexts/ChatContext';
import MainLayout from '../layouts/MainLayout';

export default function Chat() {
	const { chatboxRefIsEmpty, chatboxRef, type } = useChatContext();

	

	return (
		<MainLayout>
			<div className='chat-container' style={{ position: 'relative', overflow: 'hidden' }}>
				<div id="chatbox" ref={chatboxRef} className="message-area">
					{!chatboxRefIsEmpty ? null : <ChatActions />}
				</div>
				<ChatInput type={type} />
			</div>
		</MainLayout>
	)
}