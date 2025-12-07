
import { MainLayout } from '../../components/layout/MainLayout';
import { GlassCard } from '../../components/ui/GlassCard';
import { Float } from '@react-three/drei';
import { 
  Activity, 
  Flame, 
  CalendarCheck, 
  TrendingUp, 
  Zap, 
  Dumbbell 
} from 'lucide-react';

const DashboardScene = () => (
  <group position={[3, 0, 0]}>
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[i * 0.8 - 2, i * 0.5, 0]}>
          <boxGeometry args={[0.5, i + 1, 0.5]} />
          <meshStandardMaterial color={i % 2 ? '#00f3ff' : '#00ff41'} wireframe />
        </mesh>
      ))}
    </Float>
  </group>
);

const DashboardPage = () => {
  return (
    <MainLayout sceneContent={<DashboardScene />}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-10 pointer-events-auto h-full content-start">
        
        {/* Header Section */}
        <div className="md:col-span-12 flex justify-between items-end border-b border-white/10 pb-4 mb-2">
          <div>
            <h1 className="text-3xl font-sci text-white mb-1">DASHBOARD</h1>
            <p className="text-neon-cyan text-xs font-mono tracking-widest">PERFORMANCE OVERVIEW</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/30">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold font-mono">SYSTEM ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Quick Stats - Top Row */}
        <div className="md:col-span-4 space-y-4">
          <GlassCard className="relative overflow-hidden group hover:border-neon-cyan/50 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <Activity size={40} className="text-neon-cyan" />
            </div>
            <h3 className="text-gray-400 text-xs font-mono mb-1">RECOVERY STATUS</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold font-sci text-white">82%</span>
              <span className="text-green-400 text-xs mb-1 font-mono">▲ OPTIMAL</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-neon-cyan h-full w-[82%] shadow-[0_0_10px_#00f3ff]"></div>
            </div>
          </GlassCard>

          <GlassCard className="relative overflow-hidden group hover:border-neon-orange/50 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <Flame size={40} className="text-neon-orange" />
            </div>
            <h3 className="text-gray-400 text-xs font-mono mb-1">DAILY BURN</h3>
            <div className="flex justify-between items-end">
              <span className="text-4xl font-bold font-sci text-white">2,450</span>
              <span className="text-xs text-neon-orange mb-1 font-mono">KCAL</span>
            </div>
          </GlassCard>
        </div>

        {/* Central Visualization Area */}
        <div className="md:col-span-8 relative min-h-[300px] flex items-center justify-center">
           {/* This area lets the 3D scene shine through */}
           <div className="absolute bottom-4 right-4 text-right pointer-events-none">
              <h2 className="text-6xl font-sci text-white/10 select-none">SMART</h2>
              <h2 className="text-6xl font-sci text-white/10 select-none">GYM</h2>
           </div>
        </div>

        {/* Action Grid */}
        <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { title: 'NEW WORKOUT', icon: Dumbbell, color: 'text-cyan-400' },
            { title: 'SCHEDULE', icon: CalendarCheck, color: 'text-purple-400' },
            { title: 'PROGRESS', icon: TrendingUp, color: 'text-green-400' },
            { title: 'QUICK START', icon: Zap, color: 'text-yellow-400' }
          ].map((item, i) => (
            <button key={i} className="glass-panel p-4 hover:bg-white/5 hover:scale-[1.02] transition-all text-left group flex flex-col justify-between h-24 border-t-2 border-t-transparent hover:border-t-neon-cyan">
              <item.icon className={`${item.color} mb-2 group-hover:scale-110 transition-transform`} size={24} />
              <div className="flex justify-between items-end">
                <div className="text-sm font-bold font-mono text-gray-300 group-hover:text-white">{item.title}</div>
                <div className="text-gray-600 text-xs font-mono group-hover:text-neon-cyan transition-colors">→</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
