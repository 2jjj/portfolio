import pool from "../db.js";

export async function createAuditLog({ action, entity, entityId, oldData, newData, ip }) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id, old_data, new_data, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        "admin",
        action,
        entity,
        entityId || null,
        oldData ? JSON.stringify(oldData) : null,
        newData ? JSON.stringify(newData) : null,
        ip || null,
      ]
    );
  } catch (err) {
    console.error("[Audit] Erro ao criar log:", err.message);
  }
}
