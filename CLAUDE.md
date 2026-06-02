@AGENTS.md

# Não usar travessão (`—`) em texto

Evite o caractere `—` (em dash, U+2014) em qualquer texto deste repositório: conteúdo do CV, posts do blog, descrições, comentários de código, JSX visível, geração de markdown, tudo. Travessão é um forte indício de texto gerado por IA e não combina com a voz do projeto, que é escrito por humano.

Substituições preferidas, por contexto:

- **Aposto / explicação curta no meio da frase**: vírgula `,`. Ex.: `escala, incluindo um servidor multiplayer`.
- **Definição / lista após um conceito**: dois-pontos `:`. Ex.: `Logs, métricas, tracing: os três pilares`.
- **Quebra forte entre ideias**: ponto final `.` e nova frase. Ex.: `É cultura. Não é só ferramenta.`.
- **Faixa de datas/números**: hífen com espaços ` - `. Ex.: `Out/2025 - Atual`, `2016 - 2022`, `18 - 65`.
- **Separador entre rótulo e detalhe** (título · subtítulo, papel · empresa, idioma · nível): bullet médio ` · ` (U+00B7). Já é a convenção do repo (veja `Dark.tsx`, `Notion.tsx`).
- **Marcador de bullet visual** em listas estilizadas: `•` ou `·`, nunca `—`.
- **Placeholder de "sem valor"** em tabelas/células: hífen simples `-`.

Não troque por `–` (en dash, U+2013) nem por uma versão com mais espaços, isso continua parecendo "limpeza automática". Reescreva pra ficar natural.

Ao escrever ou editar texto novo aqui, não introduza `—`. Se encontrar algum sobrando, corrija no mesmo PR.

# Commands

All Node/Next commands (lint, build, test, install, etc.) MUST run inside the Docker Compose `web` service, never on the host. The dev server runs in `docker compose up` and exposes port 3003.

Use:

- `docker compose exec web npx next lint`
- `docker compose exec web npm run build`
- `docker compose exec web npm install <pkg>`

If the stack is not running: `docker compose up -d` first.

Rationale: `node_modules` and `.next` are Docker-managed volumes; running on the host creates conflicting installs and permission errors.

# Print → PDF page size trick

The "Download PDF" button calls `window.print()`. The `@page` rule in `app/globals.css` is intentionally set to **US Legal (216×356mm) with 6mm vertical / 12mm horizontal margins** instead of A4. This is a deliberate trick, not an oversight.

Why: HR typically prefers résumés ≤ 2 pages. Legal is ~20% taller than A4, and the tight vertical margin claws back another ~5% of usable area. Combined, content that would spill onto a 3rd A4 page fits within 2 Legal pages. Most recruiters check page count, not paper dimensions.

Horizontal margin is 12mm (not tighter): tested with 8mm and the content read as glued to the page edges, looking unprofessional. The vertical-only tightness still nets enough extra room to keep the 2-page goal.

If you change the `@page` rule, preserve this behavior unless explicitly told otherwise. Do not "normalize" it back to A4. The comment above the rule in `globals.css` calls this out, so keep it.

Caveats to be aware of:
- Chrome/Edge/Safari respect `@page size` in "Save as PDF". Firefox sometimes ignores it.
- Users can override paper size in the print dialog before saving, which defeats the trick.
- Some ATS pipelines may flag non-A4 dimensions; the trick prioritizes the human reader over automated parsers.
