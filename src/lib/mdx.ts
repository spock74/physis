import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = process.cwd()

export function getPostSlugs(locale: string = 'pt') {
  const essaysPath = path.join(root, `content/essays/${locale}`)
  if (!fs.existsSync(essaysPath)) return []
  return fs.readdirSync(essaysPath)
}

type Items = {
  [key: string]: string
}

export async function getPostBySlug(slug: string, locale: string = 'pt', fields: string[] = []) {
  const realSlug = slug.replace(/\.mdx$/, '')
  const fullPath = path.join(root, `content/essays/${locale}`, `${realSlug}.mdx`)
  
  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  for (const field of fields) {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  }

  return items
}

export async function getAllPosts(locale: string = 'pt', fields: string[] = []) {
  const slugs = getPostSlugs(locale)
  const postsPromises = slugs.map((slug) => getPostBySlug(slug, locale, fields))
  const posts = await Promise.all(postsPromises)
  
  // sort posts by date in descending order
  posts.sort((post1, post2) => (post1!.date > post2!.date ? -1 : 1))
  
  return posts as Record<string, string>[]
}
