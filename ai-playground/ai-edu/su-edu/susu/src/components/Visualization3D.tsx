"use client";

import { Topic, VisualizationControl } from "@/types";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Box, Line, Text, Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

interface Visualization3DProps {
  type: string;
  parameters: Record<string, number | boolean>;
  controls?: VisualizationControl[];
  subject: string;
}

function NewtonSecondLawScene({ parameters }: { parameters: Record<string, number | boolean> }) {
  const boxRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.BufferAttribute>(null);
  const [position, setPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const trailPositions = useRef<number[]>([]);

  const mass = (parameters.mass as number) || 2;
  const force = (parameters.force as number) || 10;
  const friction = (parameters.friction as number) || 0;

  useFrame((state, delta) => {
    if (boxRef.current) {
      const acceleration = (force - friction * mass * 9.8 * Math.sign(velocity)) / mass;
      const newVelocity = velocity + acceleration * delta;
      const newPosition = position + newVelocity * delta;

      // Boundary check
      if (newPosition > 8 || newPosition < -8) {
        setVelocity(-newVelocity * 0.8);
      } else {
        setVelocity(newVelocity);
        setPosition(newPosition);
      }

      boxRef.current.position.x = position;

      // Update trail
      trailPositions.current.push(position, 0.5, 0);
      if (trailPositions.current.length > 300) {
        trailPositions.current = trailPositions.current.slice(-300);
      }

      if (trailRef.current) {
        trailRef.current.array = new Float32Array(trailPositions.current);
        trailRef.current.needsUpdate = true;
      }
    }
  });

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Grid */}
      <gridHelper args={[20, 20, "#14b8a6", "#1e3a5f"]} />

      {/* Box (mass) */}
      <Box ref={boxRef} args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#14b8a6" metalness={0.3} roughness={0.4} />
      </Box>

      {/* Force arrow */}
      {force > 0 && (
        <group position={[position - 1.5, 0, 0]}>
          <Line
            points={[[-force / 10, 0, 0], [0, 0, 0]]}
            color="#ef4444"
            lineWidth={3}
          />
          <coneGeometry args={[0.2, 0.5, 8]} />
        </group>
      )}

      {/* Velocity arrow */}
      {Math.abs(velocity) > 0.1 && (
        <Line
          points={[
            [position, 1.5, 0],
            [position + velocity * 0.3, 1.5, 0],
          ]}
          color="#3b82f6"
          lineWidth={2}
        />
      )}

      {/* Labels */}
      <Text position={[0, 3, 0]} fontSize={0.5} color="white">
        {`质量: ${mass} kg | 力: ${force} N | 加速度: ${(force / mass).toFixed(2)} m/s²`}
      </Text>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </>
  );
}

function SolarSystemScene({ parameters }: { parameters: Record<string, number | boolean> }) {
  const orbitSpeed = (parameters.orbitSpeed as number) || 1;
  const showOrbits = parameters.showOrbits !== false;
  const showLabels = parameters.showLabels !== false;

  const planets = useMemo(() => [
    { name: "水星", distance: 2, size: 0.1, color: "#a1a1aa", speed: 4.15 },
    { name: "金星", distance: 3, size: 0.15, color: "#fcd34d", speed: 1.62 },
    { name: "地球", distance: 4, size: 0.16, color: "#3b82f6", speed: 1 },
    { name: "火星", distance: 5, size: 0.12, color: "#ef4444", speed: 0.53 },
    { name: "木星", distance: 7, size: 0.4, color: "#f97316", speed: 0.084 },
    { name: "土星", distance: 9, size: 0.35, color: "#eab308", speed: 0.034 },
  ], []);

  return (
    <>
      {/* Sun */}
      <Sphere args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <MeshDistortMaterial color="#fbbf24" attach="material" distort={0.2} speed={2} />
      </Sphere>

      {/* Point light from sun */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#fbbf24" />

      {/* Planets */}
      {planets.map((planet, index) => (
        <Float key={planet.name} speed={planet.speed * orbitSpeed} floatIntensity={0}>
          <group>
            <mesh position={[planet.distance, 0, 0]}>
              <sphereGeometry args={[planet.size, 16, 16]} />
              <meshStandardMaterial color={planet.color} />
            </mesh>
            {showLabels && (
              <Text position={[planet.distance, planet.size + 0.3, 0]} fontSize={0.2} color="white">
                {planet.name}
              </Text>
            )}
          </group>
        </Float>
      ))}

      {/* Orbit lines */}
      {showOrbits && planets.map((planet) => (
        <Line
          key={`orbit-${planet.name}`}
          points={Array.from({ length: 64 }, (_, i) => {
            const angle = (i / 64) * Math.PI * 2;
            return [Math.cos(angle) * planet.distance, 0, Math.sin(angle) * planet.distance];
          })}
          color="#14b8a6"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}

      {/* Ambient */}
      <ambientLight intensity={0.3} />
    </>
  );
}

function PhotosynthesisScene({ parameters }: { parameters: Record<string, number | boolean> }) {
  const lightIntensity = (parameters.lightIntensity as number) || 50;
  const [particles, setParticles] = useState<{ x: number; y: number; z: number; type: "co2" | "o2" | "h2o" }[]>([]);

  useFrame(() => {
    // Animate particles
  });

  return (
    <>
      {/* Chloroplast representation */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[2, 4, 16, 32]} />
        <meshStandardMaterial color="#22c55e" transparent opacity={0.7} />
      </mesh>

      {/* Thylakoid stacks */}
      {[...Array(5)].map((_, i) => (
        <group key={i} position={[(i - 2) * 0.8, 0, 0]}>
          {[...Array(3)].map((_, j) => (
            <mesh key={j} position={[0, j * 0.3 - 0.3, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
              <meshStandardMaterial color="#16a34a" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Light rays */}
      <group position={[0, 4, 0]}>
        {[...Array(5)].map((_, i) => (
          <Line
            key={i}
            points={[
              [(i - 2) * 0.5, 2, 0],
              [(i - 2) * 0.5, -2, 0],
            ]}
            color="#fbbf24"
            lineWidth={2}
            transparent
            opacity={lightIntensity / 100}
          />
        ))}
      </group>

      <Text position={[0, -3, 0]} fontSize={0.4} color="white">
        {`光照强度: ${lightIntensity}%`}
      </Text>

      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 5, 5]} intensity={lightIntensity / 50} color="#fbbf24" />
    </>
  );
}

function DefaultScene({ subject }: { subject: string }) {
  const colors: Record<string, string> = {
    physics: "#3b82f6",
    chemistry: "#f97316",
    biology: "#22c55e",
    math: "#eab308",
    astronomy: "#6366f1",
    programming: "#14b8a6",
    general: "#64748b",
  };

  return (
    <>
      <Float speed={2} rotationIntensity={1}>
        <Sphere args={[1, 32, 32]}>
          <MeshDistortMaterial color={colors[subject] || colors.general} distort={0.3} speed={1.5} />
        </Sphere>
      </Float>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </>
  );
}

function Scene({ type, parameters, subject }: Visualization3DProps) {
  switch (type) {
    case "newton-second-law":
    case "physics-motion":
      return <NewtonSecondLawScene parameters={parameters} />;
    case "solar-system":
      return <SolarSystemScene parameters={parameters} />;
    case "photosynthesis":
      return <PhotosynthesisScene parameters={parameters} />;
    default:
      return <DefaultScene subject={subject} />;
  }
}

export function Visualization3D(props: Visualization3DProps) {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      <color attach="background" args={["#0f172a"]} />
      <OrbitControls enablePan enableZoom enableRotate />
      <Scene {...props} />
    </Canvas>
  );
}