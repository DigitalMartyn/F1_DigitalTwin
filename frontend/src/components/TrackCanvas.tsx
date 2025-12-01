import { useEffect, useRef } from 'react';
import { TrackData, Frame } from '../types';
import './TrackCanvas.css';

interface TrackCanvasProps {
  trackData: TrackData;
  frame: Frame;
  driverColors: Record<string, string>;
  circuitRotation: number;
  selectedDriver: string | null;
}

function TrackCanvas({ trackData, frame, driverColors, circuitRotation, selectedDriver }: TrackCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate track bounds
    const xCoords = trackData.x;
    const yCoords = trackData.y;
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    const trackWidth = maxX - minX;
    const trackHeight = maxY - minY;
    const padding = 50;
    const scale = Math.min(
      (canvas.width - padding * 2) / trackWidth,
      (canvas.height - padding * 2) / trackHeight
    );

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const trackCenterX = (minX + maxX) / 2;
    const trackCenterY = (minY + maxY) / 2;

    // Transform function
    const transform = (x: number, y: number): [number, number] => {
      const translatedX = x - trackCenterX;
      const translatedY = y - trackCenterY;
      
      // Apply rotation
      const rad = (circuitRotation * Math.PI) / 180;
      const rotatedX = translatedX * Math.cos(rad) - translatedY * Math.sin(rad);
      const rotatedY = translatedX * Math.sin(rad) + translatedY * Math.cos(rad);
      
      return [
        centerX + rotatedX * scale,
        centerY + rotatedY * scale
      ];
    };

    // Draw track outline
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    for (let i = 0; i < xCoords.length; i++) {
      const [x, y] = transform(xCoords[i], yCoords[i]);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw start/finish line
    const [startX, startY] = transform(xCoords[0], yCoords[0]);
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.moveTo(startX - 10, startY - 10);
    ctx.lineTo(startX + 10, startY + 10);
    ctx.stroke();

    // Draw drivers
    Object.entries(frame.positions).forEach(([driver, pos]) => {
      if (pos.x === null || pos.y === null) return;
      
      const [x, y] = transform(pos.x, pos.y);
      const color = driverColors[driver] || '#ffffff';
      const isSelected = driver === selectedDriver;
      
      // Draw driver circle
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x, y, isSelected ? 10 : 7, 0, 2 * Math.PI);
      ctx.fill();
      
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw driver abbreviation
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(driver, x, y);
    });

  }, [trackData, frame, driverColors, circuitRotation, selectedDriver]);

  return <canvas ref={canvasRef} className="track-canvas" />;
}

export default TrackCanvas;
