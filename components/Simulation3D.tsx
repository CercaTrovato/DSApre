import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder, PerspectiveCamera, Torus, Sparkles, Html, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- 3D Components ---

const HumanBody = ({ onClick, opacity }: { onClick: () => void; opacity: number }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  const materialProps = {
    color: "#475569",
    transparent: true,
    opacity: opacity,
    roughness: 0.1,
    metalness: 0.8,
    wireframe: true
  };

  return (
    <group ref={group} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Head */}
      <Sphere args={[0.6, 32, 32]} position={[0, 3.8, 0]}>
        <meshStandardMaterial {...materialProps} />
      </Sphere>
      {/* Neck */}
      <Cylinder args={[0.25, 0.25, 0.8, 16]} position={[0, 3, 0]}>
        <meshStandardMaterial {...materialProps} />
      </Cylinder>
      {/* Torso */}
      <Cylinder args={[0.8, 0.6, 2.5, 32]} position={[0, 1.4, 0]}>
        <meshStandardMaterial {...materialProps} color={opacity < 0.5 ? "#000" : "#475569"} />
      </Cylinder>
      {/* Highlight Chest Area */}
      <Sphere args={[0.3, 16, 16]} position={[0, 2.2, 0.5]} visible={opacity > 0.8}>
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.5} />
        <Html position={[0.5, 2.2, 0.5]} center>
          <div className="pointer-events-none text-xs font-bold text-cyan-400 animate-pulse whitespace-nowrap bg-black/50 px-2 py-1 rounded border border-cyan-500/30">
            Click Chest
          </div>
        </Html>
      </Sphere>
      {/* Arms */}
      <Cylinder args={[0.2, 0.15, 2.8, 16]} position={[-1.1, 1.4, 0]} rotation={[0, 0, 0.2]}>
        <meshStandardMaterial {...materialProps} />
      </Cylinder>
      <Cylinder args={[0.2, 0.15, 2.8, 16]} position={[1.1, 1.4, 0]} rotation={[0, 0, -0.2]}>
        <meshStandardMaterial {...materialProps} />
      </Cylinder>
      {/* Legs */}
      <Cylinder args={[0.25, 0.2, 3.2, 16]} position={[-0.4, -1.6, 0]}>
        <meshStandardMaterial {...materialProps} />
      </Cylinder>
      <Cylinder args={[0.25, 0.2, 3.2, 16]} position={[0.4, -1.6, 0]}>
        <meshStandardMaterial {...materialProps} />
      </Cylinder>
    </group>
  );
};

const Lungs = ({ visible }: { visible: boolean }) => {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      // Breathing animation
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
      group.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={group} visible={visible} position={[0, 2, 0]}>
       {/* Left Lung */}
      <Sphere args={[0.6, 32, 32]} position={[-0.6, 0, 0]} scale={[0.8, 1.4, 0.8]}>
         <MeshDistortMaterial 
            color="#ec4899" 
            distort={0.3} 
            speed={2} 
            transparent 
            opacity={0.8} 
            wireframe={false}
            metalness={0.5}
            roughness={0.2}
          />
      </Sphere>
      {/* Right Lung */}
      <Sphere args={[0.6, 32, 32]} position={[0.6, 0, 0]} scale={[0.8, 1.4, 0.8]}>
         <MeshDistortMaterial 
            color="#ec4899" 
            distort={0.35} 
            speed={2.1} 
            transparent 
            opacity={0.8}
            metalness={0.5}
            roughness={0.2}
         />
      </Sphere>
      {/* Trachea */}
      <Cylinder args={[0.15, 0.15, 1, 16]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#fca5a5" transparent opacity={0.7} />
      </Cylinder>
    </group>
  );
};

const Scanner = ({ active, onScanComplete }: { active: boolean, onScanComplete: () => void }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (ref.current && active) {
      // Move scanner down
      ref.current.position.y -= delta * 1.5;
      ref.current.rotation.z += delta * 5;
      
      // Reset logic for loop or complete
      if (ref.current.position.y < 0.5) {
        onScanComplete();
        ref.current.position.y = 3.5; // Reset
      }
    }
  });

  if (!active) return null;

  return (
    <group ref={ref} position={[0, 3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <Torus args={[1.8, 0.1, 16, 100]}>
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
      </Torus>
      <pointLight color="#00f3ff" intensity={5} distance={3} />
    </group>
  );
};

// --- Main Simulation Component ---

export const Simulation3D = () => {
  const [stage, setStage] = useState<'BODY' | 'LUNGS' | 'SCANNING' | 'RESULT'>('BODY');
  const [scanProgress, setScanProgress] = useState(0);

  const handleBodyClick = () => {
    if (stage === 'BODY') setStage('LUNGS');
  };

  const startScan = () => {
    setStage('SCANNING');
  };

  const handleScanPass = () => {
      // When scanner passes lungs
      setScanProgress((prev) => prev + 1);
  };

  // Reset if scan finished 
  useEffect(() => {
    if (scanProgress > 0 && stage === 'SCANNING') {
        setTimeout(() => {
            setStage('RESULT');
            setScanProgress(0);
        }, 500);
    }
  }, [scanProgress, stage]);


  return (
    <div className="w-full h-full relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3}/>
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

        <Sparkles count={50} scale={10} size={4} speed={0.4} opacity={0.2} color="#00f3ff" />

        {/* Animate Camera position based on stage */}
        <CameraController stage={stage} />

        <HumanBody onClick={handleBodyClick} opacity={stage === 'BODY' ? 0.8 : 0.1} />
        <Lungs visible={stage !== 'BODY'} />
        <Scanner active={stage === 'SCANNING'} onScanComplete={handleScanPass} />
        
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
         <h3 className="text-xl font-bold text-white tracking-widest uppercase border-b-2 border-cyan-500 inline-block pb-1">
             {stage === 'BODY' ? 'Patient Digital Twin' : 'Segmentation Protocol'}
         </h3>
         <p className="text-slate-400 text-sm mt-1">
             {stage === 'BODY' ? 'Click on the patient chest to isolate organ.' : 
              stage === 'LUNGS' ? 'Ready for CarveNet Analysis.' : 
              stage === 'SCANNING' ? 'Acquiring Volumetric Data...' : 'Processing Complete'}
         </p>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        {stage === 'LUNGS' && (
            <button 
                onClick={startScan}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-full shadow-[0_0_15px_rgba(8,145,178,0.7)] transition-all transform hover:scale-105"
            >
                Initiate CT Scan
            </button>
        )}
        {stage === 'RESULT' && (
            <button 
                onClick={() => setStage('BODY')}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-full"
            >
                Reset Simulation
            </button>
        )}
      </div>

      {/* CT Scan Result Overlay */}
      <AnimatePresence>
        {stage === 'RESULT' && (
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-64 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-cyan-500/50"
            >
                <div className="text-cyan-400 text-xs uppercase font-bold mb-2">CarveNet Output</div>
                {/* Simulated CT Image with CSS */}
                <div className="w-full h-48 bg-gray-900 rounded relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/lungs/300/300?grayscale')] opacity-50 bg-cover bg-center mix-blend-luminosity"></div>
                    {/* Overlay Mask */}
                    <div className="absolute inset-0 bg-red-500/20 mix-blend-overlay animate-pulse"></div>
                    <div className="relative z-10 text-center">
                        <div className="text-2xl font-bold text-white">98.2%</div>
                        <div className="text-xs text-gray-400">Dice Coefficient</div>
                    </div>
                    {/* Grid Lines */}
                    <div className="absolute inset-0 border-2 border-cyan-500/30"></div>
                    <div className="absolute top-1/2 w-full h-px bg-cyan-500/30"></div>
                    <div className="absolute left-1/2 h-full w-px bg-cyan-500/30"></div>
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                        <span>Volume:</span>
                        <span className="text-white">4250 cm³</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Lesion Detection:</span>
                        <span className="text-green-400">Confirmed</span>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper to move camera smoothly
function CameraController({ stage }: { stage: string }) {
  useFrame((state) => {
    const targetPos = new THREE.Vector3();
    if (stage === 'BODY') {
        targetPos.set(0, 2, 7);
    } else {
        targetPos.set(0, 2, 3.5); // Zoom in
    }
    state.camera.position.lerp(targetPos, 0.05);
    state.camera.lookAt(0, 2, 0);
  });
  return null;
}
