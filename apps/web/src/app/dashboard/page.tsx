'use client';

import WorkspaceSidebar from '@/components/navigation/workspace-sidebar';
import ImportOverlay from '@/components/core/import-overlay';
import VideoColumn from '@/components/media/video-column';
import IntelligenceColumn from '@/components/intelligence/intelligence-column';
import ProcessingView from '@/components/core/processing-view';
import { useMeetings } from '@/hooks/use-meetings';

export default function Dashboard() {
  const {
    meetings,
    activeId,
    setActiveId,
    activeMeeting,
    currentTime,
    isImporting,
    videoRef,
    handleTimeUpdate,
    handleSeek,
    handleImport,
    handleNewClick
  } = useMeetings();

  return (
    <main className="h-screen bg-[#FAF9F6] flex overflow-hidden font-sans">
      {(meetings.length > 0 || !isImporting) && (
        <WorkspaceSidebar
          meetings={meetings}
          activeId={activeId}
          onSelect={(id) => { setActiveId(id); }}
          onNewClick={handleNewClick}
        />
      )}
      
      <div className="flex-1 flex flex-col relative h-full">
        <div className="flex-1 flex overflow-hidden">
          {isImporting || !activeMeeting ? (
            <ImportOverlay onImport={handleImport} />
          ) : activeMeeting.status === 'PROCESSING' ? (
            <ProcessingView />
          ) : (
            <div className="flex-1 flex overflow-hidden">
              <VideoColumn
                videoRef={videoRef}
                currentTime={currentTime}
                onTimeUpdate={handleTimeUpdate}
                onTimeClick={handleSeek}
                activeMeeting={activeMeeting}
              />
              <IntelligenceColumn
                activeMeeting={activeMeeting}
                onTimeClick={handleSeek}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
