import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { CityGrid } from "../CityGrid";
import type { CityGridProps } from "./types";
import styles from "./styles.module.css";

interface HeightFunctionProps extends CityGridProps {
  data: number[][];
  size: number;
}

interface SceneElementProps {
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
}

const DataPoints: React.FC<
  SceneElementProps & { data: number[][]; size: number; heightScale: number }
> = ({ data, size, heightScale, position = [0, 0, 0], scale = 1 }) => {
  const points = useMemo(() => {
    const pointsArray = [];
    const validValues = data
      .flat()
      .filter((val) => val !== undefined && val !== null && val !== 0);
    const maxValue = Math.max(...validValues);
    const minValue = Math.min(...validValues);
    const range = maxValue - minValue || 1;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const value = data[y][x];
        if (value !== undefined && value !== null && value !== 0) {
          const normalizedValue = ((value - minValue) / range) * heightScale;
          pointsArray.push(
            new THREE.Vector3(
              x / (size - 1) - 0.5,
              normalizedValue,
              y / (size - 1) - 0.5
            )
          );
        }
      }
    }
    return pointsArray;
  }, [data, size, heightScale]);

  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points]
  );

  return (
    <points geometry={geometry} position={position} scale={scale}>
      <pointsMaterial color="#4caf50" size={0.025} sizeAttenuation={true} />
    </points>
  );
};

const Surface: React.FC<
  SceneElementProps & { data: number[][]; size: number; heightScale: number }
> = ({ data, size, heightScale, position = [0, 0, 0], scale = 1 }) => {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const validValues = data
      .flat()
      .filter((val) => val !== undefined && val !== null && val !== 0);
    const maxValue = Math.max(...validValues);
    const minValue = Math.min(...validValues);
    const range = maxValue - minValue || 1;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const value = data[y][x];
        const normalizedValue =
          value !== undefined && value !== null && value !== 0
            ? ((value - minValue) / range) * heightScale
            : 0;
        vertices.push(
          x / (size - 1) - 0.5,
          normalizedValue,
          y / (size - 1) - 0.5
        );
      }
    }

    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
        const a = x + y * size;
        const b = x + 1 + y * size;
        const c = x + (y + 1) * size;
        const d = x + 1 + (y + 1) * size;

        if (
          data[y][x] !== 0 ||
          data[y][x + 1] !== 0 ||
          data[y + 1][x] !== 0 ||
          data[y + 1][x + 1] !== 0
        ) {
          indices.push(a, b, d);
          indices.push(a, d, c);
        }
      }
    }

    geo.setIndex(indices);
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.computeVertexNormals();

    return geo;
  }, [data, size, heightScale]);

  return (
    <mesh geometry={geometry} position={position} scale={scale}>
      <meshStandardMaterial
        color="#4caf50"
        side={THREE.DoubleSide}
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

const AxesHelper: React.FC<SceneElementProps> = ({
  scale = 1,
  position = [0, 0, 0],
}) => {
  const { scene } = useThree();

  useEffect(() => {
    const axesHelper = new THREE.AxesHelper(
      typeof scale === "number" ? scale : 1
    );
    axesHelper.position.set(...position);
    scene.add(axesHelper);

    return () => {
      scene.remove(axesHelper);
    };
  }, [scene, scale, position]);

  return null;
};

const CameraController: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>();

  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(0, 0, 0);
  }, [camera, position]);

  useFrame(() => {
    if (controlsRef.current) {
      const radius = Math.sqrt(
        position[0] ** 2 + position[1] ** 2 + position[2] ** 2
      );
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
  const [heightScale, setHeightScale] = useState(1);

  const sceneConfig = {
    cameraPosition: [1.5, 1.5, 1.5] as [number, number, number],
    axesHelperScale: 1,
    axesHelperPosition: [-0.5, 0, -0.5] as [number, number, number],
    surfaceScale: 1,
    dataPointsScale: 1,
    cityGridScale: 0.11,
    cityGridPosition: [0, 0, -2.3] as [number, number, number],
    cityGridRotation: [Math.PI / 2, 0, 0] as [number, number, number],
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeightScale(parseFloat(event.target.value));
  };

  return (
    <div className={styles.container}>
      <div className={styles.scaleControl}>
        <span className={styles.scaleLabel}>Height Scale:</span>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={heightScale}
          onChange={handleScaleChange}
          className={styles.scaleInput}
        />
        <span className={styles.scaleValue}>{heightScale.toFixed(1)}</span>
      </div>
      <Canvas>
        <CameraController position={sceneConfig.cameraPosition} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <Surface
          data={data}
          size={size}
          scale={sceneConfig.surfaceScale}
          heightScale={heightScale}
        />
        <DataPoints
          data={data}
          size={size}
          scale={sceneConfig.dataPointsScale}
          heightScale={heightScale}
        />
        <AxesHelper
          scale={sceneConfig.axesHelperScale}
          position={sceneConfig.axesHelperPosition}
        />
        <Html
          transform
          position={sceneConfig.cityGridPosition}
          scale={sceneConfig.cityGridScale}
          rotation={sceneConfig.cityGridRotation}
          occlude="blending"
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
