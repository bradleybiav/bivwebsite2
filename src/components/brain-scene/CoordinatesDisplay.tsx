
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
  
  // This is the code to copy into Brain.tsx to set your ideal starting position
  const brainPositionCode = `
// In Brain.tsx:
// Replace these values with your desired starting position
const basePosition: [number, number, number] = [${formatNumber(position[0])}, ${formatNumber(position[1])}, ${formatNumber(position[2])}];
const baseRotation: [number, number, number] = [${formatNumber(rotation[0])}, ${formatNumber(rotation[1])}, ${formatNumber(rotation[2])}];
const baseScale = ${formatNumber(scale)};
`;

  // This is the code to copy into BrainScene.tsx for the camera position
  const cameraPositionCode = `
// In BrainScene.tsx:
// Replace the PerspectiveCamera line with:
<PerspectiveCamera makeDefault position={[${formatNumber(cameraPosition.x)}, ${formatNumber(cameraPosition.y)}, ${formatNumber(cameraPosition.z)}]} />
`;

  return (
    <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded shadow-md font-mono text-sm z-10 max-w-md overflow-auto">
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
        <h3 className="font-bold mb-1">Step 1: Brain Position Code</h3>
        <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto">{brainPositionCode}</pre>
      </div>

      <div className="mt-3">
        <h3 className="font-bold mb-1">Step 2: Camera Position Code</h3>
        <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto">{cameraPositionCode}</pre>
      </div>
      
      <p className="text-xs text-gray-400 mt-3 border-t border-gray-600 pt-2">
        <strong>How to use:</strong> Drag/zoom to position the brain exactly as you want.
        When satisfied, copy both code blocks and update the respective files. 
        Tell me when you've got your desired values!
      </p>
    </div>
  );
};

export default CoordinatesDisplay;
