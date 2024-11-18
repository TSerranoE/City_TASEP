import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { CityGrid } from "../CityGrid";
import type { CityGridProps } from "./types";

interface HeightFunctionProps extends CityGridProps {
  data: number[][];
  size: number;
}

const Surface: React.FC<{ data: number[][]; size: number }> = ({
  data,
  size,
}) => {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        vertices.push(x / (size - 1), data[y][x], y / (size - 1));
      }
    }

    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
        const a = x + y * size;
        const b = x + 1 + y * size;
        const c = x + (y + 1) * size;
        const d = x + 1 + (y + 1) * size;

        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }

    geo.setIndex(indices);
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.computeVertexNormals();

    return geo;
  }, [data, size]);

  return (
    <mesh geometry={geometry} scale={[2, 2, 2]} position={[-1, 0, -1]}>
      <meshStandardMaterial
        color="royalblue"
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  );
};

const AxesHelper: React.FC = () => {
  const { scene } = useThree();

  useEffect(() => {
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    return () => {
      scene.remove(axesHelper);
    };
  }, [scene]);

  return null;
};

const CameraController: React.FC = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>();

  useEffect(() => {
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    if (controlsRef.current) {
      const radius = Math.sqrt(27);
      const elevation = Math.PI / 4;
      const azimuth = controlsRef.current.getAzimuthalAngle();

      camera.position.setFromSphericalCoords(radius, elevation, azimuth);
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableRotate={true}
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 4}
    />
  );
};

const HeightFunction: React.FC<HeightFunctionProps> = ({
  data,
  size,
  clickedLines,
  onClickedLinesUpdate,
  isStart,
  isClear,
  setIsClear,
  simulationMode,
}) => {
  return (
    <div style={{ width: "100%", height: "800px" }}>
      <Canvas>
        <CameraController />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Surface data={data} size={size} />
        <AxesHelper />
        <Html
          transform
          position={[0, 0, -2]}
          scale={0.1}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <div style={{ width: "2048px", height: "2048px" }}>
            <CityGrid
              clickedLines={clickedLines}
              onClickedLinesUpdate={onClickedLinesUpdate}
              isStart={isStart}
              isClear={isClear}
              setIsClear={setIsClear}
              simulationMode={simulationMode}
            />
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

export default HeightFunction;
