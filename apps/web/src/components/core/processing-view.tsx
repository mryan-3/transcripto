export default function ProcessingView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-12 h-12 border-4 border-forest-700/10 border-t-forest-700 rounded-full animate-spin mb-6" />
        <h2 className="font-serif text-2xl text-forest-700 mb-2">Extracting Intelligence...</h2>
        <p className="font-sans text-sm text-forest-700/50">Processing audio with Whisper API</p>
      </div>
    </div>
  );
}
