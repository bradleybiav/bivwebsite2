
import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Move } from 'lucide-react';

const PositionTool = () => {
  const { camera } = useThree();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({
    x: camera.position.x.toFixed(2),
    y: camera.position.y.toFixed(2),
    z: camera.position.z.toFixed(2)
  });

  // Update the displayed position when user interacts with the scene
  const animationRef = useRef<number>();
  
  React.useEffect(() => {
    const updatePosition = () => {
      setPosition({
        x: camera.position.x.toFixed(2),
        y: camera.position.y.toFixed(2),
        z: camera.position.z.toFixed(2)
      });
      animationRef.current = requestAnimationFrame(updatePosition);
    };
    
    animationRef.current = requestAnimationFrame(updatePosition);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [camera]);

  const handleChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      camera.position[axis] = numValue;
      setPosition({ ...position, [axis]: value });
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        padding: isOpen ? '15px' : '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '8px',
        color: 'white',
        zIndex: 100,
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'all 0.3s ease'
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        <Move size={18} /> {isOpen ? 'Hide Controls' : 'Position Tool'}
      </button>
      
      {isOpen && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label>X:</label>
            <input
              type="number"
              value={position.x}
              onChange={(e) => handleChange('x', e.target.value)}
              style={{ width: '80px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid #666', color: 'white', padding: '4px' }}
              step="0.01"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label>Y:</label>
            <input
              type="number"
              value={position.y}
              onChange={(e) => handleChange('y', e.target.value)}
              style={{ width: '80px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid #666', color: 'white', padding: '4px' }}
              step="0.01"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label>Z:</label>
            <input
              type="number"
              value={position.z}
              onChange={(e) => handleChange('z', e.target.value)}
              style={{ width: '80px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid #666', color: 'white', padding: '4px' }}
              step="0.01"
            />
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7, textAlign: 'center', marginTop: '5px' }}>
            Click + drag to rotate view
          </div>
        </>
      )}
    </div>
  );
};

export default PositionTool;
