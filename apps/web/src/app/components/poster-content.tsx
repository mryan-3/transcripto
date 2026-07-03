export default function PosterContent() {
  return (
    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-6 text-center space-y-12">
      <h1 className="font-serif text-6xl md:text-8xl tracking-tight text-forest-700 leading-none">
        Transcripto
      </h1>
      
      <p className="font-sans text-lg md:text-2xl text-forest-700/80 font-light leading-relaxed max-w-3xl">
        <strong className="font-medium text-forest-700">Transcripto is an open-source personal assistant for meeting recordings.</strong>{" "}
        It runs locally to extract audio, generate structured transcripts, and isolate action items and requirements into a queryable workspace.
      </p>
    </div>
  );
}
