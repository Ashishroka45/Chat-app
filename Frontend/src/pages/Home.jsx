import { useChatStore } from '../store/useChatStore'
import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import Chat from '../components/Chat';

const Home = () => {
  const {selectedUser} = useChatStore();
  return (
    <div className='bg-base-200 h-screen mt-8' >
        <div className="flex justify-center items-center pt-10 px-4 ">
          <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              <Sidebar />
              {!selectedUser ? <NoChatSelected/>:<Chat/> }
            </div>
          </div>
        </div>
    </div>
  )
}

export default Home
