
import React, { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ThreeElements } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text, Line, useCursor, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { AnimatePresence, motion } from 'framer-motion';
import { create } from 'zustand';
import { 
  Activity, 
  User, 
  Calendar, 
  CreditCard, 
  Users, 
  Trophy, 
  TrendingUp, 
  LogOut,
  Dumbbell,
  Cpu,
  ShieldCheck
} from 'lucide-react';

// Fix for JSX.IntrinsicElements in @react-three/fiber
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// --- STORE ---
type AppView = 'AUTH' | 'PROFILE' | 'DASHBOARD' | 'CLASSES' | 'WALLET' | 'SOCIAL';

interface AppState {
  currentView: AppView;
  user: any | null;
  setView: (view: AppView) => void;
  login: (user: any) => void;
  logout: () => void;
}

const useStore = create<AppState>((set) => ({
  currentView: 'AUTH',
  user: null,
  setView: (view) => set({ currentView: view }),
  login: (user) => set({ user, currentView: 'PROFILE' }),
  logout: () => set({ user: null, currentView: 'AUTH' }),
}));

// --- 3D COMPONENTS ---

const StarField = () => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });
  return (
    <group ref={ref} rotation={[0, 0, Math.PI / 4]}>
      <Points />
    </group>
  );
};

const Points = () => {
  const points = useMemo(() => {
    const p = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      let x = (Math.random() - 0.5) * 30;
      let y = (Math.random() - 0.5) * 30;
      let z = (Math.random() - 0.5) * 30;
      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = z;
    }
    return p;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00f3ff"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

// Interactive Particles for Logo
const LogoParticles = () => {
  const count = 100;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    if (!mesh.current) return;
    
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const t = time + i * 100;
      // Basic formation
      let x = Math.sin(t * 0.1) * 3 + (i % 10) * 0.2 - 1;
      let y = Math.cos(t * 0.1) * 3 + Math.floor(i / 10) * 0.2 - 1;
      let z = 0;

      // Mouse repulsion
      const dist = Math.sqrt(Math.pow((mouse.x * viewport.width / 2) - x, 2) + Math.pow((mouse.y * viewport.height / 2) - y, 2));
      if (dist < 2) {
        const angle = Math.atan2(y - (mouse.y * viewport.height / 2), x - (mouse.x * viewport.width / 2));
        x += Math.cos(angle) * (2 - dist);
        y += Math.sin(angle) * (2 - dist);
      }

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.05);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#00ff41" />
    </instancedMesh>
  );
}

const HolographicTimeline = () => {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group} position={[3, 0, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh>
          <cylinderGeometry args={[1, 1, 4, 32, 1, true]} />
          <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
        {/* Data points on the timeline */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[Math.sin(i) * 1, i - 2, Math.cos(i) * 1]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#ff9e00" />
          </mesh>
        ))}
      </Float>
    </group>
  );
};

const Mannequin = ({ morphValue }: { morphValue: number }) => {
  // Simulating a rigged mesh morphing. 
  // In a real app we'd load a GLTF. Here we use basic shapes scaling.
  const ref = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (ref.current) {
      // Morph based on input (scale width)
      const scale = 0.5 + (morphValue / 100) * 0.5;
      ref.current.scale.set(scale, 1, scale);
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={ref} position={[0, -1, 0]}>
      {/* Torso */}
      <mesh position={[0, 1.5, 0]}>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <MeshDistortMaterial color="#00f3ff" wireframe distort={0.3} speed={2} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.25]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
      {/* Limbs (Simplified) */}
      <mesh position={[-0.4, 1.5, 0]} rotation={[0,0,0.2]}>
        <capsuleGeometry args={[0.1, 1]} />
        <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.4, 1.5, 0]} rotation={[0,0,-0.2]}>
        <capsuleGeometry args={[0.1, 1]} />
        <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

// --- UI VIEWS ---

const AuthView = () => {
  const login = useStore((s) => s.login);
  const [email, setEmail] = useState('');
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 rounded-2xl w-full max-w-md pointer-events-auto flex flex-col gap-6"
      >
        <div className="text-center">
          <h1 className="text-4xl text-white mb-1 tracking-widest neon-text-cyan">SMARTGYM</h1>
          <p className="text-xs text-gray-400 font-mono">BIOMETRIC ACCESS PORTAL</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="group">
            <label className="text-xs text-gray-500 font-mono mb-1 block">USER_ID</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded font-mono focus:border-cyan-400 transition-colors"
              placeholder="ENTER ID..."
            />
          </div>
          <div className="group">
            <label className="text-xs text-gray-500 font-mono mb-1 block">PASSKEY</label>
            <input 
              type="password" 
              className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded font-mono focus:border-cyan-400 transition-colors"
              placeholder="••••••"
            />
          </div>
        </div>

        <button 
          onClick={() => login({ name: 'User' })}
          className="w-full bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-500 text-cyan-400 py-3 rounded font-bold tracking-widest transition-all hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
        >
          INITIALIZE_SESSION
        </button>
      </motion.div>
    </div>
  );
};

const ProfileView = () => {
  const [weight, setWeight] = useState(70);
  const setView = useStore((s) => s.setView);

  return (
    <div className="absolute inset-0 flex pointer-events-none">
      {/* 3D Mannequin is in the Canvas, we control it via prop or state */}
      
      {/* Left Panel */}
      <div className="w-1/3 h-full p-10 flex flex-col justify-center pointer-events-auto">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass-panel p-6 rounded-xl"
        >
          <h2 className="text-2xl mb-6 neon-text-cyan">BIOMETRIC CONSTRUCTION</h2>
          
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2 font-mono">WEIGHT_CALIBRATION</label>
            <input 
              type="range" 
              min="50" 
              max="120" 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono mt-1 text-cyan-400">
              <span>50KG</span>
              <span className="text-lg">{weight}KG</span>
              <span>120KG</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 border border-gray-700 rounded hover:border-cyan-400 cursor-pointer transition-colors bg-black/40 text-center group">
              <Dumbbell className="mx-auto mb-2 text-gray-500 group-hover:text-cyan-400" />
              <span className="text-xs font-mono text-gray-400">HYPERTROPHY</span>
            </div>
            <div className="p-4 border border-gray-700 rounded hover:border-cyan-400 cursor-pointer transition-colors bg-black/40 text-center group">
              <Activity className="mx-auto mb-2 text-gray-500 group-hover:text-cyan-400" />
              <span className="text-xs font-mono text-gray-400">ENDURANCE</span>
            </div>
          </div>

          <button 
            onClick={() => setView('DASHBOARD')}
            className="w-full py-3 bg-gradient-to-r from-cyan-900 to-transparent border-l-4 border-cyan-400 text-left px-4 font-mono text-cyan-400 hover:pl-6 transition-all"
          >
            GENERATE_PLAN >>
          </button>
        </motion.div>
      </div>

      {/* Right Panel - Plan Preview */}
      <div className="w-1/3 h-full ml-auto p-10 flex flex-col justify-center items-end pointer-events-none">
        <div className="glass-panel p-4 rounded-lg mb-4 pointer-events-auto">
          <h3 className="text-sm font-mono text-gray-400 border-b border-gray-700 pb-2 mb-2">AI_ANALYSIS</h3>
          <p className="text-xs text-green-400 font-mono leading-relaxed">
            > SCANNING BODY COMPOSITION...<br/>
            > OPTIMIZING FOR MESOMORPH TYPE...<br/>
            > CALCULATING METABOLIC RATE...<br/>
            > PLAN READY.
          </p>
        </div>
      </div>
      
      {/* Passing state to global canvas via a portal or just reliance on global state would be better, 
          but for simplicity in this file structure, we might need a dedicated canvas component that subscribes to this state.
          We will solve this by putting state in the store or using a context bridge.
          For this demo, we'll let the canvas just read the store or use a prop in the parent.
      */}
      <MannequinStateBridge weight={weight} />
    </div>
  );
};

// Helper to bridge UI state to 3D world
const MannequinStateBridge = ({ weight }: { weight: number }) => {
  // This component doesn't render DOM, but updates the store for the 3D scene to read
  // Actually, since the Canvas is a sibling, we can't pass props easily without context.
  // We'll use the Zustand store.
  React.useEffect(() => {
    useUIStore.setState({ mannequinWeight: weight });
  }, [weight]);
  return null;
};

const DashboardView = () => {
  return (
    <div className="absolute inset-0 p-8 pt-24 pointer-events-none flex gap-6">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-1 glass-panel rounded-2xl p-6 pointer-events-auto flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl neon-text-cyan">COMMAND DECK</h2>
          <div className="text-xs font-mono text-green-400 border border-green-900 bg-green-900/20 px-2 py-1 rounded">
            SYSTEM ONLINE
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'CALORIES_BURNED', value: '2,450', icon: Activity, color: 'text-orange-400' },
            { label: 'WORKOUT_STREAK', value: '12 DAYS', icon: TrendingUp, color: 'text-cyan-400' },
            { label: 'NEXT_SESSION', value: '18:00', icon: Calendar, color: 'text-green-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-black/40 p-4 rounded border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-[10px] text-gray-500 font-mono">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-black/20 rounded border border-gray-800 p-4 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-gray-600 font-mono rotate-[-45deg]">HOLOGRAPHIC_DATA_VISUALIZATION_ACTIVE</p>
          </div>
          {/* This area is transparent to show the 3D charts behind it */}
        </div>
      </motion.div>

      <div className="w-80 flex flex-col gap-4 pointer-events-auto">
        <div className="glass-panel p-4 rounded-xl">
          <h3 className="text-sm font-mono text-gray-400 mb-4 flex items-center gap-2">
            <Users size={14} /> COMMUNITY_FEED
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="text-xs border-l-2 border-gray-700 pl-3 py-1">
                <span className="text-cyan-400">User_{100+i}</span> completed <span className="text-white">HIIT Crush</span>
                <div className="text-gray-600 font-mono mt-1">2 MIN AGO</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex-1">
           <h3 className="text-sm font-mono text-gray-400 mb-4 flex items-center gap-2">
            <Trophy size={14} /> ACTIVE_CHALLENGES
          </h3>
          <div className="space-y-4">
             <div className="bg-gradient-to-r from-orange-900/20 to-transparent p-3 rounded border border-orange-900/50">
                <div className="text-orange-400 font-bold text-sm mb-1">IRON TITAN</div>
                <div className="w-full bg-gray-800 h-1 rounded-full mt-2">
                  <div className="bg-orange-500 h-1 rounded-full" style={{width: '70%'}}></div>
                </div>
                <div className="text-right text-[10px] text-gray-500 mt-1">70% COMPLETE</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STORE FOR UI <-> 3D COMMUNICATION ---
interface UIStore {
  mannequinWeight: number;
}
const useUIStore = create<UIStore>(() => ({
  mannequinWeight: 70
}));

// --- MAIN 3D SCENE ---

const Scene = () => {
  const currentView = useStore((s) => s.currentView);
  const mannequinWeight = useUIStore((s) => s.mannequinWeight);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        maxPolarAngle={Math.PI / 1.8} 
        minPolarAngle={Math.PI / 2.5}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff41" />
      
      <StarField />
      
      <Suspense fallback={null}>
        <AnimatePresence>
          {currentView === 'AUTH' && (
            <group>
              <LogoParticles />
              <Float speed={4} rotationIntensity={0.2} floatIntensity={0.2}>
                <Text 
                  position={[0, 2, 0]} 
                  fontSize={0.5} 
                  font="https://fonts.gstatic.com/s/orbitron/v25/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nygyU.woff"
                  anchorX="center" 
                  anchorY="middle"
                >
                  SMARTGYM
                  <meshBasicMaterial color="#ffffff" toneMapped={false} />
                </Text>
              </Float>
            </group>
          )}

          {currentView === 'PROFILE' && (
            <group position={[0, -0.5, 0]}>
              <Mannequin morphValue={mannequinWeight} />
              <HolographicTimeline />
              {/* Floor Grid */}
              <gridHelper args={[20, 20, 0x00f3ff, 0x111111]} position={[0, -2, 0]} />
            </group>
          )}

          {currentView === 'DASHBOARD' && (
            <group position={[-2, 0, 0]}>
              {/* 3D Charts */}
              {[...Array(7)].map((_, i) => (
                <mesh key={i} position={[i * 0.8, (Math.random() * 2) - 1, 0]}>
                  <boxGeometry args={[0.5, Math.random() * 3 + 1, 0.5]} />
                  <MeshDistortMaterial color={i % 2 === 0 ? "#00f3ff" : "#00ff41"} speed={2} distort={0.2} transparent opacity={0.8} />
                </mesh>
              ))}
              <gridHelper args={[10, 10, 0x333333, 0x111111]} rotation={[Math.PI/2, 0, 0]} position={[2, 0, -2]} />
            </group>
          )}
        </AnimatePresence>
      </Suspense>
      
      {/* Post Processing Effects could go here (Bloom, Glitch) */}
    </>
  );
};

// --- NAVIGATION BAR ---
const NavBar = () => {
  const { setView, currentView, logout } = useStore();
  
  const navItems = [
    { id: 'DASHBOARD', icon: Activity, label: 'DASHBOARD' },
    { id: 'CLASSES', icon: Calendar, label: 'CLASSES' },
    { id: 'WALLET', icon: CreditCard, label: 'WALLET' },
    { id: 'SOCIAL', icon: Users, label: 'NETWORK' },
  ];

  if (currentView === 'AUTH' || currentView === 'PROFILE') return null;

  return (
    <div className="absolute left-0 top-0 bottom-0 w-20 glass-panel border-r border-gray-800 flex flex-col items-center py-8 z-50">
      <div className="mb-10 text-cyan-400">
        <Cpu size={32} />
      </div>
      
      <div className="flex flex-col gap-8 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as AppView)}
            className={`p-3 rounded-xl transition-all duration-300 relative group ${currentView === item.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-white'}`}
          >
            <item.icon size={24} />
            {currentView === item.id && (
              <motion.div 
                layoutId="activeNav"
                className="absolute inset-0 border border-cyan-500 rounded-xl shadow-[0_0_10px_rgba(0,243,255,0.5)]"
              />
            )}
            <div className="absolute left-full ml-4 bg-black border border-gray-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {item.label}
            </div>
          </button>
        ))}
      </div>

      <button onClick={logout} className="p-3 text-red-500 hover:bg-red-900/20 rounded-xl transition-colors">
        <LogOut size={24} />
      </button>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const currentView = useStore((state) => state.currentView);

  return (
    <div className="relative w-full h-screen">
      {/* 3D Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping }}>
          <Scene />
        </Canvas>
      </div>

      {/* 2D Interface Layer (HUD) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <NavBar />
        
        {/* Content Router */}
        <div className="w-full h-full">
          {currentView === 'AUTH' && <AuthView />}
          {currentView === 'PROFILE' && <ProfileView />}
          {currentView === 'DASHBOARD' && <DashboardView />}
          
          {/* Placeholder for other views */}
          {(currentView === 'CLASSES' || currentView === 'WALLET' || currentView === 'SOCIAL') && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="glass-panel p-8 rounded-xl text-center">
                <ShieldCheck size={48} className="mx-auto mb-4 text-cyan-400" />
                <h2 className="text-2xl font-mono text-white mb-2">MODULE_LOCKED</h2>
                <p className="text-gray-400 text-sm">Please complete dashboard initialization.</p>
                <button 
                  onClick={() => useStore.getState().setView('DASHBOARD')}
                  className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs font-mono pointer-events-auto transition-colors"
                >
                  RETURN_TO_BASE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay Scanlines Effect */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
    </div>
  );
};

export default App;