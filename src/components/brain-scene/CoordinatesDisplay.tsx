
import React from 'react';
import * as THREE from 'three';

interface CoordinatesDisplayProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  cameraPosition: THREE.Vector3;
}

const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = ({ 
  position, 
  rotation, 
  scale,
  cameraPosition 
}) => {
  // Format numbers to 2 decimal places
  const formatNumber = (num: number) => Math.round(num * 100) / 100;
  
  // This is the code to use if you want to set these values as starting position in Brain.tsx
  const codeSnippet = `
// Base values for Brain.tsx:
const basePosition: [number, number, number] = [${formatNumber(position[0])}, ${formatNumber(position[1])}, ${formatNumber(position[2])}];
const baseRotation: [number, number, number] = [${formatNumber(rotation[0])}, ${formatNumber(rotation[1])}, ${formatNumber(rotation[2])}];
const baseScale = ${formatNumber(scale)};

// Camera starting position:
<PerspectiveCamera makeDefault position={[${formatNumber(cameraPosition.x)}, ${formatNumber(cameraPosition.y)}, ${formatNumber(cameraPosition.z)}]} />
`;

  return (
    <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded shadow-md font-mono text-sm z-10">
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <h3 className="font-bold mb-1">Brain Position:</h3>
          <p>X: {formatNumber(position[0])}</p>
          <p>Y: {formatNumber(position[1])} <span className="text-xs text-gray-400">(animated)</span></p>
          <p>Z: {formatNumber(position[2])}</p>
        </div>
        <div>
          <h3 className="font-bold mb-1">Brain Rotation:</h3>
          <p>X: {formatNumber(rotation[0])}</p>
          <p>Y: {formatNumber(rotation[1])} <span className="text-xs text-gray-400">(animated)</span></p>
          <p>Z: {formatNumber(rotation[2])}</p>
          <h3 className="font-bold mt-2">Scale: {formatNumber(scale)} <span className="text-xs text-gray-400">(animated)</span></h3>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-600">
        <h3 className="font-bold mb-1">Camera Position:</h3>
        <div className="grid grid-cols-3 gap-x-4">
          <p>X: {formatNumber(cameraPosition.x)}</p>
          <p>Y: {formatNumber(cameraPosition.y)}</p>
          <p>Z: {formatNumber(cameraPosition.z)}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-600">
        <h3 className="font-bold mb-1">Code to copy:</h3>
        <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto">{codeSnippet}</pre>
      </div>
      
      <p className="text-xs text-gray-400 mt-2">
        Note: Values marked (animated) continuously change. 
        Adjust the camera by zooming and rotating until you like the view, 
        then copy the code above to set these values as your starting position.
      </p>
    </div>
  );
};

export default CoordinatesDisplay;
