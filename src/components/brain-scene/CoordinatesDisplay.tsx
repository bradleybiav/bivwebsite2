
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
      
      <p className="text-xs text-gray-400 mt-2">
        Note: Values marked (animated) continuously change due to animation.
        Camera position updates when you zoom or rotate the view.
      </p>
    </div>
  );
};

export default CoordinatesDisplay;
