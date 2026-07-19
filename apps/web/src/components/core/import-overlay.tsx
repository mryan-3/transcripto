interface ImportOverlayProps {
  onImportSimulated: (title: string) => void;
}

export default function ImportOverlay({ onImportSimulated }: ImportOverlayProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 h-full">
      <div 
        onClick={() => onImportSimulated("Transcripto Cloud Architecture Strategy")}
        className="max-w-2xl w-full aspect-[21/9] rounded-3xl bg-forest-700/[0.02] flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-forest-700/[0.04] transition-colors group relative overflow-hidden"
      >
        <div className="absolute inset-0 border border-forest-700/10 rounded-3xl m-2 group-hover:border-forest-700/20 transition-colors border-dashed" />
        
        <h2 className="font-serif text-3xl text-forest-700 tracking-tight z-10">
          Upload Recording
        </h2>
        <p className="font-sans text-sm text-forest-700/50 z-10">
          Drag and drop audio or video file to process
        </p>
      </div>
    </div>
  );
}
