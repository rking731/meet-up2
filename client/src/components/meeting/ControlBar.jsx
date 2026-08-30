import { CheckIcon, CopyIcon, MessageSquareIcon, MicIcon, MicOff, PhoneOffIcon, UserIcon, VideoIcon, VideoOffIcon } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ControlBar = ({roomId, audioEnabled, videoEnabled, onToggleAudio, onToggleVideo, onToggleChat, onToggleParticipants, isChatOpen, isParticipantsOpen, unreadCount, participantCount, isHost, onLeave, onEndMeeting}) => {
    const [copied, setCopied] = useState(false)

    const meetingLink = roomId ? `${window.location.origin}/meeting/${roomId}` : "";

    const copyMeetingId = async ()=>{
        const valueToCopy = roomId ? String(roomId) : "";

        if (!valueToCopy) {
            toast.error("No meeting ID available to copy.");
            return;
        }

        try {
            await navigator.clipboard.writeText(valueToCopy);
            setCopied(true);
            toast.success("Meeting ID copied!");
            setTimeout(()=>setCopied(false), 2000)
        } catch (error) {
            console.error("Failed to copy meeting ID:", error);
            toast.error("Unable to copy meeting ID");
        }
    }

    const shareMeeting = async () => {
        if (!meetingLink) {
            toast.error("No meeting link available to share.");
            return;
        }

        const shareText = `Join my meeting: ${meetingLink}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'MeetUp meeting invite',
                    text: shareText,
                    url: meetingLink,
                });
                toast.success("Meeting link shared!");
                return;
            }

            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            toast.success("WhatsApp share window opened!");
        } catch (error) {
            console.error("Share failed:", error);
            toast.error("Unable to share the meeting link");
        }
    }

  return (
    <footer className='w-full bg-white/90 backdrop-blur-md border-t border-slate-200/80 px-6 py-4 flex items-center justify-between z-40 shadow-lg shadow-slate-200/50'>
      {/* info & share meeting */}
      <div className='hidden sm:flex items-center gap-3'>
        <span className='text-xs font-medium text-slate-600 font-mono tracking-wider'>Id: {roomId}</span>
        <button onClick={copyMeetingId} className='p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all'>
            {copied ? <CheckIcon className='w-3.5 h-3.5 text-emerald-600' /> : <CopyIcon className='w-3.5 h-3.5'/>}
            <span>{copied ? "Copied" : "Copy ID"}</span>
        </button>
        <button onClick={shareMeeting} className='p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all'>
            <span>Share</span>
        </button>
      </div>
      {/* center */}
      <div className='flex items-center gap-3 mx-auto sm:mx-0'>
        {/* audio */}
         <button onClick={onToggleAudio} className={`p-3.5 rounded-2xl transition-all cursor-pointer border ${
            audioEnabled ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs" : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 shadow-xs"
         }`} title={audioEnabled ? "Mute Microphone" : "Unmute Microphone"}>
           {audioEnabled ? <MicIcon className='w-5 h-5' /> : <MicOff className='w-5 h-5' />}
         </button>
        {/* video */}
           
        <button onClick={onToggleVideo} className={`p-3.5 rounded-2xl transition-all cursor-pointer border ${
            videoEnabled ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs" : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 shadow-xs"
         }`} title={videoEnabled ? "Turn Off Camera" : "Turn On Camera"}>
           {videoEnabled ? <VideoIcon className='w-5 h-5' /> : <VideoOffIcon className='w-5 h-5' />}
         </button>
        {/* chat */}
        <button onClick={onToggleChat} className={`p-3.5 rounded-2xl transition-all cursor-pointer border ${
            isChatOpen ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs" 
         }`} title="Toggle In-Meeting Chat">
            <MessageSquareIcon className='w-5 h-5' />
            {unreadCount > 0 && !isChatOpen && (
                <span className='absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs '>
                    {unreadCount}
                </span>
            )}
         </button>
        {/* participants */}
           
        <button onClick={onToggleParticipants} className={`relative p-3.5 rounded-2xl transition-all cursor-pointer border ${
            isParticipantsOpen ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs" 
         }`} title="Toggle Participants List">
            <UserIcon className='w-5 h-5' />
           
                <span className='absolute -top-1 -right-1 bg-slate-200 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-300 '>
                    {participantCount}
                </span>
            
         </button>
        {/* leave / end meeting btn */}
        {isHost ? (
            <button title='End Meeting for All' onClick={onEndMeeting} className='p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 transition-all cursor-pointer border border-red-500 ml-2 font-medium text-xs flex items-center gap-1.5'>
              <PhoneOffIcon className='w-5 h-5' />
              <span className='hidden md:inline'>End Meeting</span>
            </button>
        ): 
        <button title='Leave Meeting' onClick={onLeave} className='p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 transition-all cursor-pointer border border-red-500 ml-2 font-medium text-xs flex items-center gap-1.5'>
             <PhoneOffIcon className='w-5 h-5' />
              <span className='hidden md:inline'>Leave Meeting</span>
        </button>
        }
      </div>
      {/* placeholder */}
      <div className='hidden sm:block w-32 text-right'>
        <span className='font-medium text-slate-400'>MeetUp Room</span>
      </div>
    </footer>
  )
}

export default ControlBar
