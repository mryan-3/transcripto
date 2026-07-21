import { useState, useEffect, useRef } from 'react';
import { MOCK_MEETINGS, Meeting } from '@/components/core/mock-data';

const API_BASE = 'http://localhost:4000';

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isImporting, setIsImporting] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeMeeting = meetings.find((m) => m.id === activeId) || null;

  useEffect(() => {
    fetch(`${API_BASE}/meetings`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          setMeetings(json.data);
          setActiveId(json.data[0].id);
          setIsImporting(false);
        } else {
          setMeetings([]);
          setIsImporting(true);
        }
      })
      .catch(() => {
        setMeetings(MOCK_MEETINGS);
        setActiveId(MOCK_MEETINGS[0].id);
        setIsImporting(false);
      });
  }, []);

  useEffect(() => {
    if (!activeId || !activeMeeting || (activeMeeting.status !== 'PENDING' && activeMeeting.status !== 'PROCESSING')) return;
    const interval = setInterval(() => {
      fetch(`${API_BASE}/meetings/${activeId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) setMeetings((curr) => curr.map((m) => (m.id === activeId ? json.data : m)));
        });
    }, 3000);
    return () => clearInterval(interval);
  }, [activeId, activeMeeting?.status]);

  const handleImport = async (filePath: string) => {
    const tempId = `temp-${Date.now()}`;
    const pending = { id: tempId, title: filePath.split('/').pop() || 'New Import', createdAt: 'Just now', status: 'PENDING' as const, segments: [], insights: [], chats: [] };
    setMeetings((prev) => [pending, ...prev]);
    setActiveId(tempId);
    setIsImporting(false);

    try {
      const res = await fetch(`${API_BASE}/meetings/import-local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath })
      });
      const json = await res.json();
      if (json.success) {
        setMeetings((curr) => curr.map((m) => (m.id === tempId ? json.data : m)));
        setActiveId(json.data.id);
      } else {
        alert(json.error || 'Failed to import local file');
        setMeetings((curr) => curr.filter((m) => m.id !== tempId));
        setIsImporting(true);
      }
    } catch {
      alert('Failed to connect to API server.');
      setMeetings((curr) => curr.filter((m) => m.id !== tempId));
      setIsImporting(true);
    }
  };

  return {
    meetings, activeId, setActiveId, activeMeeting, currentTime, isImporting, videoRef,
    handleTimeUpdate: () => { if (videoRef.current) setCurrentTime(videoRef.current.currentTime); },
    handleSeek: (secs: number) => { if (videoRef.current) { videoRef.current.currentTime = secs; videoRef.current.play(); } },
    handleImport,
    handleNewClick: () => { setActiveId(null); setIsImporting(true); }
  };
}
