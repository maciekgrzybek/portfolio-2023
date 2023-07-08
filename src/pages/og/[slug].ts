import { ImageResponse } from '@vercel/og';

import type { APIRoute } from 'astro';
import React from 'react';
import { elo } from '../elo';
import { readAll } from 'src/lib/markdoc/read';
import { blog } from 'src/lib/markdoc/frontmatter.schema';

export const config = {
  runtime: 'edge',
};

export const get: APIRoute = async function get({ request, params }) {
  const posts = await readAllPosts();
  const mapSlugToTitle = (slug: string) => {
    const mayebPost = posts.find((post) => post.params.slug === params.slug);

    return mayebPost.props.title;
  };
  try {
    return new ImageResponse(
      elo(mapSlugToTitle(params.slug ?? '') ?? 'siema'),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
};

export async function getStaticPaths() {
  return readAllPosts();
}

const readAllPosts = async () => {
  const posts = await readAll({
    directory: 'blog',
    frontmatterSchema: blog,
  });

  const filteredPosts = posts
    .filter((p) => p.frontmatter.draft !== true)
    .filter(({ frontmatter }) => !frontmatter.external);

  return filteredPosts.map((post) => {
    return {
      params: { slug: post.slug },
      props: { title: post.frontmatter.title },
    };
  });
};
