import React from 'react'
import VideoTile from './VideoTile';

const VideoGrid = ({localStream, localUser, remoteUsers,  audioEnabled, videoEnabled}) => {
    const totalParticipants = 1 + remoteUsers.length;

    // grid columns
    const getGridclass = ()=> {
        if(totalParticipants === 1) return "grid-cols-1 max-w-4xl"
        if(totalParticipants === 2) return "grid-cols-1 md:grid-cols-2 max-w-5xl"
        if(totalParticipants <= 4) return "grid-cols-1 md:grid-cols-2 max-w-5xl"
        if(totalParticipants <= 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl"

        return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-7xl"
    }

  return (
    <div className='flex w-full flex-1 items-center justify-center p-4 overflow-y-auto'>
      <div className={`w-full grid gap-4 ${getGridclass()} aspect-video max-h-[calc(100vh-140px)] transition-all duration-300`}>
       {/* local user tile */}
       <VideoTile stream={localStream} name={localUser?.name || "You"} isLocal={true} audioEnabled={audioEnabled} videoEnabled={videoEnabled} />

       {/* remote users */}
       {remoteUsers.map((remote)=>(
         <VideoTile key={remote.soketId} stream={remote.stream} name={remote.userName} isLocal={false} audioEnabled={remote.audioEnabled} videoEnabled={remote.videoEnabled} />
       ))}
      </div>
    </div>
  )
}

export default VideoGrid
