import { Canvas } from '@react-three/fiber';
import { SceneEnvironment } from '../3d/SceneEnvironment';
import { ReactNode, Suspense } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  sceneContent?: ReactNode;
}

export const MainLayout = ({ children, sceneContent }: Props) => {
  return (
    <div className="relative w-full h-screen bg-void overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <SceneEnvironment />
          <Suspense fallback={null}>
            {sceneContent}
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2cpIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')]"></div>
      
      <main className="absolute inset-0 z-20 overflow-y-auto overflow-x-hidden p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="w-full h-full max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};