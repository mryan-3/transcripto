'use client';

import { useState, useRef } from 'react';
import { MOCK_MEETINGS, Meeting } from '@/components/core/mock-data';
import WorkspaceSidebar from '@/components/navigation/workspace-sidebar';
import VideoConsole from '@/components/media/video-console';
import TranscriptReader from '@/components/transcription/transcript-reader';
import SummaryPanel from '@/components/intelligence/summary-panel';
import ChatInterface from '@/components/intelligence/chat-interface';
import ImportOverlay from '@/components/core/import-overlay';

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [activeId, setActiveId] = useState<string | null>(MOCK_MEETINGS[0].id);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'insights' | 'chat'>('insights');
  const [isImporting, setIsImporting] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeMeeting = meetings.find((m) => m.id === activeId) || null;

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };

  const handleSimulatedImport = () => {
    // 1. Show processing state
    const processingMeeting: Meeting = {
      id: 'temp-1',
      title: 'New Client Kickoff (Processing)',
      createdAt: 'Just now',
      status: 'PROCESSING',
      segments: [],
      insights: [],
      chats: []
    };

    setMeetings([processingMeeting, ...MOCK_MEETINGS]);
    setActiveId('temp-1');
    setIsImporting(false);

    // 2. Complete processing after 3 seconds
    setTimeout(() => {
      setMeetings((current) => current.map(m =>
        m.id === 'temp-1' ? { ...MOCK_MEETINGS[0], id: 'temp-1', title: 'New Client Kickoff' } : m
      ));
    }, 3000);
  };

  const handleNewClick = () => {
    setActiveId(null);
    setIsImporting(true);
  };

  return (
    <main className="h-screen bg-[#FAF9F6] flex overflow-hidden font-sans">

      {/* Navigation Layer */}
      {(meetings.length > 0 || !isImporting) && (
        <WorkspaceSidebar
          meetings={meetings}
          activeId={activeId}
          onSelect={(id) => { setActiveId(id); setIsImporting(false); }}
          onNewClick={handleNewClick}
        />
      )}

      {/* Core Application Layer */}
      <div className="flex-1 flex flex-col relative h-full">

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {isImporting || !activeMeeting ? (
            <ImportOverlay onImportSimulated={handleSimulatedImport} />
          ) : activeMeeting.status === 'PROCESSING' ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-12 h-12 border-4 border-forest-700/10 border-t-forest-700 rounded-full animate-spin mb-6" />
                <h2 className="font-serif text-2xl text-forest-700 mb-2">Extracting Intelligence...</h2>
                <p className="font-sans text-sm text-forest-700/50">Processing audio with Whisper API</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden">
              
              {/* LEFT COLUMN: Video + Transcript */}
              <div className="flex-[0.6] flex flex-col min-w-0">
                {/* Video Area - The L-Shaped Divider */}
                <div className="flex-shrink-0 pt-8 px-8 pb-8 border-r border-b border-forest-700/10 rounded-br-[60px]">
                  <div className="max-w-4xl mx-auto w-full">
                    <VideoConsole videoRef={videoRef} onTimeUpdate={handleTimeUpdate} />
                  </div>
                </div>
                
                {/* Transcript Area */}
                <div className="flex-1 overflow-hidden flex flex-col pt-4 px-8">
                  <TranscriptReader 
                    segments={activeMeeting.segments} 
                    currentTime={currentTime} 
                    onTimeClick={handleSeek} 
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: Analysis + Chat */}
              <div className="flex-[0.4] flex flex-col min-w-0 pt-8">
                {/* Analysis Area (35% height) */}
                <div className="flex-[0.35] overflow-hidden flex flex-col px-8 pb-4">
                  <div className="pb-4">
                    <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-forest-700">Analysis & Insights</h3>
                  </div>
                  <SummaryPanel insights={activeMeeting.insights} />
                </div>
                
                {/* Chat Area (65% height) */}
                <div className="flex-[0.65] overflow-hidden flex flex-col px-8 pt-4 pb-8">
                  <div className="pt-4 pb-4">
                    <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-forest-700">AI Assistant</h3>
                  </div>
                  <ChatInterface chats={activeMeeting.chats} onTimeClick={handleSeek} />
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  );
}
