import { useState, useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { Menu, PenTool, Video, X } from 'lucide-react';
import { socket } from '../lib/socket';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const canvasRef = useRef<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const startLiveSession = () => {
    setIsLive(true);
    socket.emit('start-session', { teacherId: user?.id });
  };

  const endLiveSession = () => {
    setIsLive(false);
    socket.emit('end-session', { teacherId: user?.id });
  };

  const handleDraw = async (path: any) => {
    if (isLive) {
      socket.emit('draw', { path, teacherId: user?.id });
    }
  };

  return (
    <Layout>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`bg-white w-64 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out fixed left-0 h-full z-30`}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Teacher Dashboard</h2>
            <nav className="space-y-2">
              <button className="flex items-center space-x-2 w-full p-3 rounded hover:bg-gray-100">
                <PenTool className="w-5 h-5" />
                <span>Live Whiteboard</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={isLive ? endLiveSession : startLiveSession}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isLive 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isLive ? (
                  <div className="flex items-center space-x-2">
                    <X className="w-5 h-5" />
                    <span>End Live Session</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>Start Live Session</span>
                  </div>
                )}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4">
              <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={4}
                strokeColor="black"
                width="100%"
                height="600px"
                className="rounded-lg border-2 border-gray-200"
                onStroke={handleDraw}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}