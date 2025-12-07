import { MainLayout } from '../../components/layout/MainLayout';
import { GlassCard } from '../../components/ui/GlassCard';
import { Float } from '@react-three/drei';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 pointer-events-auto">
        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-neon-cyan text-sm font-mono mb-4">SYSTEM STATUS</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold font-sci">82%</span>
              <span className="text-green-400 text-xs mb-1">▲ RECOVERY</span>
            </div>
            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
              <div className="bg-neon-cyan h-full w-[82%] shadow-[0_0_10px_#00f3ff]"></div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-neon-orange text-sm font-mono mb-4">CALORIC BURN</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold font-sci">2,450</span>
              <span className="text-xs text-gray-400">KCAL / TODAY</span>
            </div>
          </GlassCard>
        </div>

        <div className="md:col-span-2 relative h-64 md:h-auto">
          <div className="absolute top-0 right-0 p-4 text-right">
            <h1 className="text-4xl font-sci text-white mb-1">COMMAND DECK</h1>
            <p className="text-neon-cyan text-xs font-mono tracking-widest">WELCOME BACK, USER</p>
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {['NEW WORKOUT', 'DIET LOG', 'BOOK CLASS', 'WALLET'].map((action, i) => (
            <button key={i} className="glass-panel p-4 hover:bg-white/5 transition-all text-left group">
              <div className="text-neon-cyan mb-2 group-hover:translate-x-1 transition-transform">→</div>
              <div className="text-sm font-bold font-mono text-gray-300 group-hover:text-white">{action}</div>
            </button>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;