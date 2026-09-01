'use client';

interface FlameAvatarProps {
  stage: 'Spark' | 'Blaze' | 'Inferno';
  level: number;
}

export default function FlameAvatar({ stage, level }: FlameAvatarProps) {
  const getFlameSize = () => {
    switch (stage) {
      case 'Spark': return 'w-24 h-24';
      case 'Blaze': return 'w-32 h-32';
      case 'Inferno': return 'w-40 h-40';
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${getFlameSize()} relative flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-t from-orange via-orange-light to-yellow-300 rounded-full blur-xl opacity-60 animate-pulse" />
        <div className="relative text-6xl">🔥</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-cream">{stage}</span>
        <span className="px-2 py-1 bg-plum rounded-full text-xs font-medium text-orange border border-orange/30">
          Lv {level}
        </span>
      </div>
    </div>
  );
}
