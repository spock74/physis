'use client'

import React, { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from 'dagre'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

// --- Custom Node ---
const CustomNode = ({ data }: { data: { label: string; slug: string } }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-[#FDFBF7] border border-gray-900 min-w-[150px] text-center transition-all hover:shadow-lg hover:scale-105 cursor-pointer group">
      <Handle type="target" position={Position.Top} className="!bg-gray-900 !w-1 !h-1" />
      <div className="font-serif font-bold text-gray-900 text-sm group-hover:text-accent transition-colors">
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-900 !w-1 !h-1" />
    </div>
  )
}

// --- Custom Edge ---
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  })

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 1.5,
          stroke: '#475569', // slate-600
        }}
        className="react-flow__edge-path transition-all duration-500 hover:stroke-accent hover:stroke-[2px] hover:filter hover:drop-shadow-[0_0_4px_rgba(192,57,43,0.5)]"
      />
    </>
  )
}

// --- Layout Logic ---
const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 180
const nodeHeight = 60

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    }
  })

  return { nodes: newNodes, edges }
}

// --- Main Component ---
function KnowledgeGraphContent({ initialNodes, initialEdges, locale }: { initialNodes: any[], initialEdges: any[], locale: string }) {
  const router = useRouter()
  const { fitView } = useReactFlow()
  
  const layouted = useMemo(() => getLayoutedElements(initialNodes, initialEdges), [initialNodes, initialEdges])
  
  const [nodes, setNodes, onNodesChange] = useNodesState(layouted.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layouted.edges)

  const onNodeClick = useCallback((event: any, node: any) => {
    router.push(`/${locale}/essays/${node.data.slug}`)
  }, [router, locale])

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), [])
  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), [])

  return (
    <div className="w-full h-[600px] border border-secondary rounded-lg bg-secondary/5 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-right"
        minZoom={0.5}
        maxZoom={2}
      >
        {/* <Background color="#E0DCD3" gap={20} size={1} /> */}
      </ReactFlow>
    </div>
  )
}

export default function KnowledgeGraph(props: any) {
  return (
    <ReactFlowProvider>
      <KnowledgeGraphContent {...props} />
    </ReactFlowProvider>
  )
}
