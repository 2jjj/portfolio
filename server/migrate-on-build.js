/**
 * Roda as migrations durante o build da Vercel.
 *
 * O build tem acesso ao DATABASE_URL do projeto, entao e o unico caminho
 * para aplicar migration pendente em producao sem acesso ao banco local.
 * Falha aqui nunca quebra o deploy: o erro e logado e o build continua.
 */

import { runMigrations } from './migrate.js';

if (!process.env.DATABASE_URL) {
  console.log('[Build] DATABASE_URL ausente: migracoes puladas.');
  process.exit(0);
}

runMigrations(process.env.DATABASE_URL)
  .then(() => {
    console.log('[Build] Migracoes aplicadas.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[Build] Migracao falhou, deploy continua:', err.message);
    process.exit(0);
  });
