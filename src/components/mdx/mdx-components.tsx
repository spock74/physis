import { MDXRemote } from 'next-mdx-remote/rsc'
import React from 'react'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

import LorenzAttractor from '@/components/simulations/LorenzAttractor'
import ChaosPendulum from '@/components/simulations/chaos-pendulum/ChaosPendulum'

const components = {
  LorenzAttractor,
  ChaosPendulum,
  // Add other components here
  h1: (props: any) => <h1 className="text-3xl font-bold font-serif mt-8 mb-4 text-primary" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold font-serif mt-6 mb-3 text-primary" {...props} />,
  // p: (props: any) => <p className="mb-4 leading-relaxed text-lg text-foreground/90" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
  li: (props: any) => <li className="text-lg" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-accent pl-4 italic my-6 text-gray-600 bg-secondary/20 py-2 pr-2 rounded-r" {...props} />
  ),
}

export function CustomMDX({ source }: { source: string }) {
  return (
    <div className="mdx-content">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        }}
      />
    </div>
  )
}
