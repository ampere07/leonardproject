import { useState, useRef, useEffect } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { Menu, Video, Save, Clock, X } from 'lucide-react';
import { socket } from '../lib/socket';
import { format } from 'date-fns';

type Session = {
  id: string;
  teacherId: string;
  date: string;
  duration: number;
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'saved'>('live');
  const [savedSessions, setSavedSessions] = useState<Session[]>([]);
  const canvasRef = useRef<any>(null);
  const recordingRef = useRef<any>(null);

  useEffect(() => {
    socket.on('draw-path', (data) => {
      if (canvasRef.current) {
        canvasRef.current.loadPaths([data.path]);
      }
    });

    return () => {
      socket.off('draw-path');
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    recordingRef.current = {
      startTime: new Date(),
      paths: [],
    };
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recordingRef.current) {
      const sessionData = {
        id: Date.now().toString(),
        teacherId: user?.id,
        date: new Date().toISOString(),
        duration: (new Date().getTime() - recordingRef.current.startTime.getTime()) / 1000,
        paths: recordingRef.current.paths,
      };

      setSavedSessions([...savedSessions, sessionData]);
    }
  };

  return (
    <Layout>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`bg-white w-64 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out fixed left-0 h-full z-30`}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Student Dashboard</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('live')}
                className={`flex items-center space-x-2 w-full p-3 rounded ${
                  activeTab === 'live' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Video className="w-5 h-5" />
                <span>Live Sessions</span>
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex items-center space-x-2 w-full p-3 rounded ${
                  activeTab === 'saved' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>Saved Sessions</span>
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
              {activeTab === 'live' && (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isRecording ? (
                    <div className="flex items-center space-x-2">
                      <X className="w-5 h-5" />
                      <span>Stop Recording</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Video className="w-5 h-5" />
                      <span>Start Recording</span>
                    </div>
                  )}
                </button>
              )}
            </div>

            {activeTab === 'live' ? (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="relative">
                  <ReactSketchCanvas
                    ref={canvasRef}
                    strokeWidth={4}
                    strokeColor="black"
                    width="100%"
                    height="600px"
                    className="rounded-lg border-2 border-gray-200"
                    style={{ cursor: 'not-allowed' }}
                    canvasColor="white"
                    readOnly={true}
                  />
                  <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md shadow">
                    View Only Mode
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedSessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Session Recording</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(session.date), 'PPP')}
                        </p>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{Math.round(session.duration)}s</span>
                      </div>
                    </div>
                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                      Watch Recording
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}