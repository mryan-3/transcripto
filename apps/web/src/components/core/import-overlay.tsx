import { useState } from 'react';

interface ImportOverlayProps {
  onImport: (filePath: string) => void;
}

export default function ImportOverlay({ onImport }: ImportOverlayProps) {
  const [path, setPath] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (path.trim()) {
      onImport(path.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 h-full">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full p-10 rounded-3xl bg-forest-700/2 border border-forest-700/10 flex flex-col gap-6 relative overflow-hidden"
      >
        <h2 className="font-serif text-3xl text-forest-700 tracking-tight text-center">
          Import Local Meeting
        </h2>
        <p className="font-sans text-sm text-forest-700/50 text-center">
          Enter the absolute path of the recording on your machine to stream without duplicating files
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="e.g. /home/ryanm/Videos/meeting.mkv"
            className="w-full bg-[#FAF9F6] border border-forest-700/10 rounded-2xl py-4 px-6 text-sm font-sans text-forest-700 placeholder:text-forest-700/30 focus:outline-none focus:ring-1 focus:ring-forest-700/20 transition-all"
          />
          <button
            type="submit"
            disabled={!path.trim()}
            className="w-full py-4 bg-forest-700 hover:bg-forest-700/90 disabled:opacity-50 text-[#FAF9F6] rounded-2xl font-sans text-sm font-semibold transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            Start Processing
          </button>
        </div>
      </form>
    </div>
  );
}
