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

const ConnectingLines: React.FC<
  SceneElementProps & { data: number[][]; size: number; heightScale: number }
> = ({ data, size, heightScale, position = [0, 0, 0], scale = 1 }) => {
  const lines = useMemo(() => {
    const linesArray = [];
    const validValues = data
      .flat()
      .filter((val) => val !== undefined && val !== null && val !== 0);
    const maxValue = Math.max(...validValues);
    const minValue = Math.min(...validValues);
    const range = maxValue - minValue || 1;

    // Helper function to get normalized position
    const getPosition = (x: number, y: number) => {
      const value = data[y][x];
      if (value !== undefined && value !== null && value !== 0) {
        const normalizedValue = ((value - minValue) / range) * heightScale;
        return new THREE.Vector3(
          x / (size - 1) - 0.5,
          normalizedValue,
          y / (size - 1) - 0.5
        );
      }
      return null;
    };

    // Connect points horizontally
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size - 1; x++) {
        const pos1 = getPosition(x, y);
        const pos2 = getPosition(x + 1, y);
        if (pos1 && pos2) {
          linesArray.push(pos1, pos2);
        }
      }
    }

    // Connect points vertically
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size - 1; y++) {
        const pos1 = getPosition(x, y);
        const pos2 = getPosition(x, y + 1);
        if (pos1 && pos2) {
          linesArray.push(pos1, pos2);
        }
      }
    }

    return linesArray;
  }, [data, size, heightScale]);

  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(lines),
    [lines]
  );

  return (
    <lineSegments geometry={geometry} position={position} scale={scale}>
      <lineBasicMaterial color="#4caf50" opacity={0.3} transparent />
    </lineSegments>
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
  const [heightScale, setHeightScale] = useState(0.5);

  const sceneConfig = useMemo(
    () => ({
      cameraPosition: [-1, 0.0421053 * (size - 24) + 1, -1] as [
        number,
        number,
        number
      ],
      axesHelperScale: 0.042 * (size - 24) + 1,
      axesHelperPosition: [-0.5, 0, -0.5] as [number, number, number],
      surfaceScale: 0.0416 * (size - 25) + 1,
      dataPointsScale: 0.0416 * (size - 25) + 1,
      cityGridScale: 0.11,
      heightScale2: -0.00266 * (size - 24) + 0.6,
      cityGridPosition: [0.0205 * (size - 24), 0, 2.3245] as [
        number,
        number,
        number
      ],
      cityGridRotation: [-Math.PI / 2, 0, 0] as [number, number, number],
      dataPointsPosition: [0.0208 * (size - 24), 0, 0.0208 * (size - 24)] as [
        number,
        number,
        number
      ],
      surfacePosition: [0.0208 * (size - 24), 0, 0.0208 * (size - 24)] as [
        number,
        number,
        number
      ],
    }),
    [size]
  );

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
        <ConnectingLines
          data={data}
          size={size}
          scale={sceneConfig.surfaceScale}
          heightScale={heightScale}
          position={sceneConfig.surfacePosition}
        />
        <DataPoints
          data={data}
          size={size}
          scale={sceneConfig.dataPointsScale}
          heightScale={heightScale}
          position={sceneConfig.dataPointsPosition}
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
              size={size}
            />
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

export default HeightFunction;
