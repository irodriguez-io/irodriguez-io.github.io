# irodriguez.io

Personal website of **Isidro Rodriguez** — Identity & Access Management engineer writing about secure automation, IAM, and small-business security.

Live at: [irodriguez.io](https://irodriguez.io)

## Stack

- **Hosting:** GitHub Pages (custom domain via `CNAME`)
- **Generator:** Jekyll (native GitHub Pages support, no GitHub Actions required)
- **Languages:** Bilingual — English / Spanish
- **Styling:** Hand-rolled CSS (`css/main.css`, `css/article.css`)

## Structure

```
.
├── index.html          # English homepage
├── spanish.html        # Spanish homepage
├── _config.yml         # Jekyll configuration
├── _layouts/           # Jekyll layouts (default, post, post-sp)
├── _posts/             # English blog posts (Markdown)
├── _posts-sp/          # Spanish blog posts (Jekyll collection)
├── blog/               # Generated blog index pages
├── css/                # Stylesheets and fonts
├── img/                # Images and SVG assets
├── js/                 # Vanilla JS (typewriter, nav, carousel)
└── CNAME               # GitHub Pages custom domain
```

## Writing a new post

**English** — create `_posts/YYYY-MM-DD-slug.md` with front matter:

```yaml
---
layout: post
title: "Your title here"
date: 2026-05-14
lang: en
image: /img/post-hero.png
description: One-sentence summary used for SEO and previews.
---

Your Markdown content here.
```

**Spanish** — same shape, in `_posts-sp/` and set `lang: es`.

## Local preview

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open `http://localhost:4000`.

## License

[MIT](LICENSE)
