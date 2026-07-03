import GithubLink from "./components/github-link";
import PosterContent from "./components/poster-content";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center">
      <GithubLink />
      <PosterContent />
    </main>
  );
}
