import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeonButton } from '../../components/ui/NeonButton';
import { Float, Text } from '@react-three/drei';

const LoginScene = () => (
  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
    <Text
      fontSize={1}
      position={[-3, 0, 0]}
      color="#00f3ff"
      anchorX="center"
      anchorY="middle"
    >
      SMART
      <meshBasicMaterial toneMapped={false} />
    </Text>
    <Text
      fontSize={1}
      position={[-3, -1.2, 0]}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      GYM
    </Text>
  </Float>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <MainLayout sceneContent={<LoginScene />}>
      <div className="flex h-full items-center justify-end md:pr-20">
        <GlassCard className="w-full max-w-md pointer-events-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-sci text-white mb-2">ACCESS PORTAL</h2>
            <p className="text-gray-400 text-sm font-mono">BIOMETRIC AUTHENTICATION REQUIRED</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-neon-cyan text-xs font-mono mb-2">USER_IDENTIFIER</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-neon"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-neon-cyan text-xs font-mono mb-2">PASSKEY</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-neon"
                placeholder="••••••••"
              />
            </div>

            <NeonButton type="submit" disabled={loading}>
              {loading ? 'INITIALIZING...' : 'ENTER SYSTEM'}
            </NeonButton>
            
            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => navigate('/register')}
                className="text-xs font-mono text-gray-500 hover:text-neon-cyan transition-colors"
              >
                CREATE_NEW_IDENTITY // REGISTER
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default LoginPage;