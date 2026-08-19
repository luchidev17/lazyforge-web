/** Factories para el estado inicial de formularios y recetas. */
export const defaultToolData = () => ({
  toolType: 'Espada',
  material: 'Hierro',
  attackDamage: '',
  attackSpeed: '',
  durability: '',
  effects: [],
  holderEffects: [],
})

export const defaultFoodData = () => ({
  nutrition: '',
  saturation: '',
  alwaysEdible: false,
  wolfFood: false,
  effects: [],
})

export const defaultThrowableData = () => ({
  cooldownTicks: '20',
  throwForce: '1.5',
  throwSound: 'entity.snowball.throw',
  impactSound: 'block.glass.break',
  effects: [],
})

export const defaultCraftSlots = () => Array(9).fill(null)

export const defaultArmorData = () => ({
  slot: 'helmet', // 'helmet', 'chestplate', 'leggings', 'boots'
  defense: '3',
  durability: '165',
  toughness: '0',
  enchantability: '15',
  knockbackResistance: '0',
})

