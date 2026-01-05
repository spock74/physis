import { getGraphData } from '@/lib/graph-utils'
import KnowledgeGraph from '@/components/KnowledgeGraph'

export default async function AtlasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <AtlasContent locale={locale} />
}

async function AtlasContent({ locale }: { locale: string }) {
  const { nodes, edges } = getGraphData(locale)

  return (
    <main className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-primary">
          Physis Graph
        </h1>
        <p className="text-lg md:text-xl text-gray-600 italic font-serif">
          The Neural Network of Ideas.
        </p>
      </header>

      <KnowledgeGraph initialNodes={nodes} initialEdges={edges} locale={locale} />
    </main>
  )
}
