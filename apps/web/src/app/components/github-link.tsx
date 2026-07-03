import { GithubLogo } from "@phosphor-icons/react/dist/ssr";

export default function GithubLink() {
  return (
    <div className="absolute top-8 left-8 md:top-12 md:left-12">
      <a 
        href="https://github.com/mryan-3/transcripto" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-forest-700/50 hover:text-forest-700 transition-colors font-sans text-sm font-medium"
      >
        <GithubLogo size={20} />
        <span>mryan-3</span>
      </a>
    </div>
  );
}
