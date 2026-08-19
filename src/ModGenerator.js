import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/** Añade .fireproof() y/o brillo encantado a una expresión Item.Settings. */
function applyItemFlags(settingsExpr, item) {
  let result = settingsExpr
  if (item.immuneToLava) {
    result += '.fireproof()'
  }
  if (item.enchantedGlow) {
    result += '.component(DataComponentTypes.ENCHANTMENT_GLINT_OVERRIDE, true)'
  }
  return result
}

/** Construye Block.Settings según gravedad, resistencia a explosiones y luminosidad. */
function buildBlockSettings(block) {
  const hardness = block.explosionResistant ? 50.0 : (block.hasGravity ? 0.5 : 2.0)
  const resistance = block.explosionResistant ? 1200.0 : (block.hasGravity ? 0.5 : 6.0)
  let settings = `Block.Settings.create().strength(${hardness}f, ${resistance}f)`
  if (block.hasGravity) {
    settings += '.sounds(BlockSoundGroup.SAND)'
  }
  const luminance = Math.min(15, Math.max(0, parseInt(block.luminance) || 0))
  if (luminance > 0) {
    settings += `.luminance(state -> ${luminance})`
  }
  if (block.noCollision) {
    settings += '.noCollision()'
  }
  return settings
}

/** Construye el JSON de receta (Shaped o Shapeless) para Minecraft 1.21.1 */
function buildRecipeJson(recipe, modId, resultId) {
  const slots = recipe ? (Array.isArray(recipe) ? recipe : recipe.slots) : null
  if (!slots || slots.length !== 9) return null

  const isShapeless = recipe.shapeless || recipe.type === 'shapeless'
  const count = (recipe.cantidad != null ? recipe.cantidad : recipe.resultCount) || 1

  if (isShapeless) {
    const ingredients = []
    slots.forEach((slot) => {
      if (slot && typeof slot === 'string' && slot.trim() !== '') {
        const ingredient = slot.trim()
        const finalIngredient = ingredient.startsWith('mod:')
          ? `${modId}:${ingredient.substring(4)}`
          : ingredient
        ingredients.push({ item: finalIngredient })
      }
    })
    if (ingredients.length === 0) return null

    return {
      type: 'minecraft:crafting_shapeless',
      ingredients,
      result: {
        id: resultId,
        count: count
      }
    }
  } else {
    const keyMap = {}
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let letterIndex = 0

    // Identify unique ingredients and assign keys
    slots.forEach((slot) => {
      if (slot && typeof slot === 'string' && slot.trim() !== '') {
        const trimmedSlot = slot.trim()
        if (!keyMap[trimmedSlot]) {
          keyMap[trimmedSlot] = alphabet[letterIndex % alphabet.length]
          letterIndex++
        }
      }
    })

    // Construct pattern of 3 rows
    const pattern = []
    for (let i = 0; i < 3; i++) {
      let row = ''
      for (let j = 0; j < 3; j++) {
        const slot = slots[i * 3 + j]
        if (slot && typeof slot === 'string' && slot.trim() !== '') {
          row += keyMap[slot.trim()]
        } else {
          row += ' '
        }
      }
      pattern.push(row)
    }

    // Construct key object
    const key = {}
    Object.entries(keyMap).forEach(([ingredient, letter]) => {
      const finalIngredient = ingredient.startsWith('mod:')
        ? `${modId}:${ingredient.substring(4)}`
        : ingredient
      key[letter] = { item: finalIngredient }
    })

    return {
      type: 'minecraft:crafting_shaped',
      pattern,
      key,
      result: {
        id: resultId,
        count: count
      }
    }
  }
}

/**
 * Generates a Fabric 1.21.1 layout ZIP for the mod items and triggers download.
 * @param {Array} items - The items in the mod cart.
 * @param {Object} modConfig - The mod custom configuration (name and id).
 * @param {Array} blocks - The blocks in the mod cart.
 */
export async function generateModZip(items, modConfig = { name: 'Mi Mod Personalizado', id: 'mimod' }, blocks = []) {
  const zip = new JSZip()
  const modId = modConfig.id

  // Generate class name: e.g. mi_mod -> MiMod
  const javaClassName = modId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  // 1. Create folders structure
  const javaDir = `src/main/java/com/${modId}/`
  const modelsDir = `src/main/resources/assets/${modId}/models/item/`
  const blockModelsDir = `src/main/resources/assets/${modId}/models/block/`
  const blockstatesDir = `src/main/resources/assets/${modId}/blockstates/`
  const texturesDir = `src/main/resources/assets/${modId}/textures/item/`
  const blockTexturesDir = `src/main/resources/assets/${modId}/textures/block/`
  const langDir = `src/main/resources/assets/${modId}/lang/`

  // 2. Generate java registry declarations
  const itemDeclarations = items.map(item => {
    const uppercaseId = item.id.toUpperCase()
    const stack = item.stackSize || 64
    let itemInstance = ''

    if (item.category === 'Comida') {
      const nutrition = item.nutrition != null ? item.nutrition : 4
      const saturation = parseFloat(item.saturation != null ? item.saturation : 0.6).toFixed(1)
      const alwaysEdible = item.alwaysEdible ? '.alwaysEdible()' : ''
      
      let foodBuilder = `new FoodComponent.Builder().nutrition(${nutrition}).saturationModifier(${saturation}f)${alwaysEdible}`
      
      if (item.effects && item.effects.length > 0) {
        item.effects.forEach(eff => {
          const effectEnum = `StatusEffects.${eff.type.toUpperCase()}`
          const durationTicks = (parseInt(eff.duration) || 10) * 20
          const amplifier = (parseInt(eff.level) || 1) - 1
          const probability = (parseFloat(eff.probability) || 100) / 100
          foodBuilder += `.statusEffect(new StatusEffectInstance(${effectEnum}, ${durationTicks}, ${amplifier}), ${probability}f)`
        })
      }

      const itemSettings = applyItemFlags(`new Item.Settings().maxCount(${stack}).food(${foodBuilder}.build())`, item)

      if (item.sound) {
        const soundEnum = `SoundEvents.${item.sound.toUpperCase().replace(/\./g, '_')}`
        itemInstance = `new Item(${itemSettings}) {
        @Override
        public SoundEvent getEatSound() {
            return ${soundEnum};
        }
    }`
      } else {
        itemInstance = `new Item(${itemSettings})`
      }

    } else if (item.category === 'Herramienta/Arma') {
      const materialMap = {
        'Madera': 'WOOD',
        'Piedra': 'STONE',
        'Hierro': 'IRON',
        'Oro': 'GOLD',
        'Diamante': 'DIAMOND',
        'Netherite': 'NETHERITE'
      }
      const mat = materialMap[item.material] || 'IRON'
      
      const materialDurabilityMap = {
        'Madera': 59,
        'Piedra': 131,
        'Hierro': 250,
        'Oro': 32,
        'Diamante': 1561,
        'Netherite': 2031
      }
      const defaultDurability = materialDurabilityMap[item.material] || 250
      const durability = item.durability !== null && item.durability !== undefined ? item.durability : defaultDurability

      const toolDefaults = {
        'Espada': { damage: 3.0, speed: 1.6 },
        'Pico': { damage: 1.0, speed: 1.2 },
        'Hacha': { damage: 5.0, speed: 1.0 },
        'Pala': { damage: 1.5, speed: 1.0 },
        'Azada': { damage: 0.0, speed: 2.0 }
      }
      const defaults = toolDefaults[item.toolType] || { damage: 3.0, speed: 1.6 }

      const damageModifier = item.attackDamage !== null && item.attackDamage !== undefined ? item.attackDamage : defaults.damage
      const attackSpeedVal = item.attackSpeed !== null && item.attackSpeed !== undefined ? item.attackSpeed : defaults.speed
      const speedModifier = attackSpeedVal - 4.0

      const toolTypeClassMap = {
        'Espada': { className: 'SwordItem', isProtected: false },
        'Pico': { className: 'PickaxeItem', isProtected: true },
        'Hacha': { className: 'AxeItem', isProtected: true },
        'Pala': { className: 'ShovelItem', isProtected: true },
        'Azada': { className: 'HoeItem', isProtected: true }
      }
      const typeInfo = toolTypeClassMap[item.toolType] || { className: 'SwordItem', isProtected: false }

      // In Yarn 1.21.1, the constructors for SwordItem, PickaxeItem, AxeItem, ShovelItem, and HoeItem
      // take exactly two arguments: (ToolMaterial material, Item.Settings settings).
      // Custom damage and speed are passed using Settings.attributeModifiers().
      const attributeModifiers = `${typeInfo.className}.createAttributeModifiers(ToolMaterials.${mat}, (int)${damageModifier}, ${speedModifier}f)`
      const settings = applyItemFlags(`new Item.Settings().maxDamage(${durability}).attributeModifiers(${attributeModifiers})`, item)

      const hasOnHitEffects = item.effects && item.effects.length > 0
      const hasSound = !!item.sound
      const hasHolderEffects = item.holderEffects && item.holderEffects.length > 0

      let overrideBlock = ''

      const overrides = []

      if (hasOnHitEffects || hasSound) {
        let postHitLines = ''
        if (hasSound) {
          const soundEnum = `SoundEvents.${item.sound.toUpperCase().replace(/\./g, '_')}`
          postHitLines += `
            attacker.getWorld().playSound(null, attacker.getX(), attacker.getY(), attacker.getZ(), ${soundEnum}, SoundCategory.PLAYERS, 1.0F, 1.0F);`
        }

        if (hasOnHitEffects) {
          const effectLines = item.effects.map(eff => {
            const effectEnum = `StatusEffects.${eff.type.toUpperCase()}`
            const durationTicks = (parseInt(eff.duration) || 10) * 20
            const amplifier = (parseInt(eff.level) || 1) - 1
            const probability = (parseFloat(eff.probability) || 100) / 100
            return `
            if (attacker.getRandom().nextFloat() < ${probability}f) {
                ((net.minecraft.entity.LivingEntity) target).addStatusEffect(new StatusEffectInstance(${effectEnum}, ${durationTicks}, ${amplifier}));
            }`
          }).join('\n')
          postHitLines += effectLines
        }

        overrides.push(`
        @Override
        public boolean postHit(ItemStack stack, net.minecraft.entity.LivingEntity target, net.minecraft.entity.LivingEntity attacker) {
            ${postHitLines}
            return super.postHit(stack, target, attacker);
        }`)
      }

      if (hasHolderEffects) {
        const holderEffectLines = item.holderEffects.map(eff => {
          const effectEnum = `StatusEffects.${eff.type.toUpperCase()}`
          const durationTicks = (parseInt(eff.duration) || 10) * 20
          const amplifier = (parseInt(eff.level) || 1) - 1
          return `
            if (user instanceof net.minecraft.entity.LivingEntity living) {
                living.addStatusEffect(new StatusEffectInstance(${effectEnum}, ${durationTicks + 10}, ${amplifier}));
            }`
        }).join('\n')

        overrides.push(`
        @Override
        public void inventoryTick(ItemStack stack, net.minecraft.world.World world, net.minecraft.entity.Entity user, int slot, boolean selected) {
            if (selected && !world.isClient()) {
                ${holderEffectLines}
            }
            super.inventoryTick(stack, world, user, slot, selected);
        }`)
      }

      if (overrides.length > 0) {
        overrideBlock = ` {\n${overrides.join('\n')}\n    }`
      } else {
        overrideBlock = typeInfo.isProtected ? ' {}' : ''
      }

      itemInstance = `new ${typeInfo.className}(ToolMaterials.${mat}, ${settings})${overrideBlock}`

    } else if (item.category === 'Arrojadizo') {
      // ── Throwable projectile ──
      const stack = item.stackSize || 16
      const throwForce = (parseFloat(item.throwForce) || 1.5).toFixed(1)
      const cooldown = parseInt(item.cooldownTicks) || 20
      const camelId = item.id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')

      let throwSoundCode = ''
      if (item.throwSound) {
        const snd = `SoundEvents.${item.throwSound.toUpperCase().replace(/\./g, '_')}`
        throwSoundCode = `world.playSound(null, user.getX(), user.getY(), user.getZ(), ${snd}, SoundCategory.PLAYERS, 0.5F, 0.4F / (world.getRandom().nextFloat() * 0.4F + 0.8F));`
      }

      const cooldownCode = cooldown > 0
        ? `user.getItemCooldownManager().set(stack.getItem(), ${cooldown});`
        : ''

      itemInstance = `new Item(${applyItemFlags(`new Item.Settings().maxCount(${stack})`, item)}) {
        @Override
        public TypedActionResult<ItemStack> use(World world, PlayerEntity user, Hand hand) {
            ItemStack stack = user.getStackInHand(hand);
            ${throwSoundCode}
            if (!world.isClient()) {
                ${camelId}Entity entity = new ${camelId}Entity(world, user);
                entity.setVelocity(user, user.getPitch(), user.getYaw(), 0.0F, ${throwForce}F, 1.0F);
                world.spawnEntity(entity);
            }
            ${cooldownCode}
            if (!user.getAbilities().creativeMode) {
                stack.decrement(1);
            }
            return TypedActionResult.success(stack, world.isClient());
        }
    }`

    } else {
      // Misceláneo
      if (item.sound) {
        const soundEnum = `SoundEvents.${item.sound.toUpperCase().replace(/\./g, '_')}`
        itemInstance = `new Item(${applyItemFlags(`new Item.Settings().maxCount(${stack})`, item)}) {
        @Override
        public TypedActionResult<ItemStack> use(World world, PlayerEntity user, Hand hand) {
            if (!world.isClient()) {
                world.playSound(null, user.getX(), user.getY(), user.getZ(), ${soundEnum}, SoundCategory.PLAYERS, 1.0F, 1.0F);
            }
            return TypedActionResult.success(user.getStackInHand(hand));
        }
    }`
      } else {
        itemInstance = `new Item(${applyItemFlags(`new Item.Settings().maxCount(${stack})`, item)})`
      }
    }

    return `    public static final Item ${uppercaseId} = Registry.register(Registries.ITEM, Identifier.of(MOD_ID, "${item.id}"), ${itemInstance});`
  }).join('\n')

  const blockDeclarations = blocks.map(block => {
    const uppercaseId = block.id.toUpperCase()
    const settings = buildBlockSettings(block)
    const blockInstance = block.blockShape === 'slab'
      ? (block.dealsDamage ? `new CustomDamageSlabBlock(${settings})` : `new SlabBlock(${settings})`)
      : block.blockShape === 'pillar'
      ? (block.dealsDamage ? `new CustomDamagePillarBlock(${settings})` : `new PillarBlock(${settings})`)
      : block.blockShape === 'stairs'
      ? (block.dealsDamage ? `new CustomDamageStairsBlock(net.minecraft.block.Blocks.STONE.getDefaultState(), ${settings})` : `new StairsBlock(net.minecraft.block.Blocks.STONE.getDefaultState(), ${settings})`)
      : block.hasGravity
      ? (block.dealsDamage ? `new CustomFallingDamageBlock(${settings})` : `new CustomFallingBlock(${settings})`)
      : (block.dealsDamage ? `new CustomDamageBlock(${settings})` : `new Block(${settings})`)

    return `    public static final Block ${uppercaseId}_BLOCK = Registry.register(
        Registries.BLOCK,
        Identifier.of(MOD_ID, "${block.id}"),
        ${blockInstance}
    );
    public static final Item ${uppercaseId}_BLOCK_ITEM = Registry.register(
        Registries.ITEM,
        Identifier.of(MOD_ID, "${block.id}"),
        new BlockItem(${uppercaseId}_BLOCK, new Item.Settings())
    );`
  }).join('\n\n')

  // Generate creative inventory entries categorized correctly into a custom creative tab
  let iconItem = 'net.minecraft.item.Items.DIAMOND'
  let tabIconDeclaration = ''

  if (modConfig.tabIconBase64) {
    tabIconDeclaration = `    public static final Item TAB_ICON_ITEM = Registry.register(
        Registries.ITEM,
        Identifier.of(MOD_ID, "tab_icon_item"),
        new Item(new Item.Settings())
    );`
    iconItem = 'TAB_ICON_ITEM'
  } else if (blocks.length > 0) {
    iconItem = `${blocks[0].id.toUpperCase()}_BLOCK_ITEM`
  } else if (items.length > 0) {
    iconItem = `${items[0].id.toUpperCase()}`
  }

  const entriesCode = [
    ...blocks.map(b => `entries.add(${b.id.toUpperCase()}_BLOCK_ITEM);`),
    ...items.map(i => `entries.add(${i.id.toUpperCase()});`)
  ].join('\n                ')

  const creativeTabBlock = `    public static final net.minecraft.registry.RegistryKey<ItemGroup> CUSTOM_ITEM_GROUP_KEY = net.minecraft.registry.RegistryKey.of(
        Registries.ITEM_GROUP.getKey(),
        Identifier.of(MOD_ID, "item_group")
    );
    public static final ItemGroup CUSTOM_ITEM_GROUP = Registry.register(
        Registries.ITEM_GROUP,
        Identifier.of(MOD_ID, "item_group"),
        net.fabricmc.fabric.api.itemgroup.v1.FabricItemGroup.builder()
            .icon(() -> new net.minecraft.item.ItemStack(${iconItem}))
            .displayName(Text.translatable("itemGroup." + MOD_ID + ".item_group"))
            .entries((displayContext, entries) -> {
                ${entriesCode || '// sin items'}
            })
            .build()
    );`

  // Conditional extra imports
  const hasBlocks = blocks.length > 0
  const hasFallingBlocks = blocks.some(b => b.hasGravity)
  const hasSlabs = blocks.some(b => b.blockShape === 'slab')
  const hasThrowable  = items.some(i => i.category === 'Arrojadizo')
  const hasToolOrWeapon = items.some(i => i.category === 'Herramienta/Arma')
  const hasFood = items.some(i => i.category === 'Comida')
  const hasEnchantedGlow = items.some(i => i.enchantedGlow)

  const extraImports = [
    hasBlocks       ? 'import net.minecraft.block.Block;' : '',
    hasFallingBlocks ? 'import net.minecraft.block.FallingBlock;' : '',
    hasFallingBlocks ? 'import net.minecraft.sound.BlockSoundGroup;' : '',
    hasSlabs        ? 'import net.minecraft.block.SlabBlock;' : '',
    hasBlocks       ? 'import net.minecraft.item.BlockItem;' : '',
    hasEnchantedGlow ? 'import net.minecraft.component.DataComponentTypes;' : '',
    hasFood         ? 'import net.minecraft.component.type.FoodComponent;' : '',
    hasThrowable    ? 'import net.minecraft.entity.EntityType;'             : '',
    hasThrowable    ? 'import net.minecraft.entity.SpawnGroup;'             : '',
    hasToolOrWeapon ? 'import net.minecraft.item.SwordItem;'                : '',
    hasToolOrWeapon ? 'import net.minecraft.item.PickaxeItem;'              : '',
    hasToolOrWeapon ? 'import net.minecraft.item.AxeItem;'                  : '',
    hasToolOrWeapon ? 'import net.minecraft.item.ShovelItem;'               : '',
    hasToolOrWeapon ? 'import net.minecraft.item.HoeItem;'                  : '',
    hasToolOrWeapon ? 'import net.minecraft.item.ToolMaterials;'            : '',
  ].filter(Boolean).join('\n')

  // Entity type declarations for throwable items
  const throwableItems = items.filter(i => i.category === 'Arrojadizo')
  const entityTypeDeclarations = throwableItems.map(item => {
    const uppercaseId = item.id.toUpperCase()
    const camelId = item.id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    return `    public static final EntityType<${camelId}Entity> ${uppercaseId}_ENTITY_TYPE = Registry.register(
        Registries.ENTITY_TYPE,
        Identifier.of(MOD_ID, "${item.id}"),
        EntityType.Builder.<${camelId}Entity>create(${camelId}Entity::new, SpawnGroup.MISC)
            .dimensions(0.25f, 0.25f)
            .build()
    );`
  }).join('\n')

  const javaContent = `package com.${modId};

import net.fabricmc.api.ModInitializer;
import net.minecraft.entity.effect.StatusEffectInstance;
import net.minecraft.entity.effect.StatusEffects;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.item.ItemGroup;
import net.minecraft.text.Text;
import net.minecraft.registry.Registry;
import net.minecraft.registry.Registries;
import net.minecraft.sound.SoundCategory;
import net.minecraft.sound.SoundEvent;
import net.minecraft.sound.SoundEvents;
import net.minecraft.util.Hand;
import net.minecraft.util.Identifier;
import net.minecraft.util.TypedActionResult;
import net.minecraft.world.World;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
${extraImports}

public class ${javaClassName} implements ModInitializer {
    public static final String MOD_ID = "${modId}";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);
${entityTypeDeclarations ? '\n' + entityTypeDeclarations + '\n' : ''}
${blockDeclarations ? blockDeclarations + '\n\n' : ''}${itemDeclarations}
${tabIconDeclaration ? '\n' + tabIconDeclaration + '\n' : ''}
${creativeTabBlock}

${hasFallingBlocks ? `
    public static class CustomFallingBlock extends FallingBlock {
        public static final com.mojang.serialization.MapCodec<CustomFallingBlock> CODEC = com.mojang.serialization.codecs.RecordCodecBuilder.mapCodec(instance -> 
            instance.group(createSettingsCodec()).apply(instance, CustomFallingBlock::new)
        );

        public CustomFallingBlock(Settings settings) {
            super(settings);
        }

        @Override
        protected com.mojang.serialization.MapCodec<? extends FallingBlock> getCodec() {
            return CODEC;
        }
    }
` : ''}
    @Override
    public void onInitialize() {
        LOGGER.info("¡Mod de Minecraft Inicializado por Lazy Forge con ${items.length} ítems y ${blocks.length} bloques!");
    }
}
`
zip.file(`${javaDir}${javaClassName}.java`, javaContent)

  // 3. Process each item
  const langData = {}

  items.forEach((item) => {
    // 3.1 Save texture PNG file
    if (item.textureBase64) {
      zip.file(`${texturesDir}${item.id}.png`, item.textureBase64, { base64: true })
    }

    // 3.2 Save item model JSON file
    const isHandheld = item.category === 'Herramienta/Arma'
    const modelJson = {
      parent: isHandheld ? 'item/handheld' : 'item/generated',
      textures: {
        layer0: `${modId}:item/${item.id}`
      }
    }
    zip.file(`${modelsDir}${item.id}.json`, JSON.stringify(modelJson, null, 2))

    // 3.3 Add translation key
    langData[`item.${modId}.${item.id}`] = item.name

    // 3.4 Save crafting recipe if available
    const recipeJson = buildRecipeJson(item.recipe, modId, `${modId}:${item.id}`)
    if (recipeJson) {
      const recipePath = `src/main/resources/data/${modId}/recipe/${item.id}.json`
      zip.file(recipePath, JSON.stringify(recipeJson, null, 2))
    }
  })

  // 3.5 Write custom creative tab icon/models and translation keys
  langData[`itemGroup.${modId}.item_group`] = modConfig.name

  if (modConfig.tabIconBase64) {
    zip.file(`${texturesDir}tab_icon_item.png`, modConfig.tabIconBase64, { base64: true })
    zip.file(`${modelsDir}tab_icon_item.json`, JSON.stringify({
      parent: 'item/generated',
      textures: {
        layer0: `${modId}:item/tab_icon_item`
      }
    }, null, 2))
    langData[`item.${modId}.tab_icon_item`] = 'Icono del Mod'
  }

  blocks.forEach((block) => {
    if (block.blockShape === 'slab') {
      // Save textures
      if (block.slabTopTextureBase64) {
        zip.file(`${blockTexturesDir}${block.id}_top.png`, block.slabTopTextureBase64, { base64: true })
      }
      if (block.slabSideTextureBase64) {
        zip.file(`${blockTexturesDir}${block.id}_side.png`, block.slabSideTextureBase64, { base64: true })
      }

      const topTexture = `${modId}:block/${block.id}_top`
      const sideTexture = `${modId}:block/${block.id}_side`

      // Slab model (bottom)
      // Slab model (bottom)
      const slabBottomModelJson = {
        parent: 'minecraft:block/block',
        textures: {
          bottom: topTexture,
          top: topTexture,
          side: sideTexture
        },
        elements: [
          {
            from: [0, 0, 0],
            to: [16, 8, 16],
            faces: {
              down:  { uv: [0, 0, 16, 16], texture: "#bottom", cullface: "down" },
              up:    { uv: [0, 0, 16, 16], texture: "#top" },
              // Se usa la mitad inferior de la textura (Y de 8 a 16)
              north: { uv: [0, 8, 16, 16], texture: "#side", cullface: "north" },
              south: { uv: [0, 8, 16, 16], texture: "#side", cullface: "south" },
              west:  { uv: [0, 8, 16, 16], texture: "#side", cullface: "west" },
              east:  { uv: [0, 8, 16, 16], texture: "#side", cullface: "east" }
            }
          }
        ]
      }
      zip.file(`${blockModelsDir}${block.id}.json`, JSON.stringify(slabBottomModelJson, null, 2))

      // Slab top model
      const slabTopModelJson = {
        parent: 'minecraft:block/block',
        textures: {
          bottom: topTexture,
          top: topTexture,
          side: sideTexture
        },
        elements: [
          {
            from: [0, 8, 0],
            to: [16, 16, 16],
            faces: {
              down:  { uv: [0, 0, 16, 16], texture: "#bottom" },
              up:    { uv: [0, 0, 16, 16], texture: "#top", cullface: "up" },
              // Se usa la mitad superior de la textura (Y de 0 a 8)
              north: { uv: [0, 0, 16, 8], texture: "#side", cullface: "north" },
              south: { uv: [0, 0, 16, 8], texture: "#side", cullface: "south" },
              west:  { uv: [0, 0, 16, 8], texture: "#side", cullface: "west" },
              east:  { uv: [0, 0, 16, 8], texture: "#side", cullface: "east" }
            }
          }
        ]
      }
      zip.file(`${blockModelsDir}${block.id}_top.json`, JSON.stringify(slabTopModelJson, null, 2))

      // Double slab model (Optimizado)
      const slabDoubleModelJson = {
        parent: 'minecraft:block/block',
        textures: {
          bottom: topTexture,
          top: topTexture,
          side: sideTexture
        },
        elements: [
          {
            // Un solo elemento que ocupa el bloque completo
            from: [0, 0, 0],
            to: [16, 16, 16],
            faces: {
              down:  { uv: [0, 0, 16, 16], texture: "#bottom", cullface: "down" },
              up:    { uv: [0, 0, 16, 16], texture: "#top", cullface: "up" },
              north: { uv: [0, 0, 16, 16], texture: "#side", cullface: "north" },
              south: { uv: [0, 0, 16, 16], texture: "#side", cullface: "south" },
              west:  { uv: [0, 0, 16, 16], texture: "#side", cullface: "west" },
              east:  { uv: [0, 0, 16, 16], texture: "#side", cullface: "east" }
            }
          }
        ]
      }
      zip.file(`${blockModelsDir}${block.id}_double.json`, JSON.stringify(slabDoubleModelJson, null, 2))
      // Blockstate JSON
      const blockstateJson = {
        variants: {
          'type=bottom': { model: `${modId}:block/${block.id}` },
          'type=top': { model: `${modId}:block/${block.id}_top` },
          'type=double': { model: `${modId}:block/${block.id}_double` }
        }
      }
      zip.file(`${blockstatesDir}${block.id}.json`, JSON.stringify(blockstateJson, null, 2))

      // Item model JSON (for slab blockitem)
      const blockItemModelJson = {
        parent: `${modId}:block/${block.id}`
      }
      zip.file(`${modelsDir}${block.id}.json`, JSON.stringify(blockItemModelJson, null, 2))

    } else if (block.blockShape === 'six_faces') {
      if (block.faceUpTextureBase64) {
        zip.file(`${blockTexturesDir}${block.id}_up.png`, block.faceUpTextureBase64, { base64: true })
      }
      if (block.faceDownTextureBase64) {
        zip.file(`${blockTexturesDir}${block.id}_down.png`, block.faceDownTextureBase64, { base64: true })
      }
      if (block.faceNorthTextureBase64) {
        zip.file(`${blockTexturesDir}${block.id}_north.png`, block.faceNorthTextureBase64, { base64: true })
      }
      if (block.faceSouthTextureBase64) {
        zip.file(`${blockTexturesDir}${block.id}_south.png`, block.faceSouthTextureBase64, { base64: true })
      }
      if (block.faceEastTextureBase64) {
        zip.file(`${blockTexturesDir}${block.id}_east.png`, block.faceEastTextureBase64, { base64: true })
      }
      if (block.faceWestTextureBase64) {
        zip.file(`${blockTexturesDir}${block.id}_west.png`, block.faceWestTextureBase64, { base64: true })
      }

      const blockModelJson = {
        parent: 'minecraft:block/cube',
        textures: {
          particle: `${modId}:block/${block.id}_north`,
          down:     `${modId}:block/${block.id}_down`,
          up:       `${modId}:block/${block.id}_up`,
          north:    `${modId}:block/${block.id}_north`,
          south:    `${modId}:block/${block.id}_south`,
          west:     `${modId}:block/${block.id}_west`,
          east:     `${modId}:block/${block.id}_east`
        }
      }
      zip.file(`${blockModelsDir}${block.id}.json`, JSON.stringify(blockModelJson, null, 2))

      const blockstateJson = {
        variants: {
          '': { model: `${modId}:block/${block.id}` }
        }
      }
      zip.file(`${blockstatesDir}${block.id}.json`, JSON.stringify(blockstateJson, null, 2))

      const blockItemModelJson = {
        parent: `${modId}:block/${block.id}`
      }
      zip.file(`${modelsDir}${block.id}.json`, JSON.stringify(blockItemModelJson, null, 2))

    } else {
      // Standard full block
      if (block.textureBase64) {
        zip.file(`${blockTexturesDir}${block.id}.png`, block.textureBase64, { base64: true })
      }

      const blockModelJson = {
        parent: 'minecraft:block/cube_all',
        textures: {
          all: `${modId}:block/${block.id}`
        }
      }
      zip.file(`${blockModelsDir}${block.id}.json`, JSON.stringify(blockModelJson, null, 2))

      const blockstateJson = {
        variants: {
          '': { model: `${modId}:block/${block.id}` }
        }
      }
      zip.file(`${blockstatesDir}${block.id}.json`, JSON.stringify(blockstateJson, null, 2))

      const blockItemModelJson = {
        parent: `${modId}:block/${block.id}`
      }
      zip.file(`${modelsDir}${block.id}.json`, JSON.stringify(blockItemModelJson, null, 2))
    }

    langData[`block.${modId}.${block.id}`] = block.name

    if (block.dropType !== 'nothing') {
      let dropItem = `${modId}:${block.id}`
      if (block.dropType === 'custom' && block.customDrop) {
        if (block.customDrop.startsWith('mod:')) {
          dropItem = `${modId}:${block.customDrop.substring(4)}`
        } else {
          dropItem = block.customDrop
        }
      }

      const lootTableJson = {
        type: 'minecraft:block',
        pools: [{
          rolls: 1,
          entries: [{
            type: 'minecraft:item',
            name: dropItem
          }]
        }]
      }
      zip.file(`src/main/resources/data/${modId}/loot_table/blocks/${block.id}.json`, JSON.stringify(lootTableJson, null, 2))
    }

    // Save block crafting recipe if available
    const recipeJson = buildRecipeJson(block.recipe, modId, `${modId}:${block.id}`)
    if (recipeJson) {
      const recipePath = `src/main/resources/data/${modId}/recipe/${block.id}.json`
      zip.file(recipePath, JSON.stringify(recipeJson, null, 2))
    }
  })
  // 4.1.3 Generate block tags for mineable tools if needed
  const pickaxeBlocks = blocks.filter(b => b.requiredTool === 'pickaxe').map(b => `${modId}:${b.id}`)
  const axeBlocks = blocks.filter(b => b.requiredTool === 'axe').map(b => `${modId}:${b.id}`)
  const shovelBlocks = blocks.filter(b => b.requiredTool === 'shovel').map(b => `${modId}:${b.id}`)

  if (pickaxeBlocks.length > 0) {
    zip.file('src/main/resources/data/minecraft/tags/block/mineable/pickaxe.json', JSON.stringify({
      replace: false,
      values: pickaxeBlocks
    }, null, 2))
  }
  if (axeBlocks.length > 0) {
    zip.file('src/main/resources/data/minecraft/tags/block/mineable/axe.json', JSON.stringify({
      replace: false,
      values: axeBlocks
    }, null, 2))
  }
  if (shovelBlocks.length > 0) {
    zip.file('src/main/resources/data/minecraft/tags/block/mineable/shovel.json', JSON.stringify({
      replace: false,
      values: shovelBlocks
    }, null, 2))
  }

  // 4. Save English (US) lang file
  zip.file(`${langDir}en_us.json`, JSON.stringify(langData, null, 2))

  // 4.1 Save fabric.mod.json
  const throwableItems2 = items.filter(i => i.category === 'Arrojadizo')
  const hasThrowable2 = throwableItems2.length > 0
  const entrypoints = { "main": [`com.${modId}.${javaClassName}`] }
  if (hasThrowable2) entrypoints["client"] = [`com.${modId}.${javaClassName}Client`]

  const fabricModJson = {
    "schemaVersion": 1,
    "id": modId,
    "version": "1.0.0",
    "name": modConfig.name,
    "description": "Generado con Lazy Forge",
    "authors": ["Lazy Forge User"],
    "contact": {},
    "license": "CC0-1.0",
    "environment": "*",
    "entrypoints": entrypoints,
    "depends": {
      "fabricloader": ">=0.15.11",
      "minecraft": "~1.21.1",
      "java": ">=21",
      "fabric-api": "*"
    }
  }
  zip.file('src/main/resources/fabric.mod.json', JSON.stringify(fabricModJson, null, 2))

  // 4.1.1 Generate entity class files for each throwable item
  throwableItems2.forEach(item => {
    const camelId = item.id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    const uppercaseId = item.id.toUpperCase()

    const impactSoundLine = item.impactSound
      ? `this.getWorld().playSound(null, this.getX(), this.getY(), this.getZ(), SoundEvents.${item.impactSound.toUpperCase().replace(/\./g, '_')}, SoundCategory.NEUTRAL, 1.0F, 1.0F);`
      : ''

    const effectLines = (item.effects || []).map(eff => {
      const effectEnum = `StatusEffects.${eff.type.toUpperCase()}`
      const durationTicks = (parseInt(eff.duration) || 10) * 20
      const amplifier = (parseInt(eff.level) || 1) - 1
      const probability = (parseFloat(eff.probability) || 100) / 100
      return `
                if (entityHit.getEntity() instanceof LivingEntity target && this.getRandom().nextFloat() < ${probability}f) {
                    target.addStatusEffect(new StatusEffectInstance(${effectEnum}, ${durationTicks}, ${amplifier}));
                }`
    }).join('\n')

    const hasEffects = (item.effects || []).length > 0

    const entityClass = `package com.${modId};

import net.minecraft.entity.EntityType;
import net.minecraft.entity.LivingEntity;
import net.minecraft.entity.effect.StatusEffectInstance;
import net.minecraft.entity.effect.StatusEffects;
import net.minecraft.entity.projectile.thrown.ThrownItemEntity;
import net.minecraft.item.Item;
import net.minecraft.sound.SoundCategory;
import net.minecraft.sound.SoundEvents;
import net.minecraft.util.hit.EntityHitResult;
import net.minecraft.util.hit.HitResult;
import net.minecraft.world.World;

public class ${camelId}Entity extends ThrownItemEntity {

    public ${camelId}Entity(EntityType<? extends ThrownItemEntity> type, World world) {
        super(type, world);
    }

    public ${camelId}Entity(World world, LivingEntity owner) {
        super(${javaClassName}.${uppercaseId}_ENTITY_TYPE, owner, world);
    }

    @Override
    protected Item getDefaultItem() {
        return ${javaClassName}.${uppercaseId};
    }

    @Override
    protected void onCollision(HitResult hitResult) {
        super.onCollision(hitResult);
        if (!this.getWorld().isClient()) {
            ${impactSoundLine}${hasEffects ? `
            if (hitResult.getType() == HitResult.Type.ENTITY) {
                EntityHitResult entityHit = (EntityHitResult) hitResult;
                ${effectLines}
            }` : ''}
        }
        this.discard();
    }
}
`
    zip.file(`${javaDir}${camelId}Entity.java`, entityClass)
  })

  // 4.1.2 Generate client initializer if there are throwable items
  if (hasThrowable2) {
    const rendererLines = throwableItems2.map(item => {
      const uppercaseId = item.id.toUpperCase()
      return `        EntityRendererRegistry.register(${javaClassName}.${uppercaseId}_ENTITY_TYPE, FlyingItemEntityRenderer::new);`
    }).join('\n')

    const clientClass = `package com.${modId};

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.rendering.v1.EntityRendererRegistry;
import net.minecraft.client.render.entity.FlyingItemEntityRenderer;

public class ${javaClassName}Client implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
${rendererLines}
    }
}
`
    zip.file(`${javaDir}${javaClassName}Client.java`, clientClass)
  }

  // 4.2 Save gradle.properties
  const gradleProperties = `org.gradle.jvmargs=-Xmx2G
minecraft_version=1.21.1
yarn_mappings=1.21.1+build.2
loader_version=0.16.2
fabric_version=0.102.0+1.21.1
mod_version=1.0.0
maven_group=com.${modId}
archives_base_name=${modId}
`
  zip.file('gradle.properties', gradleProperties)

  // 4.3 Save build.gradle
  const buildGradle = `plugins {
    id 'fabric-loom' version '1.7-SNAPSHOT'
    id 'maven-publish'
}

version = project.mod_version
group = project.maven_group

base {
    archivesName = project.archives_base_name
}

repositories {
    mavenCentral()
}

dependencies {
    minecraft "com.mojang:minecraft:\${project.minecraft_version}"
    mappings "net.fabricmc:yarn:\${project.yarn_mappings}:v2"
    modImplementation "net.fabricmc:fabric-loader:\${project.loader_version}"
    modImplementation "net.fabricmc.fabric-api:fabric-api:\${project.fabric_version}"
}

processResources {
    inputs.property "version", project.version

    filesMatching("fabric.mod.json") {
        expand "version": project.version
    }
}

tasks.withType(JavaCompile).configureEach {
    it.options.release = 21
}

java {
    withSourcesJar()
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

jar {
    from("LICENSE") {
        rename { "\${it}_\${project.archivesName.get()}"}
    }
}
`
  zip.file('build.gradle', buildGradle)

  // 4.4 Save settings.gradle
  const settingsGradle = `pluginManagement {
    repositories {
        maven {
            name = 'Fabric'
            url = 'https://maven.fabricmc.net/'
        }
        mavenCentral()
        gradlePluginPortal()
    }
}

rootProject.name = '${modId}'
`
  zip.file('settings.gradle', settingsGradle)

  // 4.5 Fetch and add Gradle Wrapper files (gradlew, gradlew.bat, and gradle/wrapper/*)
  const wrapperFiles = [
    'gradlew',
    'gradlew.bat',
    'gradle/wrapper/gradle-wrapper.jar',
    'gradle/wrapper/gradle-wrapper.properties',
    'build_mod.bat',
    'build_mod.ps1',
    'LEEME.txt'
  ]

  for (const file of wrapperFiles) {
    try {
      const response = await fetch(`/gradle-wrapper/${file}`)
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('text/html')) {
          console.warn(`Gradle Wrapper file not found at /gradle-wrapper/${file} (returned HTML). Skipping.`)
          continue
        }
        const arrayBuffer = await response.arrayBuffer()
        const textPreview = new TextDecoder().decode(new Uint8Array(arrayBuffer.slice(0, 15)))
        if (textPreview.toLowerCase().startsWith('<!doctype html') || textPreview.toLowerCase().startsWith('<html')) {
          console.warn(`Gradle Wrapper file not found at /gradle-wrapper/${file} (returned HTML structure). Skipping.`)
          continue
        }
        zip.file(file, arrayBuffer, { binary: true })
      } else {
        console.warn(`Gradle Wrapper file not found at /gradle-wrapper/${file}. Skipping.`)
      }
    } catch (err) {
      console.error(`Error loading Gradle Wrapper file ${file}:`, err)
    }
  }

  // 5. Generate zip and download
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `${modConfig.name}.zip`)
}
