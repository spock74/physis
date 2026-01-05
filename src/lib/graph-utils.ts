import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = process.cwd()

export type GraphNode = {
  id: string
  position: { x: number; y: number }
  data: { label: string; slug: string }
  type?: string
}

export type GraphEdge = {
  id: string
  source: string
  target: string
  type?: string
  animated?: boolean
}

export function getGraphData(locale: string = 'pt') {
  const essaysPath = path.join(root, `content/essays/${locale}`)
  
  if (!fs.existsSync(essaysPath)) {
    return { nodes: [], edges: [] }
  }

  const files = fs.readdirSync(essaysPath)
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  // 1. Generate Nodes
  files.forEach((file) => {
    if (!file.endsWith('.mdx')) return

    const filePath = path.join(essaysPath, file)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContent)
    const slug = file.replace(/\.mdx$/, '')

    nodes.push({
      id: slug,
      position: { x: 0, y: 0 }, // Initial position, will be set by Dagre
      data: { label: data.title || slug, slug },
      type: 'custom' // Use our custom node type
    })
  })

  // 2. Generate Edges
  files.forEach((file) => {
    if (!file.endsWith('.mdx')) return

    const filePath = path.join(essaysPath, file)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContent)
    const sourceSlug = file.replace(/\.mdx$/, '')

    if (data.connections && Array.isArray(data.connections)) {
      data.connections.forEach((targetSlug: string) => {
        // Only create edge if target exists (or maybe we want to show "ghost" nodes?)
        // For now, let's create the edge. If target doesn't exist, React Flow might warn or we can filter.
        // Let's check if target exists in our nodes list to be safe.
        const targetExists = nodes.some(n => n.id === targetSlug)
        
        // If target doesn't exist, maybe we create a "Ghost" node?
        // The user prompt says: "Se o Ensaio A lista 'caos', e existe um Ensaio B com slug 'caos', crie uma aresta entre eles."
        // So strict check.
        
        if (targetExists) {
          edges.push({
            id: `${sourceSlug}-${targetSlug}`,
            source: sourceSlug,
            target: targetSlug,
            type: 'custom', // Use our custom edge type
            animated: true
          })
        }
      })
    }
  })

  return { nodes, edges }
}
