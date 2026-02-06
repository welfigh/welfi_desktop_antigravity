interface NewsCardProps {
  emoji: string;
  message: string;
}

export function NewsCard({ emoji, message }: NewsCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col gap-5 min-w-[250px] border border-gray-100 hover:border-[#3246ff]/20 hover:-translate-y-1 cursor-pointer">
      <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{emoji}</div>
      <p className="text-[#141219] text-sm leading-relaxed">{message}</p>
    </div>
  );
}