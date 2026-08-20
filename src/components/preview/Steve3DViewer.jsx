import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// Skin de Steve: 64x64 (coordenadas px, py, pw, ph)
// ─────────────────────────────────────────────────────────────────────────────
const SKIN_W = 64.0
const SKIN_H = 64.0

function createFaceMaterial(map, px, py, pw, ph, texW = SKIN_W, texH = SKIN_H, transparent = false, flipH = false) {
  const texture = map.clone()
  texture.needsUpdate = true
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.colorSpace = THREE.SRGBColorSpace
  if (flipH) {
    texture.wrapS = THREE.RepeatWrapping
    texture.repeat.set(-pw / texW, ph / texH)
    texture.offset.set((px + pw) / texW, 1.0 - (py + ph) / texH)
  } else {
    texture.repeat.set(pw / texW, ph / texH)
    texture.offset.set(px / texW, 1.0 - (py + ph) / texH)
  }
  return new THREE.MeshLambertMaterial({
    map: texture,
    alphaTest: transparent ? 0.1 : 0.5,
    transparent,
    side: THREE.FrontSide,
  })
}

function createSkinnedBoxMesh(w, h, d, uvs, baseTexture, texW = SKIN_W, texH = SKIN_H, transparent = false, flipH = false) {
  const geo = new THREE.BoxGeometry(w, h, d)
  const materials = [
    createFaceMaterial(baseTexture, ...uvs.right,  texW, texH, transparent, flipH),
    createFaceMaterial(baseTexture, ...uvs.left,   texW, texH, transparent, flipH),
    createFaceMaterial(baseTexture, ...uvs.top,    texW, texH, transparent, flipH),
    createFaceMaterial(baseTexture, ...uvs.bottom, texW, texH, transparent, flipH),
    createFaceMaterial(baseTexture, ...uvs.front,  texW, texH, transparent, flipH),
    createFaceMaterial(baseTexture, ...uvs.back,   texW, texH, transparent, flipH),
  ]
  return new THREE.Mesh(geo, materials)
}

// ─────────────────────────────────────────────────────────────────────────────
// Modelo de Steve con skin 64x64
// ─────────────────────────────────────────────────────────────────────────────
function buildSteveModel(baseTexture) {
  const group = new THREE.Group()

  // HEAD (8x8x8) — centro y=20
  const head = createSkinnedBoxMesh(8, 8, 8, {
    right:  [16, 8, 8, 8],
    left:   [0, 8, 8, 8],
    top:    [8, 0, 8, 8],
    bottom: [16, 0, 8, 8],
    front:  [8, 8, 8, 8],
    back:   [24, 8, 8, 8],
  }, baseTexture)
  head.position.set(0, 20, 0)
  group.add(head)

  // BODY (8x12x4) — centro y=10
  const body = createSkinnedBoxMesh(8, 12, 4, {
    right:  [16, 20, 4, 12],
    left:   [28, 20, 4, 12],
    top:    [20, 16, 8, 4],
    bottom: [28, 16, 8, 4],
    front:  [20, 20, 8, 12],
    back:   [32, 20, 8, 12],
  }, baseTexture)
  body.position.set(0, 10, 0)
  group.add(body)

  // RIGHT ARM (4x12x4) — x=-6
  const rArm = createSkinnedBoxMesh(4, 12, 4, {
    right:  [40, 20, 4, 12],
    left:   [48, 20, 4, 12],
    top:    [44, 16, 4, 4],
    bottom: [48, 16, 4, 4],
    front:  [44, 20, 4, 12],
    back:   [52, 20, 4, 12],
  }, baseTexture)
  rArm.position.set(-6, 10, 0)
  group.add(rArm)

  // LEFT ARM (4x12x4) — x=+6
  const lArm = createSkinnedBoxMesh(4, 12, 4, {
    right:  [32, 52, 4, 12],
    left:   [40, 52, 4, 12],
    top:    [36, 48, 4, 4],
    bottom: [40, 48, 4, 4],
    front:  [36, 52, 4, 12],
    back:   [44, 52, 4, 12],
  }, baseTexture)
  lArm.position.set(6, 10, 0)
  group.add(lArm)

  // RIGHT LEG (4x12x4) — x=-2
  const rLeg = createSkinnedBoxMesh(4, 12, 4, {
    right:  [0, 20, 4, 12],
    left:   [8, 20, 4, 12],
    top:    [4, 16, 4, 4],
    bottom: [8, 16, 4, 4],
    front:  [4, 20, 4, 12],
    back:   [12, 20, 4, 12],
  }, baseTexture)
  rLeg.position.set(-2, -2, 0)
  group.add(rLeg)

  // LEFT LEG (4x12x4) — x=+2
  const lLeg = createSkinnedBoxMesh(4, 12, 4, {
    right:  [16, 52, 4, 12],
    left:   [24, 52, 4, 12],
    top:    [20, 48, 4, 4],
    bottom: [24, 48, 4, 4],
    front:  [20, 52, 4, 12],
    back:   [28, 52, 4, 12],
  }, baseTexture)
  lLeg.position.set(2, -2, 0)
  group.add(lLeg)

  return group
}

// ─────────────────────────────────────────────────────────────────────────────
// Overlays de armadura sobre Steve (layer_1.png: 64x32 ó 128x64)
//
// Mapa UV Minecraft para layer_1.png (64x32 estándar):
//
// HELMET:
//   Head overlay base: [0,0..32,16]
//     top:    (8,0,8,8)    bottom: (16,0,8,8)
//     right:  (0,8,8,8)    front:  (8,8,8,8)
//     left:   (16,8,8,8)   back:   (24,8,8,8)
//   Head overlay outer: [32,0..64,16] (segunda capa — ignorada por ahora)
//
// CHESTPLATE body: [20,16..40,32] front:(20,20,8,12) etc.
// BOOTS: [0,16..16,32]
//
// Para HD (128x64) todo × 2.
// ─────────────────────────────────────────────────────────────────────────────

function buildArmorOverlay(layerTexture, slot, texW, texH) {
  const group = new THREE.Group()
  const SCALE = texW / 64  // 1 para 64x32, 2 para 128x64

  // Helper UV coords scaled
  const s = (px, py, pw, ph) => [px * SCALE, py * SCALE, pw * SCALE, ph * SCALE]

  if (slot === 'helmet') {
    // ── Capa base del casco: [0, 0, 32, 16] — ligeramente más grande que la cabeza
    const helmetBase = createSkinnedBoxMesh(8.5, 8.5, 8.5, {
      right:  s(16, 8, 8, 8),
      left:   s(0,  8, 8, 8),
      top:    s(8,  0, 8, 8),
      bottom: s(16, 0, 8, 8),
      front:  s(8,  8, 8, 8),
      back:   s(24, 8, 8, 8),
    }, layerTexture, texW, texH, true)
    helmetBase.position.set(0, 20, 0)
    group.add(helmetBase)

    // ── Segunda capa (sombrero/visera): [32, 0, 32, 16] — aún más grande para sobresalir
    const helmetOuter = createSkinnedBoxMesh(9.0, 9.0, 9.0, {
      right:  s(48, 8, 8, 8),
      left:   s(32, 8, 8, 8),
      top:    s(40, 0, 8, 8),
      bottom: s(48, 0, 8, 8),
      front:  s(40, 8, 8, 8),
      back:   s(56, 8, 8, 8),
    }, layerTexture, texW, texH, true)
    helmetOuter.position.set(0, 20, 0)
    group.add(helmetOuter)
  }

  if (slot === 'chestplate') {
    // Pechera torso: [16,20..28,32] right, [28,20..32,32] left, [20,16..28,20] top, front:[20,20..28,32]
    const torso = createSkinnedBoxMesh(8.5, 12.5, 4.5, {
      right:  s(16, 20, 4, 12),
      left:   s(28, 20, 4, 12),
      top:    s(20, 16, 8,  4),
      bottom: s(28, 16, 8,  4),
      front:  s(20, 20, 8, 12),
      back:   s(32, 20, 8, 12),
    }, layerTexture, texW, texH, true)
    torso.position.set(0, 10, 0)
    group.add(torso)

    // Hombro derecho (brazo derecho)
    const rShoulder = createSkinnedBoxMesh(4.5, 12.5, 4.5, {
      right:  s(48, 20, 4, 12),
      left:   s(40, 20, 4, 12),
      top:    s(44, 16, 4,  4),
      bottom: s(48, 16, 4,  4),
      front:  s(44, 20, 4, 12),
      back:   s(52, 20, 4, 12),
    }, layerTexture, texW, texH, true, false)
    rShoulder.position.set(-6, 10, 0)
    group.add(rShoulder)

    // Hombro izquierdo (brazo izquierdo) — espejo
    const lShoulder = createSkinnedBoxMesh(4.5, 12.5, 4.5, {
      right:  s(40, 20, 4, 12),
      left:   s(48, 20, 4, 12),
      top:    s(44, 16, 4,  4),
      bottom: s(48, 16, 4,  4),
      front:  s(44, 20, 4, 12),
      back:   s(52, 20, 4, 12),
    }, layerTexture, texW, texH, true, true)
    lShoulder.position.set(6, 10, 0)
    group.add(lShoulder)
  }

  if (slot === 'leggings') {
    // Cinturón/Pelvis del pantalón (torso)
    const torso = createSkinnedBoxMesh(8.5, 12.5, 4.5, {
      right:  s(16, 20, 4, 12),
      left:   s(28, 20, 4, 12),
      top:    s(20, 16, 8,  4),
      bottom: s(28, 16, 8,  4),
      front:  s(20, 20, 8, 12),
      back:   s(32, 20, 8, 12),
    }, layerTexture, texW, texH, true, false)
    torso.position.set(0, 10, 0)
    group.add(torso)

    // Pantalones capa 2: [0,16..16,32] para piernas
    const rLeg = createSkinnedBoxMesh(4.5, 12.5, 4.5, {
      right:  s(8, 20, 4, 12),
      left:   s(0, 20, 4, 12),
      top:    s(4, 16, 4,  4),
      bottom: s(8, 16, 4,  4),
      front:  s(4, 20, 4, 12),
      back:   s(12, 20, 4, 12),
    }, layerTexture, texW, texH, true, false)
    rLeg.position.set(-2, -2, 0)
    group.add(rLeg)

    // Pantalones pierna izquierda: espejo
    const lLeg = createSkinnedBoxMesh(4.5, 12.5, 4.5, {
      right:  s(0, 20, 4, 12),
      left:   s(8, 20, 4, 12),
      top:    s(4, 16, 4,  4),
      bottom: s(8, 16, 4,  4),
      front:  s(4, 20, 4, 12),
      back:   s(12, 20, 4, 12),
    }, layerTexture, texW, texH, true, true)
    lLeg.position.set(2, -2, 0)
    group.add(lLeg)
  }

  if (slot === 'boots') {
    // Botas: [0,16..16,32] piernas bajas
    const rBoot = createSkinnedBoxMesh(4.5, 12.5, 4.5, {
      right:  s(8, 20, 4, 12),
      left:   s(0, 20, 4, 12),
      top:    s(4, 16, 4,  4),
      bottom: s(8, 16, 4,  4),
      front:  s(4, 20, 4, 12),
      back:   s(12, 20, 4, 12),
    }, layerTexture, texW, texH, true, false)
    rBoot.position.set(-2, -2, 0)
    group.add(rBoot)

    const lBoot = createSkinnedBoxMesh(4.5, 12.5, 4.5, {
      right:  s(0, 20, 4, 12),
      left:   s(8, 20, 4, 12),
      top:    s(4, 16, 4,  4),
      bottom: s(8, 16, 4,  4),
      front:  s(4, 20, 4, 12),
      back:   s(12, 20, 4, 12),
    }, layerTexture, texW, texH, true, true)
    lBoot.position.set(2, -2, 0)
    group.add(lBoot)
  }

  return group
}

// ─────────────────────────────────────────────────────────────────────────────
export function Steve3DViewer({ armorSlot = 'helmet', armorLayerTextureUrl = null }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 340
    const height = container.clientHeight || 560

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
    camera.position.set(0, 9, 75)
    camera.lookAt(0, 9, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 1.4))
    const sun = new THREE.DirectionalLight(0xffffff, 0.8)
    sun.position.set(15, 30, 25)
    scene.add(sun)

    const loader = new THREE.TextureLoader()

    // Steve group (wraps steve + armor, rotates together)
    const steveGroup = new THREE.Group()
    scene.add(steveGroup)

    let animId
    let isDragging = false
    let prevX = 0

    const onDown = e => { isDragging = true; prevX = e.clientX }
    const onMove = e => {
      if (!isDragging) return
      steveGroup.rotation.y += (e.clientX - prevX) * 0.012
      prevX = e.clientX
    }
    const onUp = () => { isDragging = false }
    container.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isDragging) steveGroup.rotation.y += 0.008
      renderer.render(scene, camera)
    }

    // Load Steve skin
    const skinUrl = `${import.meta.env.BASE_URL || '/'}steve_skin.png`
    loader.load(skinUrl, (baseTex) => {
      baseTex.magFilter = THREE.NearestFilter
      baseTex.minFilter = THREE.NearestFilter
      baseTex.colorSpace = THREE.SRGBColorSpace
      const steveModel = buildSteveModel(baseTex)
      steveGroup.add(steveModel)

      // Load armor layer if available
      if (armorLayerTextureUrl) {
        loader.load(armorLayerTextureUrl, (layerTex) => {
          layerTex.magFilter = THREE.NearestFilter
          layerTex.minFilter = THREE.NearestFilter
          layerTex.colorSpace = THREE.SRGBColorSpace
          // Detect resolution
          const img = layerTex.image
          const texW = img ? img.width : 64
          const texH = img ? img.height : 32
          const armorOverlay = buildArmorOverlay(layerTex, armorSlot, texW, texH)
          steveGroup.add(armorOverlay)
        })
      }

      animate()
    })

    // Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(9, 10, 1.2, 32)
    const pedestalMat = new THREE.MeshLambertMaterial({ color: 0x1e293b })
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat)
    pedestal.position.set(0, -8.6, 0)
    scene.add(pedestal)

    const ringGeo = new THREE.RingGeometry(8.8, 9.5, 32)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = -Math.PI / 2
    ring.position.set(0, -7.9, 0)
    scene.add(ring)

    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('resize', onResize)
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [armorSlot, armorLayerTextureUrl])

  const slotLabel = {
    helmet: 'Casco (Cabeza)',
    chestplate: 'Peto (Pecho)',
    leggings: 'Pantalones (Piernas)',
    boots: 'Botas (Pies)',
  }[armorSlot] ?? armorSlot

  const hasArmor = !!armorLayerTextureUrl

  return (
    <div className="relative w-full h-[560px] bg-slate-950/80 rounded-xl border border-slate-700/60 overflow-hidden flex flex-col items-center justify-center shadow-inner group">
      <div className="absolute inset-0 bg-radial from-purple-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <span className="text-xs font-semibold text-purple-300 bg-purple-950/80 border border-purple-800/60 px-2.5 py-1 rounded-md backdrop-blur-sm shadow flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Visor 3D de Steve
        </span>
        <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          Arrastra para girar
        </span>
      </div>

      {/* WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Footer */}
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none z-10 flex flex-col items-center gap-1">
        <span className="text-[11px] text-slate-300 bg-slate-900/90 px-3 py-1 rounded-full border border-purple-800/60 shadow-md">
          Parte seleccionada: <strong className="text-purple-300">{slotLabel}</strong>
        </span>
        {hasArmor && (
          <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-700/50 shadow">
            ✦ Armadura visible
          </span>
        )}
      </div>
    </div>
  )
}
