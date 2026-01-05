import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { useTranslations } from 'next-intl';
import NeuralBackground from '@/components/hero/NeuralBackground'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <HomeContent locale={locale} />
}

async function HomeContent({ locale }: { locale: string }) {
  const posts = await getAllPosts(locale, ['slug', 'title', 'date', 'description'])

  return (
    <div className="relative min-h-screen">
      {/* <NeuralBackground /> */}
      <main className="max-w-3xl mx-auto py-12 px-6 relative z-10">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-primary">
          Physis
        </h1>
        <p className="text-lg md:text-xl text-gray-600 italic font-serif">
          Natural Inteligence
        </p>
      </header>

      <div className="flex justify-center mb-12">
        <Link href={`/${locale}/atlas`}>
          <button className="px-6 py-2 border border-primary text-primary font-serif hover:bg-primary hover:text-white transition-colors rounded-full text-sm uppercase tracking-widest">
            Entrar
          </button>
        </Link>
      </div>

      <section className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug as string} className="group cursor-pointer">
            <Link href={`/${locale}/essays/${post.slug as string}`}>
              <div className="border-l-2 border-secondary pl-6 py-2 transition-all duration-300 group-hover:border-accent group-hover:pl-8">
                <h2 className="text-2xl font-bold font-serif text-primary group-hover:text-accent transition-colors">
                  {post.title as string}
                </h2>
                <time className="text-xs text-gray-400 font-sans uppercase tracking-widest mt-1 block">
                  {post.date as string}
                </time>
                <p className="mt-2 text-gray-600 font-serif leading-relaxed">
                  {post.description as string}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </section>
      </main>
    </div>
  )
}
