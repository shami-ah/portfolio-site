"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { skillNodes, skillEdges, groupColors, type SkillNode } from "@/data/skills-graph";

interface NodeState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  node: SkillNode;
}

export function NeuralMap(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<NodeState[]>([]);
  const animRef = useRef<number>(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: SkillNode } | null>(null);
  const hoveredRef = useRef<string | null>(null);

  // Store CSS dimensions (not DPR-scaled) for physics
  const cssSizeRef = useRef({ w: 600, h: 400 });
  const frameRef = useRef(0);

  const initNodes = useCallback((w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;
    cssSizeRef.current = { w, h };
    nodesRef.current = skillNodes.map((node, i) => {
      const angle = (i / skillNodes.length) * Math.PI * 2;
      const r = 60 + Math.random() * Math.min(w, h) * 0.2;
      return {
        id: node.id,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        radius: 6 + node.level * 3,
        node,
      };
    });
  }, []);

  const simulate = useCallback(() => {
    const nodes = nodesRef.current;
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    frameRef.current++;
    const { w, h } = cssSizeRef.current;
    const dpr = window.devicePixelRatio || 1;
    const cx = w / 2;
    const cy = h / 2;

    // Physics step (all in CSS coordinates)
    for (const n of nodes) {
      // Strong center gravity
      n.vx += (cx - n.x) * 0.002;
      n.vy += (cy - n.y) * 0.002;

      // Gentle orbit — keeps things alive
      const dx = n.x - cx;
      const dy = n.y - cy;
      n.vx += -dy * 0.00004;
      n.vy += dx * 0.00004;

      // Repulsion between nodes
      for (const m of nodes) {
        if (m.id === n.id) continue;
        const ddx = n.x - m.x;
        const ddy = n.y - m.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
        const minDist = n.radius + m.radius + 35;
        if (dist < minDist) {
          const force = (minDist - dist) * 0.015;
          n.vx += (ddx / dist) * force;
          n.vy += (ddy / dist) * force;
        }
      }
    }

    // Edge spring forces
    for (const edge of skillEdges) {
      const a = nodes.find((n) => n.id === edge.from);
      const b = nodes.find((n) => n.id === edge.to);
      if (!a || !b) continue;
      const ddx = b.x - a.x;
      const ddy = b.y - a.y;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
      const target = 80;
      const force = (dist - target) * 0.001;
      a.vx += (ddx / dist) * force;
      a.vy += (ddy / dist) * force;
      b.vx -= (ddx / dist) * force;
      b.vy -= (ddy / dist) * force;
    }

    // Apply velocity + damping
    const padding = 30;
    for (const n of nodes) {
      n.vx *= 0.93;
      n.vy *= 0.93;
      n.x += n.vx;
      n.y += n.vy;
      // Keep in bounds (CSS coords)
      n.x = Math.max(padding, Math.min(w - padding, n.x));
      n.y = Math.max(padding, Math.min(h - padding, n.y));
    }

    // Draw (canvas is DPR-scaled, so reset transform each frame)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const currentHovered = hoveredRef.current;
    const connectedIds = new Set<string>();
    if (currentHovered) {
      for (const e of skillEdges) {
        if (e.from === currentHovered) connectedIds.add(e.to);
        if (e.to === currentHovered) connectedIds.add(e.from);
      }
      connectedIds.add(currentHovered);
    }

    const pulse = Math.sin(frameRef.current * 0.05) * 0.5 + 0.5; // 0-1 pulsing

    // Draw edges
    for (const edge of skillEdges) {
      const a = nodes.find((n) => n.id === edge.from);
      const b = nodes.find((n) => n.id === edge.to);
      if (!a || !b) continue;

      const isHighlighted = currentHovered && connectedIds.has(a.id) && connectedIds.has(b.id);
      const isDirectLink = currentHovered && (edge.from === currentHovered || edge.to === currentHovered);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);

      if (isDirectLink) {
        // Bright animated edge directly from hovered node
        ctx.strokeStyle = `rgba(245, 149, 88, ${0.5 + pulse * 0.3})`;
        ctx.lineWidth = 2.5;
      } else if (isHighlighted) {
        ctx.strokeStyle = "rgba(245, 149, 88, 0.2)";
        ctx.lineWidth = 1.5;
      } else if (currentHovered) {
        ctx.strokeStyle = "rgba(122, 112, 103, 0.03)";
        ctx.lineWidth = 0.5;
      } else {
        // Default: subtle but visible connections
        ctx.strokeStyle = "rgba(122, 112, 103, 0.12)";
        ctx.lineWidth = 0.5;
      }
      ctx.stroke();
    }

    // Draw nodes
    for (const n of nodes) {
      const isHovered = n.id === currentHovered;
      const isConnected = connectedIds.has(n.id);
      const isActive = !currentHovered || isConnected;
      const alpha = isActive ? 1 : 0.1;
      const color = groupColors[n.node.group];

      // Outer glow ring for hovered node
      if (isHovered) {
        const glowRadius = n.radius + 16 + pulse * 6;
        const grad = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, glowRadius);
        grad.addColorStop(0, color + "40");
        grad.addColorStop(1, color + "00");
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Glow for connected nodes
      if (!isHovered && isConnected && currentHovered) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 10, 0, Math.PI * 2);
        ctx.fillStyle = color + "15";
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, isHovered ? n.radius + 2 : n.radius, 0, Math.PI * 2);
      ctx.fillStyle = color + (alpha < 1 ? "1a" : isHovered ? "ff" : "cc");
      ctx.fill();
      ctx.strokeStyle = color + (alpha < 1 ? "10" : isHovered ? "ff" : "66");
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();

      // Label
      const fontSize = isHovered ? 12 : 10;
      ctx.font = `${isHovered ? 700 : alpha < 1 ? 300 : 500} ${fontSize}px system-ui, sans-serif`;
      ctx.fillStyle = isHovered
        ? "rgba(245, 149, 88, 1)"
        : `rgba(226, 232, 225, ${alpha * 0.8})`;
      ctx.textAlign = "center";
      ctx.fillText(n.node.label, n.x, n.y + n.radius + (isHovered ? 18 : 14));
    }

    animRef.current = requestAnimationFrame(simulate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = (): void => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      initNodes(rect.width, rect.height);
    };

    resize();
    animRef.current = requestAnimationFrame(simulate);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [initNodes, simulate]);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // Mouse coords in CSS space (matching physics coords)
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found: NodeState | null = null;
    for (const n of nodesRef.current) {
      const dx = x - n.x;
      const dy = y - n.y;
      if (Math.sqrt(dx * dx + dy * dy) < n.radius + 8) {
        found = n;
        break;
      }
    }

    const newId = found?.id ?? null;
    hoveredRef.current = newId;
    setHovered(newId);
    setTooltip(found ? { x: e.clientX - rect.left, y: e.clientY - rect.top, node: found.node } : null);
  };

  const onMouseLeave = (): void => {
    hoveredRef.current = null;
    setHovered(null);
    setTooltip(null);
  };

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <canvas
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={`w-full h-full ${hovered ? "cursor-pointer" : ""}`}
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none px-2.5 py-1.5 rounded-md bg-card/95 backdrop-blur-md border border-card-border text-small font-mono shadow-lg z-10"
          style={{ left: tooltip.x + 12, top: tooltip.y - 30 }}
        >
          <span style={{ color: groupColors[tooltip.node.group] }}>{tooltip.node.label}</span>
          <span className="text-muted/50 ml-2">{tooltip.node.group} · L{tooltip.node.level}</span>
        </div>
      )}
    </div>
  );
}
