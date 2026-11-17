# Pedro Sakamoto — Portfolio (PRODUCT.md)

Inferred from his own brief and building sessions; he has asked not to be interviewed, so this is precise product truth from what he ships.

## What this is
The public home of a Brazilian full-stack developer (18, Ribeirão Preto) pitching himself to hiring managers and freelance clients. It is the face of everything else he runs: GitHub `2jjj`, LinkedIn `Pedro Sakamoto`, 99Freelas `user/pedro-sakamoto`, and the StartANewDay automation that feeds this site its live data.

## What it must do
- Convince a recruiter in seconds he ships real, current full-stack work: Java/Spring, React, Node/TS, Postgres, Docker, Linux.
- Show proof-of-work, not promises: live projects, testes automatizados, ATS résumé, availability line (13:00–19:00, Seg–Sex, ahead of classes).
- Surface proof of process, not a static mock: the automation behind the scenes keeps résumé, project data and the site's own inputs current, synced as static files instead of rendered integrations.
- Funnel: project click → GitHub repo → CV download → contact.
- Self-explanatory for both audiences: hiring manager (vaga) and client (freela — "site, bot de WhatsApp, API com Pix").

## What it must not do
- Look like an off-the-shelf cyan/violet AI-startup template.
- Make claims that aren't backed: commits, tests, availability, stack, phone.
- Collect user input for anything other than contact. No accounts here.

## Platform & constraints
- Static site on Vercel (root `main`, scope Sprayxs-projects); React + TanStack Router + Tailwind; custom CSS authored outside Tailwind for the identity layer.
- Integrations with the automation (StartANewDay) stay under the hood: static-file sync into `public/`, no integration UI advertised on the site.
- Portable across light/dark; the site defaults to the editorial identity and still works in `data-theme="light"` printed mode.
- Solo maintainer: every effect must be cheap, and every section must survive sparse data.
