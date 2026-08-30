import { ArrowLeftIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Emptysessions from '../components/sessions/Emptysessions'
import SessionCard from '../components/sessions/SessionCard'
import SessionDetailModal from '../components/sessions/SessionDetailModal'
import { useAuth } from '@clerk/react'
import api from '../config/api.js'
import { socket } from '../config/socket.js'
import toast from 'react-hot-toast'
import Loader from '../components/Loader.jsx'

const Sessions = () => {

  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);

  const {isLoaded, isSignedIn , getToken} = useAuth()

  useEffect(()=>{
      const fetchSessions = async () => {
        if(!isLoaded || !isSignedIn) return;

        try {
           const token = await getToken();
           if(!token) return;
           const res = await api("/api/meetings/sessions", { headers: {Authorization: `Bearer ${token}`},})
           setSessions(res.data.meetings || [])
        } catch (_error) {
          toast.error("Failed to load meeting sessions");
        }finally{
          setLoading(false);
        }
      }

      fetchSessions();
  },[isLoaded, isSignedIn, getToken])

  useEffect(()=>{
    if (!isLoaded || !isSignedIn) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleMeetingDeleted = ({ meetingId }) => {
      setSessions((prev) => prev.filter((session) => session.meetingId !== meetingId));
      setSelectedSession((prev) => (prev && prev.meetingId === meetingId ? null : prev));
    };

    socket.on('meeting-deleted', handleMeetingDeleted);

    return () => {
      socket.off('meeting-deleted', handleMeetingDeleted);
      socket.disconnect();
    };
  }, [isLoaded, isSignedIn]);

  const openSessionDetails = async (sessionId)=> {
     try {
        const token = await getToken();
        const res = await api.get(`/api/meetings/sessions/${sessionId}`, {
          headers: {Authorization: `Bearer ${token}`},
        })
        setSelectedSession(res.data.meeting || res.data.meetings || null);
     } catch (_error) {
        toast.error("Could not fetch session details");
     }
  }

  const handleDeleteSession = async (sessionId) => {
    try {
      const token = await getToken();
      const res = await api.delete(`/api/meetings/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setSessions((prev) => prev.filter((session) => session.meetingId !== sessionId));
        toast.success("Session deleted successfully.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not delete session");
    }
  }

  if(loading){
    return <Loader text='Loading meeting history...' />
  }

  return (
    <main className='flex-1 max-w-7xl w-full mx-auto p-6 md:p-12'>
      {/* page title and navigation header */}
      <Link to="/dashboard" className='flex items-center text-sm gap-1 mb-4 text-slate-500 hover:text-slate-900 transition-colors'>
        <ArrowLeftIcon size={14}/> Go to Dashboard
      </Link>
      <div className='mb-8'>
        <h1 className='text-3xl font-medium tracking-tight text-slate-900'>Meeting sessions.</h1>
        <p className='text-sm text-slate-500 mt-1'>Review your past and active meeting history, participants logs, and chat transcripts.</p>
      </div>

    {/* session grid */}
     { sessions.length === 0 ? (
        <Emptysessions />
     ): (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {sessions.map((session)=>(
          <SessionCard key={session.id} session={session} onOpenDetails={openSessionDetails} onRejoin={(meetingId)=> navigate(`/meeting/${meetingId}`) } onDelete={handleDeleteSession} />
        ))}
      </div>
     )

     }

   {/* session detail modal */}
    <SessionDetailModal session={selectedSession} onClose={()=> setSelectedSession(null)} />
    </main>
  )
}

export default Sessions
