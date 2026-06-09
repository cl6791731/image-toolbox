import sys

# Read English article content
with open('/tmp/image-toolbox-daily/article-en-content.txt', 'r') as f:
    en_content = f.read().strip()

# Read Chinese article content  
with open('/tmp/image-toolbox-daily/article-zh-content.txt', 'r') as f:
    zh_content = f.read().strip()

# Escape backticks and ${ for template literals
en_content_escaped = en_content.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
zh_content_escaped = zh_content.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

# English article object
en_article = f'''
    {{
      slug: 'core-web-vitals-image-checklist',
      title: 'Core Web Vitals Image Optimization Checklist: LCP, INP & CLS',
      date: '2026-06-09',
      tags: ['web performance', 'core web vitals', 'lcp', 'cls', 'optimization'],
      summary: 'Core Web Vitals are Google ranking factors directly affected by image performance. This checklist covers every image optimization — from LCP preloading and CLS dimension fixes to INP-friendly lazy loading — that measurably improves your scores.',
      content: `
{en_content_escaped}`
    }}'''

# Chinese article object
zh_article = f'''
    {{
      slug: 'core-web-vitals-image-checklist',
      title: 'Core Web Vitals 图片优化完整清单：LCP、INP、CLS 一站式优化指南',
      date: '2026-06-09',
      tags: ['网页性能', 'Core Web Vitals', 'LCP', 'CLS', '优化'],
      summary: 'Core Web Vitals 是 Google 排名因素，图片性能直接影响这三项指标。本文整理了从 LCP 预加载、CLS 尺寸修复到 INP 友好懒加载的完整图片优化清单，每一条都能实实在在提升你的评分。',
      content: `
{zh_content_escaped}`
    }}'''

# Append to English file
with open('/tmp/image-toolbox-daily/src/data/articles-en.js', 'r') as f:
    en_data = f.read()

# Find the last ]; and replace
last_idx = en_data.rfind('];')
en_new = en_data[:last_idx].rstrip() + ',\n' + en_article + '\n  ];\n'
with open('/tmp/image-toolbox-daily/src/data/articles-en.js', 'w') as f:
    f.write(en_new)

# Append to Chinese file
with open('/tmp/image-toolbox-daily/src/data/articles-zh.js', 'r') as f:
    zh_data = f.read()

last_idx = zh_data.rfind('];')
zh_new = zh_data[:last_idx].rstrip() + ',\n' + zh_article + '\n  ];\n'
with open('/tmp/image-toolbox-daily/src/data/articles-zh.js', 'w') as f:
    f.write(zh_new)

print("Done! Both data files updated.")
