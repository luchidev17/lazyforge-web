param($filePath)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# ─── Specific word-level fixes for App.jsx ────────────────────────────────────
# Map every corrupted Spanish string to its correct form.
# Ordered from most-specific to least-specific to avoid partial replacements.

$fixes = [ordered]@{
    # ── Category values & labels ──────────────────────────────────────────────
    "Miscelneo"          = "Misceláneo"
    "Miscel neo"         = "Misceláneo"

    # ── Error messages ────────────────────────────────────────────────────────
    "extensi³n .png."   = "extensión .png."
    "peso mximo"        = "peso máximo"
    "peso m  ximo"      = "peso máximo"
    "textura vlida"     = "textura válida"
    "Textura vlida"     = "Textura válida"
    "textura v  lida"   = "textura válida"
    "Textura v  lida"   = "Textura válida"

    # ── Dimension strings ─────────────────────────────────────────────────────
    "1616 o 3232"       = "16×16 o 32×32"
    "16  16 o 32  32"   = "16×16 o 32×32"
    "16  16"            = "16×16"
    "32  32"            = "32×32"
    '${img.width}${img.height}px' = '${img.width}×${img.height}px'
    '${img.width}  ${img.height}px' = '${img.width}×${img.height}px'

    # ── Validation messages ───────────────────────────────────────────────────
    "letras minºsculas" = "letras minúsculas"
    "Solo minºsculas"   = "Solo minúsculas"
    "Solo min ºsculas"  = "Solo minúsculas"
    "min ºsculas"       = "minúsculas"

    # ── ID validation ─────────────────────────────────────────────────────────
    "ya est en uso"     = "ya está en uso"
    "ya est   en uso"   = "ya está en uso"
    "ya estÃ¡ en uso"   = "ya está en uso"

    # ── Item/Block form labels ────────────────────────────────────────────────
    "ID del tem"        = "ID del ítem"
    "ID del  ­tem"      = "ID del ítem"
    "del ­tem"          = "del ítem"
    "Otro ­tem"         = "Otro ítem"
    "otro ­tem"         = "otro ítem"
    "otro  ­tem"        = "otro ítem"
    "Elige un ­tem"     = "Elige un ítem"
    "Elige un  ­tem"    = "Elige un ítem"
    "Tus ­tems"         = "Tus ítems"
    "Tus  ­tems"        = "Tus ítems"
    "­tems"             = "ítems"
    "­tem"              = "ítem"

    # ── Subtitle/description texts ────────────────────────────────────────────
    "propiedades del ­tem"   = "propiedades del ítem"
    "propiedades del  ­tem"  = "propiedades del ítem"
    "primer ­tem"            = "primer ítem"
    "primer  ­tem"           = "primer ítem"
    "Editar ­tem"            = "Editar ítem"
    "Eliminar ­tem"          = "Eliminar ítem"
    "Editar  ­tem"           = "Editar ítem"
    "Eliminar  ­tem"         = "Eliminar ítem"
    "Guardar tem"            = "Guardar ítem"
    "Actualizar tem"         = "Actualizar ítem"
    "Guardar  tem"           = "Guardar ítem"
    "Actualizar  tem"        = "Actualizar ítem"
    "A±adir Nuevo tem"       = "Añadir Nuevo ítem"
    "A ±adir Nuevo  tem"     = "Añadir Nuevo ítem"
    "A±adir Nuevo Bloque"    = "Añadir Nuevo Bloque"
    "A ±adir Nuevo Bloque"   = "Añadir Nuevo Bloque"

    # ── Crafting ──────────────────────────────────────────────────────────────
    "continuaci³n."     = "continuación."
    "continuaci ³n."    = "continuación."
    "Este ­tem se puede craftear" = "Este ítem se puede craftear"
    "Este  ­tem se puede craftear" = "Este ítem se puede craftear"

    # ── Block form ────────────────────────────────────────────────────────────
    "Bloque Estndar"    = "Bloque Estándar"
    "Bloque Est  ndar"  = "Bloque Estándar"
    "Bloque Mgico"      = "Bloque Mágico"
    "Bloque M  gico"    = "Bloque Mágico"
    "Tama±o de Stack"   = "Tamaño de Stack"
    "Tama ±o de Stack"  = "Tamaño de Stack"
    "Categor­a"         = "Categoría"
    "Categor ­a"        = "Categoría"
    "Ignici³n fcil"     = "Ignición fácil"
    "Ignici ³n f  cil"  = "Ignición fácil"
    "Miner­a y Drops"   = "Minería y Drops"
    "Miner ­a y Drops"  = "Minería y Drops"
    "S­ mismo"          = "Sí mismo"
    "S ­ mismo"         = "Sí mismo"
    "Anti-explosi³n"    = "Anti-explosión"
    "Anti-explosi ³n"   = "Anti-explosión"
    "Dise±a"            = "Diseña"
    "Dise ±a"           = "Diseña"
    "descrgalos"        = "descárgalos"
    "desc  rgalos"      = "descárgalos"
    "automtico"         = "automático"
    "autom  tico"       = "automático"
    "compilar el mod"   = "compilará el mod"
    "compilar  el mod"  = "compilará el mod"
    "limpiar el c³digo" = "limpiará el código"
    "limpiar  el c³digo"= "limpiará el código"
    "limpiar el c  digo"= "limpiará el código"
    "c³digo"            = "código"
    "c  digo"           = "código"

    # ── Welcome screen ────────────────────────────────────────────────────────
    " Bienvenido a Lazy Forge!" = "¡Bienvenido a Lazy Forge!"

    # ── Sidebar / mod config ──────────────────────────────────────────────────
    "Configuraci³n del Mod"    = "Configuración del Mod"
    "Configuraci ³n del Mod"   = "Configuración del Mod"
    "Configuraci³n obligatoria"= "Configuración obligatoria"
    "Mi Mod Incre­ble"         = "Mi Mod Increíble"
    "Mi Mod Incre  ble"        = "Mi Mod Increíble"
    "Solo minºsculas y guiones bajos." = "Solo minúsculas y guiones bajos."
    "Solo min ºsculas y guiones bajos." = "Solo minúsculas y guiones bajos."
    "Mx 50KB."                 = "Máx 50KB."
    "M  x 50KB."               = "Máx 50KB."

    # ── Cart / element list ───────────────────────────────────────────────────
    "todav­a."   = "todavía."
    "todav ­a."  = "todavía."
    "No hay contenido en tu mod todav­a" = "No hay contenido en tu mod todavía"

    # ── Separator arrows ──────────────────────────────────────────────────────
    "blob URL €" = "blob URL —"
    "€" = "—"

    # ── Exportación comment ───────────────────────────────────────────────────
    "exportaci³n/procesamiento"= "exportación/procesamiento"
    "exportaci ³n/procesamiento"= "exportación/procesamiento"
    "previsualizaci³n"         = "previsualización"
    "previsualizaci ³n"        = "previsualización"
    "sesi³n"                   = "sesión"
    "sesi ³n"                  = "sesión"

    # ── Hardness hints ────────────────────────────────────────────────────────
    "tierra  2.0" = "tierra · 2.0"
    "roca  50.0"  = "roca · 50.0"
    "madera  100" = "madera · 100"
    "madera  60"  = "madera · 60"
    "sin luz  15" = "sin luz · 15"
    "Mx. 50 KB"   = "Máx. 50 KB"
    "M  x. 50 KB" = "Máx. 50 KB"

    # ── Uploaders ─────────────────────────────────────────────────────────────
    "Solo 1616 o 3232" = "Solo 16×16 o 32×32"
    "texturas superiores (1616 o 3232) y laterales (1616 o 3232) vlidas" = "texturas superiores (16×16 o 32×32) y laterales (16×16 o 32×32) válidas"
    "Dise±a elementos" = "Diseña elementos"

    # ── Box drawing characters in comments ───────────────────────────────────
    "â"€" = "─"
}

foreach ($from in $fixes.Keys) {
    $to = $fixes[$from]
    $content = $content.Replace($from, $to)
}

[System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
Write-Host "All replacements applied."

# Show sample to verify
Write-Host "`nSample lines with Spanish text:"
$lines = $content -split "`n"
$lines | Where-Object { $_ -match "(Miscel|extensi|mximo|minsc|ltems|Categ|Confi|Dise|continu)" } | Select-Object -First 15
