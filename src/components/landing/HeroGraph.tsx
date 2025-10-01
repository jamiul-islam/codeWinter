'use client'

import { useCallback } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: {
      label: (
        <div style={{ width: '240px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(110, 231, 249, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#6EE7F9',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  letterSpacing: '-0.01em',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#FFFFFF',
                }}
              >
                User Auth
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'rgba(147, 163, 179, 0.8)',
              lineHeight: '1.6',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                Status
              </span>
              <span
                style={{
                  color: '#34D399',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                Ready
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                Dependencies
              </span>
              <span
                style={{
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                0
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>PRD</span>
              <span
                style={{
                  color: '#34D399',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                Generated
              </span>
            </div>
          </div>
        </div>
      ),
    },
    position: { x: 50, y: 30 },
    style: {
      background: 'rgba(16, 22, 27, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(110, 231, 249, 0.15)',
      borderRadius: '16px',
      padding: '18px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      width: 'auto',
    },
  },
  {
    id: '2',
    type: 'default',
    data: {
      label: (
        <div style={{ width: '240px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(167, 139, 250, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#A78BFA',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  letterSpacing: '-0.01em',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#FFFFFF',
                }}
              >
                Dashboard
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'rgba(147, 163, 179, 0.8)',
              lineHeight: '1.6',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                Status
              </span>
              <span
                style={{
                  color: '#34D399',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                Ready
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                Dependencies
              </span>
              <span
                style={{
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                1
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>PRD</span>
              <span
                style={{
                  color: '#34D399',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                Generated
              </span>
            </div>
          </div>
        </div>
      ),
    },
    position: { x: 340, y: 30 },
    style: {
      background: 'rgba(16, 22, 27, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(167, 139, 250, 0.15)',
      borderRadius: '16px',
      padding: '18px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      width: 'auto',
    },
  },
  {
    id: '3',
    type: 'default',
    data: {
      label: (
        <div style={{ width: '240px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(52, 211, 153, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#34D399',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  letterSpacing: '-0.01em',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#FFFFFF',
                }}
              >
                Project Graph
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'rgba(147, 163, 179, 0.8)',
              lineHeight: '1.6',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                Status
              </span>
              <span
                style={{
                  color: '#F59E0B',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                In Progress
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                Dependencies
              </span>
              <span
                style={{
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                2
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>PRD</span>
              <span
                style={{
                  color: '#6EE7F9',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                Generating
              </span>
            </div>
          </div>
        </div>
      ),
    },
    position: { x: 50, y: 220 },
    style: {
      background: 'rgba(16, 22, 27, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(52, 211, 153, 0.15)',
      borderRadius: '16px',
      padding: '18px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      width: 'auto',
    },
  },
  {
    id: '4',
    type: 'default',
    data: {
      label: (
        <div style={{ width: '240px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(110, 231, 249, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#6EE7F9',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  letterSpacing: '-0.01em',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#FFFFFF',
                }}
              >
                PRD Generator
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'rgba(147, 163, 179, 0.8)',
              lineHeight: '1.6',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                Status
              </span>
              <span
                style={{
                  color: '#34D399',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                Ready
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                Dependencies
              </span>
              <span
                style={{
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                3
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>PRD</span>
              <span
                style={{
                  color: '#34D399',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                Generated
              </span>
            </div>
          </div>
        </div>
      ),
    },
    position: { x: 340, y: 220 },
    style: {
      background: 'rgba(16, 22, 27, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(110, 231, 249, 0.15)',
      borderRadius: '16px',
      padding: '18px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      width: 'auto',
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: 'var(--primary)', strokeWidth: 2 },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    style: { stroke: 'var(--accent)', strokeWidth: 2 },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    style: { stroke: '#34D399', strokeWidth: 2 },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: true,
    style: { stroke: 'var(--primary)', strokeWidth: 2 },
  },
]

export function HeroGraph() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="border-primary/20 bg-surface/50 h-[550px] w-full overflow-hidden rounded-2xl border backdrop-blur">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="var(--primary)"
          gap={16}
          size={1}
          style={{ opacity: 0.15 }}
        />
      </ReactFlow>
    </div>
  )
}
