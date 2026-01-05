import { getPostBySlug, getAllPosts } from '@/lib/mdx'
import { CustomMDX } from '@/components/mdx/mdx-components'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export async function generateStaticParams() {
  const locales = ['en', 'pt']
  const params: { locale: string; slug: string }[] = []

  for (const locale of locales) {
    const posts = await getAllPosts(locale, ['slug'])
    for (const post of posts) {
      params.push({ locale, slug: post.slug as string })
    }
  }

  return params
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug, locale, ['title', 'description'])
  if (!post) return {}
  return {
    title: post.title as string,
    description: post.description as string,
  }
}

export default async function EssayPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug, locale, ['title', 'date', 'content'])

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto py-12 px-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-primary leading-tight">
          {post.title as string}
        </h1>
        <time className="text-sm text-gray-500 font-sans uppercase tracking-widest">
          {post.date as string}
        </time>
      </header>
      <section className="prose prose-lg prose-stone mx-auto">
        <CustomMDX source={post.content as string} />
      </section>
    </article>
  )
}
