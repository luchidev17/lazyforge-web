/**
 * generateMod.js
 *
 * Cliente de la API LazyForge.
 * Envía los datos del mod al backend en Render y descarga el ZIP resultante.
 *
 * Variables de entorno (Vite):
 *   VITE_API_URL   — URL base del backend, ej. https://lazyforge-api.onrender.com
 *   VITE_API_TOKEN — Token secreto compartido con el backend
 */
import { saveAs } from 'file-saver'

const API_URL   = import.meta.env.VITE_API_URL   || 'http://localhost:3001'
const API_TOKEN = import.meta.env.VITE_API_TOKEN || ''

/**
 * Llama al endpoint POST /api/generate-mod del backend y dispara la descarga.
 *
 * @param {Array}  items
 * @param {Object} modConfig  - { id, name, tabIconBase64? }
 * @param {Array}  blocks
 * @param {Array}  armors
 * @returns {Promise<void>}
 */
export async function generateModZip(
  items     = [],
  modConfig = { name: 'Mi Mod Personalizado', id: 'mimod' },
  blocks    = [],
  armors    = [],
) {
  const headers = { 'Content-Type': 'application/json' }
  if (API_TOKEN) headers['x-api-token'] = API_TOKEN

  const response = await fetch(`${API_URL}/api/generate-mod`, {
    method:  'POST',
    headers,
    body:    JSON.stringify({ items, modConfig, blocks, armors }),
  })

  if (!response.ok) {
    let msg = `Error del servidor (HTTP ${response.status})`
    try {
      const json = await response.json()
      msg = json.error || msg
    } catch { /* sin body JSON */ }
    throw new Error(msg)
  }

  const blob = await response.blob()
  saveAs(blob, 'LazyForgeMod.zip')
}
