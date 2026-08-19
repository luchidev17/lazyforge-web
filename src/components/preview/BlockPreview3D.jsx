export const BlockPreview3D = ({
  textureUrl, topUrl, sideUrl,
  upUrl, downUrl, northUrl, southUrl, eastUrl, westUrl,
  variant = 'block', size = 'lg'
}) => {
  let up = upUrl
  let down = downUrl
  let north = northUrl
  let south = southUrl
  let east = eastUrl
  let west = westUrl

  if (variant === 'block' || variant === 'cross') {
    up = textureUrl
    down = textureUrl
    north = textureUrl
    south = textureUrl
    east = textureUrl
    west = textureUrl
  } else if (variant === 'slab' || variant === 'pillar' || variant === 'stairs') {
    const top = topUrl || textureUrl
    const side = sideUrl || textureUrl
    up = top
    down = side
    north = side
    south = side
    east = side
    west = side
  } else if (variant === 'six_faces') {
    up = upUrl || textureUrl
    down = downUrl || textureUrl
    north = northUrl || textureUrl
    south = southUrl || textureUrl
    east = eastUrl || textureUrl
    west = westUrl || textureUrl
  }

  if (!up && !down && !north && !south && !east && !west) return null

  const containerClass = size === 'sm' ? 'cube-container-sm' : 'cube-container'
  const isSm           = size === 'sm'
  const cubeClass      = isSm ? 'cube-sm' : 'cube'

  const renderBox = (w, h, d, x, y, z) => {
    const hw = w / 2
    const hh = h / 2
    const hd = d / 2

    const faces = [
      { transform: `rotateY(0deg) translateZ(${hd}px)`, width: w, height: h, left: -hw, top: -hh, img: south },
      { transform: `rotateY(180deg) translateZ(${hd}px)`, width: w, height: h, left: -hw, top: -hh, img: north, brightness: 0.6 },
      { transform: `rotateY(-90deg) translateZ(${hw}px)`, width: d, height: h, left: -hd, top: -hh, img: west, brightness: 0.85 },
      { transform: `rotateY(90deg) translateZ(${hw}px)`, width: d, height: h, left: -hd, top: -hh, img: east, brightness: 0.85 },
      { transform: `rotateX(90deg) translateZ(${hh}px)`, width: w, height: d, left: -hw, top: -hd, img: up, brightness: 1.1 },
      { transform: `rotateX(-90deg) translateZ(${hh}px)`, width: w, height: d, left: -hw, top: -hd, img: down, brightness: 0.5 }
    ]

    return (
      <div style={{ position: 'absolute', transform: `translate3d(${x}px, ${y}px, ${z}px)`, transformStyle: 'preserve-3d', width: 0, height: 0, left: '50%', top: '50%' }}>
        {faces.map((f, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${f.width}px`,
              height: `${f.height}px`,
              left: `${f.left}px`,
              top: `${f.top}px`,
              backgroundImage: f.img ? `url(${f.img})` : undefined,
              backgroundColor: f.img ? undefined : '#475569',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              imageRendering: 'pixelated',
              border: '1px solid rgba(0, 0, 0, 0.15)',
              transform: f.transform,
              filter: f.brightness ? `brightness(${f.brightness})` : undefined,
              backfaceVisibility: 'hidden'
            }}
          />
        ))}
      </div>
    )
  }

  const renderCross = (w, h, texture) => {
    const hw = w / 2
    const hh = h / 2

    const faces = [
      { transform: `rotateY(45deg)` },
      { transform: `rotateY(135deg)` }
    ]

    return (
      <div style={{ position: 'absolute', transformStyle: 'preserve-3d', width: 0, height: 0, left: '50%', top: '50%' }}>
        {faces.map((f, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${w}px`,
              height: `${h}px`,
              left: `${-hw}px`,
              top: `${-hh}px`,
              backgroundImage: texture ? `url(${texture})` : undefined,
              backgroundColor: texture ? undefined : '#10b981',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              imageRendering: 'pixelated',
              transform: f.transform,
              backfaceVisibility: 'visible'
            }}
          />
        ))}
      </div>
    )
  }

  const w = isSm ? 24 : 80
  const h = isSm ? 24 : 80
  const d = isSm ? 24 : 80

  return (
    <div className={containerClass}>
      <div className={cubeClass}>
        {variant === 'stairs' ? (
          <>
            {/* Base step: half height, full width and depth, at the bottom */}
            {renderBox(w, h / 2, d, 0, h / 4, 0)}
            {/* Top step: half height, full width, half depth, at the top back */}
            {renderBox(w, h / 2, d / 2, 0, -h / 4, -d / 4)}
          </>
        ) : variant === 'slab' ? (
          /* Slab: half height, at the bottom */
          renderBox(w, h / 2, d, 0, h / 4, 0)
        ) : variant === 'cross' ? (
          /* Cross shape (Flower/Plant) */
          renderCross(w, h, textureUrl)
        ) : (
          /* Full block / Pillar / Six Faces */
          renderBox(w, h, d, 0, 0, 0)
        )}
      </div>
    </div>
  )
}
