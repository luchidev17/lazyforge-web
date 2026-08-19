import { useState, useRef } from 'react'
import { generateModZip } from '../api/generateMod'
import {
  defaultToolData,
  defaultFoodData,
  defaultThrowableData,
  defaultCraftSlots,
  defaultArmorData,
} from '../constants/defaultState'

export function useModWorkspace() {
  const [items, setItems] = useState([])
  const [blocks, setBlocks] = useState([])
  const [armors, setArmors] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [editingId, setEditingId] = useState(null)

  // Armor state
  const [armorId, setArmorId] = useState('')
  const [armorName, setArmorName] = useState('')
  const [armorSlot, setArmorSlot] = useState('helmet')
  // Textura del ítem en inventario (16x16 / 32x32)
  const [armorTexture, setArmorTexture] = useState(null)
  const [armorTextureUrl, setArmorTextureUrl] = useState('')
  const [armorTextureBase64, setArmorTextureBase64] = useState('')
  // Textura de la pieza de armadura (layer_1.png — 64x32 o 128x64)
  const [armorLayerTexture, setArmorLayerTexture] = useState(null)
  const [armorLayerTextureUrl, setArmorLayerTextureUrl] = useState('')
  const [armorLayerTextureBase64, setArmorLayerTextureBase64] = useState('')
  const [armorLayerTextureError, setArmorLayerTextureError] = useState('')
  const [armorData, setArmorData] = useState(defaultArmorData())
  const [armorIdError, setArmorIdError] = useState('')
  const [armorTextureError, setArmorTextureError] = useState('')
  const armorFileInputRef = useRef(null)
  const armorLayerFileInputRef = useRef(null)


  const [itemId, setItemId] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemTexture, setItemTexture] = useState(null)
  const [textureUrl, setTextureUrl] = useState('')
  const [textureBase64, setTextureBase64] = useState('')
  const [stackSize, setStackSize] = useState('64')
  const [category, setCategory] = useState('Misceláneo')
  const [immuneToLava, setImmuneToLava] = useState(false)
  const [enchantedGlow, setEnchantedGlow] = useState(false)

  const [blockId, setBlockId] = useState('')
  const [blockName, setBlockName] = useState('')
  const [blockTexture, setBlockTexture] = useState(null)
  const [blockTextureUrl, setBlockTextureUrl] = useState('')
  const [blockTextureBase64, setBlockTextureBase64] = useState('')
  const [hasGravity, setHasGravity] = useState(false)
  const [explosionResistant, setExplosionResistant] = useState(false)
  const [blockLuminance, setBlockLuminance] = useState('0')
  const [blockDropType, setBlockDropType] = useState('self')
  const [blockCustomDrop, setBlockCustomDrop] = useState('')
  const [blockTool, setBlockTool] = useState('none')
  const [blockHardness, setBlockHardness] = useState('2.0')
  const [isTransparent, setIsTransparent] = useState(false)
  const [soundGroup, setSoundGroup] = useState('STONE')
  const [isFlammable, setIsFlammable] = useState(false)
  const [burnChance, setBurnChance] = useState('20')
  const [spreadChance, setSpreadChance] = useState('5')
  const [miningTier, setMiningTier] = useState('none')
  const [silkTouch, setSilkTouch] = useState(false)
  const [blockShape, setBlockShape] = useState('block')
  const [slabTextureMode, setSlabTextureMode] = useState('uniform')
  const [slabTopTexture, setSlabTopTexture] = useState(null)
  const [slabTopTextureUrl, setSlabTopTextureUrl] = useState('')
  const [slabTopTextureBase64, setSlabTopTextureBase64] = useState('')
  const [slabSideTexture, setSlabSideTexture] = useState(null)
  const [slabSideTextureUrl, setSlabSideTextureUrl] = useState('')
  const [slabSideTextureBase64, setSlabSideTextureBase64] = useState('')
  
  // 6-faced block texture states
  const [faceUpTexture, setFaceUpTexture] = useState(null)
  const [faceUpTextureUrl, setFaceUpTextureUrl] = useState('')
  const [faceUpTextureBase64, setFaceUpTextureBase64] = useState('')
  const [faceDownTexture, setFaceDownTexture] = useState(null)
  const [faceDownTextureUrl, setFaceDownTextureUrl] = useState('')
  const [faceDownTextureBase64, setFaceDownTextureBase64] = useState('')
  const [faceNorthTexture, setFaceNorthTexture] = useState(null)
  const [faceNorthTextureUrl, setFaceNorthTextureUrl] = useState('')
  const [faceNorthTextureBase64, setFaceNorthTextureBase64] = useState('')
  const [faceSouthTexture, setFaceSouthTexture] = useState(null)
  const [faceSouthTextureUrl, setFaceSouthTextureUrl] = useState('')
  const [faceSouthTextureBase64, setFaceSouthTextureBase64] = useState('')
  const [faceEastTexture, setFaceEastTexture] = useState(null)
  const [faceEastTextureUrl, setFaceEastTextureUrl] = useState('')
  const [faceEastTextureBase64, setFaceEastTextureBase64] = useState('')
  const [faceWestTexture, setFaceWestTexture] = useState(null)
  const [faceWestTextureUrl, setFaceWestTextureUrl] = useState('')
  const [faceWestTextureBase64, setFaceWestTextureBase64] = useState('')

  const [dealsDamage, setDealsDamage] = useState(false)
  const [noCollision, setNoCollision] = useState(false)
  const [cancelsFallDamage, setCancelsFallDamage] = useState(false)
  const [fallDamageModifier, setFallDamageModifier] = useState('0.0')
  const [hasBounce, setHasBounce] = useState(false)
  const [bounceVelocity, setBounceVelocity] = useState('0.8')

  const [blockIdError, setBlockIdError] = useState('')
  const [blockTextureError, setBlockTextureError] = useState('')
  const blockFileInputRef = useRef(null)
  const slabTopFileInputRef = useRef(null)
  const slabSideFileInputRef = useRef(null)
  const faceUpFileInputRef = useRef(null)
  const faceDownFileInputRef = useRef(null)
  const faceNorthFileInputRef = useRef(null)
  const faceSouthFileInputRef = useRef(null)
  const faceEastFileInputRef = useRef(null)
  const faceWestFileInputRef = useRef(null)

  const [toolData, setToolData] = useState(defaultToolData())
  const [foodData, setFoodData] = useState(defaultFoodData())
  const [throwableData, setThrowableData] = useState(defaultThrowableData())

  const [hasCrafting, setHasCrafting] = useState(false)
  const [craftSlots, setCraftSlots] = useState(defaultCraftSlots())
  const [craftResultCount, setCraftResultCount] = useState(1)
  const [craftShapeless, setCraftShapeless] = useState(false)

  const [useSound, setUseSound] = useState('')

  const [modName, setModName] = useState('')
  const [modId, setModId] = useState('')
  const [modIdError, setModIdError] = useState('')
  const [modTabIcon, setModTabIcon] = useState(null)
  const [modTabIconUrl, setModTabIconUrl] = useState('')
  const [modTabIconBase64, setModTabIconBase64] = useState('')
  const [modTabIconError, setModTabIconError] = useState('')
  const modTabIconInputRef = useRef(null)

  const [textureError, setTextureError] = useState('')
  const [idError, setIdError] = useState('')
  const fileInputRef = useRef(null)

  const handleIdChange = (e) => {
    const raw = e.target.value
    const filtered = raw.toLowerCase().replace(/[^a-z_]/g, '')
    setItemId(filtered)
    setIdError(raw !== filtered ? 'Solo se permiten letras minúsculas y guiones bajos (_).' : '')
  }

  const handleModIdChange = (e) => {
    const raw = e.target.value
    const filtered = raw.toLowerCase().replace(/[^a-z_]/g, '')
    setModId(filtered)
    setModIdError(raw !== filtered ? 'Solo se permiten letras minúsculas y guiones bajos (_).' : '')
  }

  const handleBlockIdChange = (e) => {
    const raw = e.target.value
    const filtered = raw.toLowerCase().replace(/[^a-z_]/g, '')
    setBlockId(filtered)
    setBlockIdError(raw !== filtered ? 'Solo se permiten letras minúsculas y guiones bajos (_).' : '')
  }

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setToolData(defaultToolData())
    setFoodData(defaultFoodData())
    setThrowableData(defaultThrowableData())
  }

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const full = reader.result
      resolve(full.substring(full.indexOf(',') + 1))
    }
    reader.onerror = () => reject('Error al leer el archivo con FileReader.')
    reader.readAsDataURL(file)
  })

  const validateDimensions = (file, isSlabSide = false) => new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      const ok = (img.width === 16 && img.height === 16) || (img.width === 32 && img.height === 32)
      if (ok) resolve(true)
      else if (isSlabSide) reject(`Error: Dimensiones incorrectas para lateral. (Actual: ${img.width}×${img.height}px — Se requiere 16×16 o 32×32)`)
      else reject(`Error: Dimensiones incorrectas. (Actual: ${img.width}×${img.height}px — Se requiere 16×16 o 32×32)`)
    }
    img.onerror = () => reject('Error al procesar la imagen.')
  })

  const resetTextureInput = () => {
    setItemTexture(null)
    setTextureUrl('')
    setTextureBase64('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const resetBlockTextureInput = () => {
    setBlockTexture(null)
    setBlockTextureUrl('')
    setBlockTextureBase64('')
    setSlabTopTexture(null)
    setSlabTopTextureUrl('')
    setSlabTopTextureBase64('')
    setSlabSideTexture(null)
    setSlabSideTextureUrl('')
    setSlabSideTextureBase64('')

    setFaceUpTexture(null)
    setFaceUpTextureUrl('')
    setFaceUpTextureBase64('')
    setFaceDownTexture(null)
    setFaceDownTextureUrl('')
    setFaceDownTextureBase64('')
    setFaceNorthTexture(null)
    setFaceNorthTextureUrl('')
    setFaceNorthTextureBase64('')
    setFaceSouthTexture(null)
    setFaceSouthTextureUrl('')
    setFaceSouthTextureBase64('')
    setFaceEastTexture(null)
    setFaceEastTextureUrl('')
    setFaceEastTextureBase64('')
    setFaceWestTexture(null)
    setFaceWestTextureUrl('')
    setFaceWestTextureBase64('')

    if (blockFileInputRef.current) blockFileInputRef.current.value = ''
    if (slabTopFileInputRef.current) slabTopFileInputRef.current.value = ''
    if (slabSideFileInputRef.current) slabSideFileInputRef.current.value = ''
    if (faceUpFileInputRef.current) faceUpFileInputRef.current.value = ''
    if (faceDownFileInputRef.current) faceDownFileInputRef.current.value = ''
    if (faceNorthFileInputRef.current) faceNorthFileInputRef.current.value = ''
    if (faceSouthFileInputRef.current) faceSouthFileInputRef.current.value = ''
    if (faceEastFileInputRef.current) faceEastFileInputRef.current.value = ''
    if (faceWestFileInputRef.current) faceWestFileInputRef.current.value = ''
  }

  const resetBlockForm = () => {
    setBlockId('')
    setBlockName('')
    resetBlockTextureInput()
    setHasGravity(false)
    setExplosionResistant(false)
    setDealsDamage(false)
    setNoCollision(false)
    setCancelsFallDamage(false)
    setFallDamageModifier('0.0')
    setHasBounce(false)
    setBounceVelocity('0.8')
    setBlockLuminance('0')
    setBlockDropType('self')
    setBlockCustomDrop('')
    setBlockTool('none')
    setBlockHardness('2.0')
    setIsTransparent(false)
    setSoundGroup('STONE')
    setIsFlammable(false)
    setBurnChance('20')
    setSpreadChance('5')
    setMiningTier('none')
    setSilkTouch(false)
    setBlockShape('block')
    setSlabTextureMode('uniform')
    setBlockIdError('')
    setBlockTextureError('')
    setHasCrafting(false)
    setCraftSlots(defaultCraftSlots())
    setCraftResultCount(1)
    setCraftShapeless(false)
    setEditingId(null)
  }

  const resetForm = () => {
    setItemId('')
    setItemName('')
    resetTextureInput()
    setStackSize('64')
    setCategory('Misceláneo')
    setImmuneToLava(false)
    setEnchantedGlow(false)
    setToolData(defaultToolData())
    setFoodData(defaultFoodData())
    setThrowableData(defaultThrowableData())
    setHasCrafting(false)
    setCraftSlots(defaultCraftSlots())
    setCraftResultCount(1)
    setCraftShapeless(false)
    setUseSound('')
    setTextureError('')
    setIdError('')
    setEditingId(null)
  }

  const handleTextureChange = async (e) => {
    const file = e.target.files[0]
    setTextureError('')
    if (!file) { resetTextureInput(); return }
    if (!file.name.toLowerCase().endsWith('.png')) {
      setTextureError('Error: Solo se permiten archivos con extensión .png.')
      return resetTextureInput()
    }
    if (file.size > 50 * 1024) {
      setTextureError('Error: El archivo supera el peso máximo permitido de 50KB.')
      return resetTextureInput()
    }
    try {
      await validateDimensions(file)
      setItemTexture(file)
      setTextureUrl(URL.createObjectURL(file))
      setTextureBase64(await fileToBase64(file))
    } catch (err) {
      setTextureError(err)
      resetTextureInput()
    }
  }

  const handleBlockTextureChange = async (e) => {
    const file = e.target.files[0]
    setBlockTextureError('')
    if (!file) { resetBlockTextureInput(); return }
    if (!file.name.toLowerCase().endsWith('.png')) {
      setBlockTextureError('Error: Solo se permiten archivos con extensión .png.')
      return resetBlockTextureInput()
    }
    if (file.size > 50 * 1024) {
      setBlockTextureError('Error: El archivo supera el peso máximo permitido de 50KB.')
      return resetBlockTextureInput()
    }
    try {
      await validateDimensions(file)
      setBlockTexture(file)
      setBlockTextureUrl(URL.createObjectURL(file))
      setBlockTextureBase64(await fileToBase64(file))
    } catch (err) {
      setBlockTextureError(err)
      resetBlockTextureInput()
    }
  }

  const handleSlabTextureChange = async (e, type) => {
    const file = e.target.files[0]
    setBlockTextureError('')
    if (!file) {
      if (type === 'top') { setSlabTopTexture(null); setSlabTopTextureUrl(''); setSlabTopTextureBase64('') }
      if (type === 'side') { setSlabSideTexture(null); setSlabSideTextureUrl(''); setSlabSideTextureBase64('') }
      return
    }
    if (!file.name.toLowerCase().endsWith('.png')) {
      setBlockTextureError('Error: Solo se permiten archivos con extensión .png.')
      return
    }
    if (file.size > 50 * 1024) {
      setBlockTextureError('Error: El archivo supera el peso máximo permitido de 50KB.')
      return
    }
    try {
      await validateDimensions(file, type === 'side')
      const url = URL.createObjectURL(file)
      const base64 = await fileToBase64(file)
      if (type === 'top') {
        setSlabTopTexture(file)
        setSlabTopTextureUrl(url)
        setSlabTopTextureBase64(base64)
      } else {
        setSlabSideTexture(file)
        setSlabSideTextureUrl(url)
        setSlabSideTextureBase64(base64)
      }
    } catch (err) {
      setBlockTextureError(err)
    }
  }

  const handleFaceTextureChange = async (e, face) => {
    const file = e.target.files[0]
    setBlockTextureError('')
    const setters = {
      up: { setFile: setFaceUpTexture, setUrl: setFaceUpTextureUrl, setBase64: setFaceUpTextureBase64 },
      down: { setFile: setFaceDownTexture, setUrl: setFaceDownTextureUrl, setBase64: setFaceDownTextureBase64 },
      north: { setFile: setFaceNorthTexture, setUrl: setFaceNorthTextureUrl, setBase64: setFaceNorthTextureBase64 },
      south: { setFile: setFaceSouthTexture, setUrl: setFaceSouthTextureUrl, setBase64: setFaceSouthTextureBase64 },
      east: { setFile: setFaceEastTexture, setUrl: setFaceEastTextureUrl, setBase64: setFaceEastTextureBase64 },
      west: { setFile: setFaceWestTexture, setUrl: setFaceWestTextureUrl, setBase64: setFaceWestTextureBase64 },
    }
    const { setFile, setUrl, setBase64 } = setters[face]

    if (!file) {
      setFile(null); setUrl(''); setBase64('')
      return
    }
    if (!file.name.toLowerCase().endsWith('.png')) {
      setBlockTextureError('Error: Solo se permiten archivos con extensión .png.')
      return
    }
    if (file.size > 50 * 1024) {
      setBlockTextureError('Error: El archivo supera el peso máximo permitido de 50KB.')
      return
    }
    try {
      await validateDimensions(file)
      setUrl(URL.createObjectURL(file))
      setFile(file)
      setBase64(await fileToBase64(file))
    } catch (err) {
      setBlockTextureError(err)
    }
  }

  const handleModTabIconChange = async (e) => {
    const file = e.target.files[0]
    setModTabIconError('')
    if (!file) { setModTabIcon(null); setModTabIconUrl(''); setModTabIconBase64(''); return }
    if (!file.name.toLowerCase().endsWith('.png')) {
      setModTabIconError('Solo archivos PNG.')
      return
    }
    if (file.size > 50 * 1024) {
      setModTabIconError('Máx 50KB.')
      return
    }
    try {
      await validateDimensions(file)
      setModTabIcon(file)
      setModTabIconUrl(URL.createObjectURL(file))
      setModTabIconBase64(await fileToBase64(file))
    } catch (err) {
      setModTabIconError(err)
    }
  }

  const handleSaveItem = (e) => {
    e.preventDefault()
    if (!itemId) { setIdError('El ID del ítem es requerido.'); return }
    if (!itemName.trim()) { alert('El Nombre In-Game es requerido.'); return }
    if (!itemTexture && !textureBase64) { setTextureError('Debe subir una textura válida.'); return }
    if (blocks.some(b => b.id === itemId)) {
      setIdError('Este ID ya está en uso por un bloque.')
      return
    }
    if (items.some(i => i.id === itemId && i.id !== editingId)) {
      setIdError('Este ID ya está en uso por otro ítem.')
      return
    }

    const recipe = hasCrafting ? {
      slots: craftSlots.map(s => s || null),
      resultCount: craftResultCount,
      shapeless: craftShapeless,
      type: craftShapeless ? 'shapeless' : 'shaped',
    } : null

    const newItem = {
      id: itemId,
      name: itemName,
      textureUrl,
      textureBase64,
      stackSize: parseInt(stackSize),
      category,
      immuneToLava,
      enchantedGlow,
      sound: useSound || null,
      ...(category === 'Herramienta/Arma' && {
        toolType: toolData.toolType,
        material: toolData.material,
        attackDamage: toolData.attackDamage !== '' ? parseFloat(toolData.attackDamage) : null,
        attackSpeed: toolData.attackSpeed !== '' ? parseFloat(toolData.attackSpeed) : null,
        durability: toolData.durability !== '' ? parseInt(toolData.durability) : null,
        effects: toolData.effects,
        holderEffects: toolData.holderEffects,
      }),
      ...(category === 'Comida' && {
        nutrition: parseInt(foodData.nutrition) || 0,
        saturation: parseFloat(foodData.saturation) || 0,
        alwaysEdible: foodData.alwaysEdible,
        wolfFood: foodData.wolfFood,
        effects: foodData.effects,
      }),
      ...(category === 'Arrojadizo' && {
        cooldownTicks: parseInt(throwableData.cooldownTicks) || 20,
        throwForce: parseFloat(throwableData.throwForce) || 1.5,
        throwSound: throwableData.throwSound || null,
        impactSound: throwableData.impactSound || null,
        effects: throwableData.effects,
      }),
      recipe,
    }

    if (editingId) setItems(items.map(i => i.id === editingId ? newItem : i))
    else setItems([...items, newItem])
    resetForm()
    setFormMode(null)
  }

  const handleSaveBlock = (e) => {
    e.preventDefault()
    if (!blockId) { setBlockIdError('El ID del bloque es requerido.'); return }
    if (!blockName.trim()) { alert('El Nombre In-Game es requerido.'); return }
    if (blockShape === 'block' || blockShape === 'cross') {
      if (!blockTexture && !blockTextureBase64) { setBlockTextureError('Debe subir una textura válida.'); return }
    } else if (blockShape === 'six_faces') {
      if (
        (!faceUpTexture && !faceUpTextureBase64) ||
        (!faceDownTexture && !faceDownTextureBase64) ||
        (!faceNorthTexture && !faceNorthTextureBase64) ||
        (!faceSouthTexture && !faceSouthTextureBase64) ||
        (!faceEastTexture && !faceEastTextureBase64) ||
        (!faceWestTexture && !faceWestTextureBase64)
      ) {
        setBlockTextureError('Debe subir las 6 texturas correspondientes a cada cara.')
        return
      }
    } else if ((!slabTopTexture && !slabTopTextureBase64) || (!slabSideTexture && !slabSideTextureBase64)) {
      setBlockTextureError('Debe subir texturas superiores (16×16 o 32×32) y laterales (16×16 o 32×32) válidas.')
      return
    }
    if (items.some(i => i.id === blockId)) {
      setBlockIdError('Este ID ya está en uso por un ítem.')
      return
    }
    if (blocks.some(b => b.id === blockId && b.id !== editingId)) {
      setBlockIdError('Este ID ya está en uso por otro bloque.')
      return
    }

    const recipe = hasCrafting ? {
      slots: craftSlots.map(s => s || null),
      resultCount: craftResultCount,
      shapeless: craftShapeless,
      type: craftShapeless ? 'shapeless' : 'shaped',
    } : null

    const newBlock = {
      id: blockId,
      name: blockName,
      textureUrl: blockTextureUrl,
      textureBase64: blockTextureBase64,
      hasGravity,
      explosionResistant,
      dealsDamage,
      noCollision,
      cancelsFallDamage,
      fallDamageModifier: parseFloat(fallDamageModifier) || 0.0,
      hasBounce,
      bounceVelocity: parseFloat(bounceVelocity) || 0.8,
      luminance: Math.min(15, Math.max(0, parseInt(blockLuminance) || 0)),
      dropType: blockDropType,
      customDrop: blockCustomDrop,
      requiredTool: blockTool,
      hardness: parseFloat(blockHardness) || 2.0,
      isTransparent,
      soundGroup,
      isFlammable,
      burnChance: parseInt(burnChance) || 20,
      spreadChance: parseInt(spreadChance) || 5,
      miningTier,
      silkTouch,
      blockShape,
      slabTextureMode,
      slabTopTextureUrl,
      slabTopTextureBase64,
      slabSideTextureUrl,
      slabSideTextureBase64,
      // 6 faces fields
      faceUpTextureUrl,
      faceUpTextureBase64,
      faceDownTextureUrl,
      faceDownTextureBase64,
      faceNorthTextureUrl,
      faceNorthTextureBase64,
      faceSouthTextureUrl,
      faceSouthTextureBase64,
      faceEastTextureUrl,
      faceEastTextureBase64,
      faceWestTextureUrl,
      faceWestTextureBase64,
      recipe,
    }

    if (editingId) setBlocks(blocks.map(b => b.id === editingId ? newBlock : b))
    else setBlocks([...blocks, newBlock])
    resetBlockForm()
    setFormMode(null)
  }

  const handleDeleteItem = (id) => setItems(items.filter(i => i.id !== id))
  const handleDeleteBlock = (id) => setBlocks(blocks.filter(b => b.id !== id))
  const handleDeleteArmor = (id) => setArmors(armors.filter(a => a.id !== id))

  const handleArmorIdChange = (e) => {
    const raw = e.target.value
    const filtered = raw.toLowerCase().replace(/[^a-z_]/g, '')
    setArmorId(filtered)
    setArmorIdError(raw !== filtered ? 'Solo se permiten letras minúsculas y guiones bajos (_).' : '')
  }

  const resetArmorTextureInput = () => {
    setArmorTexture(null)
    setArmorTextureUrl('')
    setArmorTextureBase64('')
    if (armorFileInputRef.current) armorFileInputRef.current.value = ''
  }

  const resetArmorLayerTextureInput = () => {
    setArmorLayerTexture(null)
    setArmorLayerTextureUrl('')
    setArmorLayerTextureBase64('')
    setArmorLayerTextureError('')
    if (armorLayerFileInputRef.current) armorLayerFileInputRef.current.value = ''
  }

  const resetArmorForm = () => {
    setArmorId('')
    setArmorName('')
    setArmorSlot('helmet')
    resetArmorTextureInput()
    resetArmorLayerTextureInput()
    setArmorData(defaultArmorData())
    setArmorIdError('')
    setArmorTextureError('')
    setHasCrafting(false)
    setCraftSlots(defaultCraftSlots())
    setCraftResultCount(1)
    setCraftShapeless(false)
    setEditingId(null)
  }

  const handleArmorTextureChange = async (e) => {
    const file = e.target.files[0]
    setArmorTextureError('')
    if (!file) { resetArmorTextureInput(); return }
    if (!file.name.toLowerCase().endsWith('.png')) {
      setArmorTextureError('Error: Solo se permiten archivos con extensión .png.')
      return resetArmorTextureInput()
    }
    if (file.size > 50 * 1024) {
      setArmorTextureError('Error: El archivo supera el peso máximo permitido de 50KB.')
      return resetArmorTextureInput()
    }
    try {
      await validateDimensions(file)
      setArmorTexture(file)
      setArmorTextureUrl(URL.createObjectURL(file))
      setArmorTextureBase64(await fileToBase64(file))
    } catch (err) {
      setArmorTextureError(err)
      resetArmorTextureInput()
    }
  }

  // Valida dimensiones de textura de pieza de armadura (64x32 o 128x64)
  const validateArmorLayerDimensions = (file) => new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      const valid = (img.width === 64 && img.height === 32) || (img.width === 128 && img.height === 64)
      if (valid) resolve({ width: img.width, height: img.height })
      else reject(`Dimensiones incorrectas (${img.width}×${img.height}px). Se requiere 64×32 o 128×64.`)
    }
    img.onerror = () => reject('Error al procesar la imagen.')
  })

  const handleArmorLayerTextureChange = async (e) => {
    const file = e.target.files[0]
    setArmorLayerTextureError('')
    if (!file) { resetArmorLayerTextureInput(); return }
    if (!file.name.toLowerCase().endsWith('.png')) {
      setArmorLayerTextureError('Solo se permiten archivos .png')
      return resetArmorLayerTextureInput()
    }
    if (file.size > 256 * 1024) {
      setArmorLayerTextureError('El archivo supera 256KB.')
      return resetArmorLayerTextureInput()
    }
    try {
      await validateArmorLayerDimensions(file)
      setArmorLayerTexture(file)
      setArmorLayerTextureUrl(URL.createObjectURL(file))
      setArmorLayerTextureBase64(await fileToBase64(file))
    } catch (err) {
      setArmorLayerTextureError(err)
      resetArmorLayerTextureInput()
    }
  }

  const handleSaveArmor = (e) => {
    e.preventDefault()
    if (!armorId) { setArmorIdError('El ID de la armadura es requerido.'); return }
    if (!armorName.trim()) { alert('El Nombre In-Game es requerido.'); return }
    if (!armorTexture && !armorTextureBase64) { setArmorTextureError('Debe subir una textura válida.'); return }
    if (blocks.some(b => b.id === armorId)) {
      setArmorIdError('Este ID ya está en uso por un bloque.')
      return
    }
    if (items.some(i => i.id === armorId)) {
      setArmorIdError('Este ID ya está en uso por un ítem.')
      return
    }
    if (armors.some(a => a.id === armorId && a.id !== editingId)) {
      setArmorIdError('Este ID ya está en uso por otra armadura.')
      return
    }

    const recipe = hasCrafting ? {
      slots: craftSlots.map(s => s || null),
      resultCount: craftResultCount,
      shapeless: craftShapeless,
      type: craftShapeless ? 'shapeless' : 'shaped',
    } : null

    const newArmor = {
      id: armorId,
      name: armorName,
      slot: armorSlot,
      textureUrl: armorTextureUrl,
      textureBase64: armorTextureBase64,
      layerTextureUrl: armorLayerTextureUrl,
      layerTextureBase64: armorLayerTextureBase64,
      defense: parseInt(armorData.defense) || 3,
      durability: parseInt(armorData.durability) || 165,
      toughness: parseFloat(armorData.toughness) || 0,
      enchantability: parseInt(armorData.enchantability) || 15,
      recipe,
      category: 'Armadura',
    }

    if (editingId) setArmors(armors.map(a => a.id === editingId ? newArmor : a))
    else setArmors([...armors, newArmor])
    resetArmorForm()
    setFormMode(null)
  }

  const handleEditArmor = (armor) => {
    setFormMode('armor')
    setEditingId(armor.id)
    setArmorId(armor.id)
    setArmorName(armor.name)
    setArmorSlot(armor.slot || 'helmet')
    setArmorTexture(null)
    setArmorTextureUrl(armor.textureUrl || '')
    setArmorTextureBase64(armor.textureBase64 || '')
    setArmorLayerTexture(null)
    setArmorLayerTextureUrl(armor.layerTextureUrl || '')
    setArmorLayerTextureBase64(armor.layerTextureBase64 || '')
    setArmorLayerTextureError('')
    setArmorData({
      slot: armor.slot || 'helmet',
      defense: String(armor.defense || 3),
      durability: String(armor.durability || 165),
      toughness: String(armor.toughness || 0),
      enchantability: String(armor.enchantability || 15),
    })

    if (armor.recipe) {
      setHasCrafting(true)
      setCraftSlots(armor.recipe.slots || defaultCraftSlots())
      setCraftResultCount(armor.recipe.resultCount || 1)
      setCraftShapeless(armor.recipe.shapeless || false)
    } else {
      setHasCrafting(false)
      setCraftSlots(defaultCraftSlots())
      setCraftResultCount(1)
      setCraftShapeless(false)
    }
  }


  const handleEditItem = (item) => {
    setFormMode('item')
    setEditingId(item.id)
    setItemId(item.id)
    setItemName(item.name)
    setItemTexture(null)
    setTextureUrl(item.textureUrl)
    setTextureBase64(item.textureBase64)
    setStackSize(String(item.stackSize))
    setCategory(item.category)
    setImmuneToLava(item.immuneToLava || false)
    setEnchantedGlow(item.enchantedGlow || false)
    setUseSound(item.sound || '')

    if (item.category === 'Herramienta/Arma') {
      setToolData({
        toolType: item.toolType || 'Espada',
        material: item.material || 'Hierro',
        attackDamage: item.attackDamage != null ? String(item.attackDamage) : '',
        attackSpeed: item.attackSpeed != null ? String(item.attackSpeed) : '',
        durability: item.durability != null ? String(item.durability) : '',
        effects: item.effects || [],
        holderEffects: item.holderEffects || [],
      })
    } else if (item.category === 'Comida') {
      setFoodData({
        nutrition: item.nutrition != null ? String(item.nutrition) : '',
        saturation: item.saturation != null ? String(item.saturation) : '',
        alwaysEdible: item.alwaysEdible || false,
        wolfFood: item.wolfFood || false,
        effects: item.effects || [],
      })
    } else if (item.category === 'Arrojadizo') {
      setThrowableData({
        cooldownTicks: item.cooldownTicks != null ? String(item.cooldownTicks) : '20',
        throwForce: item.throwForce != null ? String(item.throwForce) : '1.5',
        throwSound: item.throwSound || 'entity.snowball.throw',
        impactSound: item.impactSound || 'block.glass.break',
        effects: item.effects || [],
      })
    }

    if (item.recipe) {
      setHasCrafting(true)
      setCraftSlots(item.recipe.slots || defaultCraftSlots())
      setCraftResultCount(item.recipe.resultCount || 1)
      setCraftShapeless(item.recipe.shapeless || false)
    } else {
      setHasCrafting(false)
      setCraftSlots(defaultCraftSlots())
      setCraftResultCount(1)
      setCraftShapeless(false)
    }
  }

  const handleEditBlock = (block) => {
    setFormMode('block')
    setEditingId(block.id)
    setBlockId(block.id)
    setBlockName(block.name)
    setBlockTexture(null)
    setBlockTextureUrl(block.textureUrl || '')
    setBlockTextureBase64(block.textureBase64 || '')
    setHasGravity(block.hasGravity || false)
    setExplosionResistant(block.explosionResistant || false)
    setBlockLuminance(String(block.luminance || '0'))
    setBlockDropType(block.dropType || 'self')
    setBlockCustomDrop(block.customDrop || '')
    setBlockTool(block.requiredTool || 'none')
    setBlockHardness(String(block.hardness || '2.0'))
    setIsTransparent(block.isTransparent || false)
    setSoundGroup(block.soundGroup || 'STONE')
    setIsFlammable(block.isFlammable || false)
    setBurnChance(String(block.burnChance || '20'))
    setSpreadChance(String(block.spreadChance || '5'))
    setMiningTier(block.miningTier || 'none')
    setSilkTouch(block.silkTouch || false)
    setBlockShape(block.blockShape || 'block')
    setSlabTextureMode(block.slabTextureMode || 'uniform')
    setSlabTopTextureUrl(block.slabTopTextureUrl || '')
    setSlabTopTextureBase64(block.slabTopTextureBase64 || '')
    setSlabSideTextureUrl(block.slabSideTextureUrl || '')
    setSlabSideTextureBase64(block.slabSideTextureBase64 || '')

    setDealsDamage(block.dealsDamage || false)
    setNoCollision(block.noCollision || false)
    setCancelsFallDamage(block.cancelsFallDamage || false)
    setFallDamageModifier(String(block.fallDamageModifier ?? '0.0'))
    setHasBounce(block.hasBounce || false)
    setBounceVelocity(String(block.bounceVelocity ?? '0.8'))

    setFaceUpTextureUrl(block.faceUpTextureUrl || '')
    setFaceUpTextureBase64(block.faceUpTextureBase64 || '')
    setFaceDownTextureUrl(block.faceDownTextureUrl || '')
    setFaceDownTextureBase64(block.faceDownTextureBase64 || '')
    setFaceNorthTextureUrl(block.faceNorthTextureUrl || '')
    setFaceNorthTextureBase64(block.faceNorthTextureBase64 || '')
    setFaceSouthTextureUrl(block.faceSouthTextureUrl || '')
    setFaceSouthTextureBase64(block.faceSouthTextureBase64 || '')
    setFaceEastTextureUrl(block.faceEastTextureUrl || '')
    setFaceEastTextureBase64(block.faceEastTextureBase64 || '')
    setFaceWestTextureUrl(block.faceWestTextureUrl || '')
    setFaceWestTextureBase64(block.faceWestTextureBase64 || '')

    if (block.recipe) {
      setHasCrafting(true)
      setCraftSlots(block.recipe.slots || defaultCraftSlots())
      setCraftResultCount(block.recipe.resultCount || 1)
      setCraftShapeless(block.recipe.shapeless || false)
    } else {
      setHasCrafting(false)
      setCraftSlots(defaultCraftSlots())
      setCraftResultCount(1)
      setCraftShapeless(false)
    }
  }

  const handleDownloadMod = () => {
    if ((!items.length && !blocks.length && !armors.length) || !modName.trim() || !modId.trim() || modIdError) return
    generateModZip(items, { name: modName, id: modId, tabIconBase64: modTabIconBase64 }, blocks, armors)
  }

  const closeForm = () => {
    setFormMode(null)
    resetForm()
    resetBlockForm()
    resetArmorForm()
  }

  const totalEntries = items.length + blocks.length + armors.length

  const categoryBadgeColor = (cat) => {
    if (cat === 'Herramienta/Arma') return 'text-sky-400 bg-sky-950/60'
    if (cat === 'Comida') return 'text-amber-400 bg-amber-950/60'
    if (cat === 'Arrojadizo') return 'text-rose-400 bg-rose-950/60'
    if (cat === 'Armadura') return 'text-purple-400 bg-purple-950/60'
    return 'text-mc-gold bg-mc-slot'
  }

  return {
    items, setItems, blocks, setBlocks, armors, setArmors, formMode, setFormMode, editingId, setEditingId,
    itemId, setItemId, itemName, setItemName, itemTexture, setItemTexture, textureUrl, setTextureUrl, textureBase64, setTextureBase64, stackSize, setStackSize, category, setCategory,
    immuneToLava, setImmuneToLava, enchantedGlow, setEnchantedGlow,
    // Armor fields & methods
    armorId, setArmorId, armorName, setArmorName, armorSlot, setArmorSlot,
    armorTexture, setArmorTexture, armorTextureUrl, setArmorTextureUrl, armorTextureBase64, setArmorTextureBase64,
    armorLayerTexture, setArmorLayerTexture, armorLayerTextureUrl, setArmorLayerTextureUrl,
    armorLayerTextureBase64, setArmorLayerTextureBase64, armorLayerTextureError, armorLayerFileInputRef,
    handleArmorLayerTextureChange,
    armorData, setArmorData, armorIdError, setArmorIdError, armorTextureError, setArmorTextureError, armorFileInputRef,
    handleArmorIdChange, handleArmorTextureChange, handleSaveArmor, handleDeleteArmor, handleEditArmor, resetArmorForm,
    blockId, setBlockId, blockName, setBlockName, blockTexture, setBlockTexture, blockTextureUrl, setBlockTextureUrl, blockTextureBase64, setBlockTextureBase64,
    hasGravity, setHasGravity, explosionResistant, setExplosionResistant, dealsDamage, setDealsDamage,
    cancelsFallDamage, setCancelsFallDamage, fallDamageModifier, setFallDamageModifier,
    hasBounce, setHasBounce, bounceVelocity, setBounceVelocity,
    noCollision, setNoCollision,
    blockLuminance, setBlockLuminance, blockDropType, setBlockDropType, blockCustomDrop, setBlockCustomDrop,
    blockTool, setBlockTool, blockHardness, setBlockHardness, isTransparent, setIsTransparent,
    soundGroup, setSoundGroup, isFlammable, setIsFlammable,
    burnChance, setBurnChance, spreadChance, setSpreadChance, miningTier, setMiningTier, silkTouch, setSilkTouch,
    blockShape, setBlockShape, slabTextureMode, setSlabTextureMode,
    slabTopTexture, setSlabTopTexture, slabTopTextureUrl, setSlabTopTextureUrl, slabTopTextureBase64, setSlabTopTextureBase64,
    slabSideTexture, setSlabSideTexture, slabSideTextureUrl, setSlabSideTextureUrl, slabSideTextureBase64, setSlabSideTextureBase64,
    // 6 faces fields
    faceUpTexture, setFaceUpTexture, faceUpTextureUrl, setFaceUpTextureUrl, faceUpTextureBase64, setFaceUpTextureBase64,
    faceDownTexture, setFaceDownTexture, faceDownTextureUrl, setFaceDownTextureUrl, faceDownTextureBase64, setFaceDownTextureBase64,
    faceNorthTexture, setFaceNorthTexture, faceNorthTextureUrl, setFaceNorthTextureUrl, faceNorthTextureBase64, setFaceNorthTextureBase64,
    faceSouthTexture, setFaceSouthTexture, faceSouthTextureUrl, setFaceSouthTextureUrl, faceSouthTextureBase64, setFaceSouthTextureBase64,
    faceEastTexture, setFaceEastTexture, faceEastTextureUrl, setFaceEastTextureUrl, faceEastTextureBase64, setFaceEastTextureBase64,
    faceWestTexture, setFaceWestTexture, faceWestTextureUrl, setFaceWestTextureUrl, faceWestTextureBase64, setFaceWestTextureBase64,
    blockIdError, setBlockIdError, blockTextureError, setBlockTextureError,
    blockFileInputRef, slabTopFileInputRef, slabSideFileInputRef,
    faceUpFileInputRef, faceDownFileInputRef, faceNorthFileInputRef, faceSouthFileInputRef, faceEastFileInputRef, faceWestFileInputRef,
    toolData, setToolData, foodData, setFoodData, throwableData, setThrowableData,
    hasCrafting, setHasCrafting, craftSlots, setCraftSlots,
    craftResultCount, setCraftResultCount, craftShapeless, setCraftShapeless,
    useSound, setUseSound,
    modName, setModName, modId, setModId, modIdError, setModIdError,
    modTabIcon, setModTabIcon, modTabIconUrl, setModTabIconUrl, modTabIconBase64, setModTabIconBase64, modTabIconError, setModTabIconError, modTabIconInputRef,
    textureError, setTextureError, idError, setIdError, fileInputRef,
    handleIdChange, handleModIdChange, handleBlockIdChange, handleCategoryChange,
    handleTextureChange, handleBlockTextureChange, handleSlabTextureChange, handleFaceTextureChange, handleModTabIconChange,
    handleSaveItem, handleSaveBlock, handleDeleteItem, handleDeleteBlock,
    handleEditItem, handleEditBlock, handleDownloadMod, closeForm,
    totalEntries, categoryBadgeColor,
  }
}

