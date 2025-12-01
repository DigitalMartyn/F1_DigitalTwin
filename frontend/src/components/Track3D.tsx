import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line } from '@react-three/drei';
import * as THREE from 'three';
import { TrackData, Frame } from '../types';
import './Track3D.css';

interface Track3DProps {
  trackData: TrackData;
  frame: Frame;
  driverColors: Record<string, string>;
  circuitRotation: number;
  selectedDriver: string | null;
  onSelectDriver: (driver: string | null) => void;
}

function DriverCar({ position, color, isSelected, label }: { 
  position: [number, number, number]; 
  color: string; 
  isSelected: boolean;
  label: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={isSelected ? [8, 4, 12] : [6, 3, 10]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {isSelected && (
        <pointLight position={[0, 10, 0]} intensity={50} color={color} />
      )}
    </group>
  );
}

function TrackLine({ points }: { points: THREE.Vector3[] }) {
  return (
    <Line
      points={points}
      color="#444444"
      lineWidth={3}
    />
  );
}

function Track3DScene({ trackData, frame, driverColors, circuitRotation, selectedDriver, onSelectDriver }: Track3DProps) {
  // Process track data
  const trackPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const scale = 0.1; // Scale down the track
    
    for (let i = 0; i < trackData.x.length; i += 5) { // Sample every 5th point for performance
      points.push(new THREE.Vector3(
        trackData.x[i] * scale,
        0,
        -trackData.y[i] * scale // Negative Y to flip coordinate system
      ));
    }
    
    return points;
  }, [trackData]);

  // Process driver positions
  const driverPositions = useMemo(() => {
    const positions: Array<{
      driver: string;
      position: [number, number, number];
      color: string;
      isSelected: boolean;
    }> = [];
    
    const scale = 0.1;
    
    Object.entries(frame.positions).forEach(([driver, pos]) => {
      if (pos.x !== null && pos.y !== null) {
        positions.push({
          driver,
          position: [
            pos.x * scale,
            2, // Height above track
            -pos.y * scale
          ],
          color: driverColors[driver] || '#ffffff',
          isSelected: driver === selectedDriver
        });
      }
    });
    
    return positions;
  }, [frame, driverColors, selectedDriver]);

  // Center the camera on the track
  const trackCenter = useMemo(() => {
    if (trackPoints.length === 0) return [0, 0, 0];
    
    const sumX = trackPoints.reduce((sum, p) => sum + p.x, 0);
    const sumZ = trackPoints.reduce((sum, p) => sum + p.z, 0);
    
    return [
      sumX / trackPoints.length,
      0,
      sumZ / trackPoints.length
    ];
  }, [trackPoints]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 200, 300]} />
      <OrbitControls 
        target={trackCenter as [number, number, number]}
        enableDamping
        dampingFactor={0.05}
        minDistance={100}
        maxDistance={800}
        maxPolarAngle={Math.PI / 2.1}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[100, 100, 50]} intensity={1} castShadow />
      <hemisphereLight args={['#87CEEB', '#454545', 0.6]} />
      
      {/* Track surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[trackCenter[0], -1, trackCenter[2]]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </mesh>
      
      {/* Track line */}
      <TrackLine points={trackPoints} />
      
      {/* Start/Finish line */}
      {trackPoints.length > 0 && (
        <mesh position={[trackPoints[0].x, 0.1, trackPoints[0].z]}>
          <boxGeometry args={[15, 0.2, 3]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      )}
      
      {/* Driver cars */}
      {driverPositions.map(({ driver, position, color, isSelected }) => (
        <DriverCar
          key={driver}
          position={position}
          color={color}
          isSelected={isSelected}
          label={driver}
        />
      ))}
      
      {/* Grid helper */}
      <gridHelper args={[1000, 50, '#222222', '#111111']} position={[0, -1, 0]} />
    </>
  );
}

function Track3D(props: Track3DProps) {
  return (
    <div className="track-3d-container">
      <Canvas shadows>
        <Track3DScene {...props} />
      </Canvas>
      <div className="track-3d-controls">
        <div className="control-hint">🖱️ Left Click + Drag to Rotate</div>
        <div className="control-hint">🖱️ Right Click + Drag to Pan</div>
        <div className="control-hint">🖱️ Scroll to Zoom</div>
      </div>
    </div>
  );
}

export default Track3D;
