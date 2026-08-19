
global.latestZip = null;
class JSZip {
  constructor() {
    this.files = {};
  }
  file(name, content, options) {
    this.files[name] = content;
    return this;
  }
  async generateAsync() {
    global.latestZip = this;
    return 'fake-blob';
  }
}
const saveAs = () => {};
export async function generateModZip(items, modConfig = { name: 'Mi Mod Personalizado', id: 'mimod' }) {
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
  const texturesDir = `src/main/resources/assets/${modId}/textures/item/`
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

      const itemSettings = `new Item.Settings().maxCount(${stack}).food(${foodBuilder}.build())`

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
        'Espada': { className: 'SwordItem', isProtected: false, damageType: 'float' },
        'Pico': { className: 'PickaxeItem', isProtected: true, damageType: 'int' },
        'Hacha': { className: 'AxeItem', isProtected: true, damageType: 'float' },
        'Pala': { className: 'ShovelItem', isProtected: true, damageType: 'float' },
        'Azada': { className: 'HoeItem', isProtected: true, damageType: 'int' }
      }
      const typeInfo = toolTypeClassMap[item.toolType] || { className: 'SwordItem', isProtected: false, damageType: 'float' }

      const formattedDamage = typeInfo.damageType === 'int' ? `(int)${damageModifier}` : `${damageModifier}f`
      const formattedSpeed = `${speedModifier}f`
      const settings = `new Item.Settings().maxDamage(${durability})`

      const hasOnHitEffects = item.effects && item.effects.length > 0
      const hasSound = !!item.sound

      let overrideBlock = ''

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
            if (target instanceof net.minecraft.entity.LivingEntity && attacker.getRandom().nextFloat() < ${probability}f) {
                target.addStatusEffect(new StatusEffectInstance(${effectEnum}, ${durationTicks}, ${amplifier}));
            }`
          }).join('\n')
          postHitLines += effectLines
        }

        overrideBlock = ` {
        @Override
        public boolean postHit(ItemStack stack, net.minecraft.entity.LivingEntity target, net.minecraft.entity.LivingEntity attacker) {
            ${postHitLines}
            return super.postHit(stack, target, attacker);
        }
    }`
      } else {
        overrideBlock = typeInfo.isProtected ? ' {}' : ''
      }

      itemInstance = `new ${typeInfo.className}(ToolMaterials.${mat}, ${formattedDamage}, ${formattedSpeed}, ${settings})${overrideBlock}`

    } else {
      // Misceláneo
      if (item.sound) {
        const soundEnum = `SoundEvents.${item.sound.toUpperCase().replace(/\./g, '_')}`
        itemInstance = `new Item(new Item.Settings().maxCount(${stack})) {
        @Override
        public TypedActionResult<ItemStack> use(World world, PlayerEntity user, Hand hand) {
            if (!world.isClient()) {
                world.playSound(null, user.getX(), user.getY(), user.getZ(), ${soundEnum}, SoundCategory.PLAYERS, 1.0F, 1.0F);
            }
            return TypedActionResult.success(user.getStackInHand(hand));
        }
    }`
      } else {
        itemInstance = `new Item(new Item.Settings().maxCount(${stack}))`
      }
    }

    return `    public static final Item ${uppercaseId} = Registry.register(Registries.ITEM, Identifier.of(MOD_ID, "${item.id}"), ${itemInstance});`
  }).join('\n')

  // Generate creative inventory entries categorized correctly
  const creativeTabBlocks = []

  const combatIds = items.filter(i => i.category === 'Herramienta/Arma' && i.toolType === 'Espada').map(i => i.id.toUpperCase())
  if (combatIds.length > 0) {
    creativeTabBlocks.push(`        ItemGroupEvents.modifyEntriesEvent(ItemGroups.COMBAT).register(content -> {
${combatIds.map(id => `            content.add(${id});`).join('\n')}
        });`)
  }

  const toolIds = items.filter(i => i.category === 'Herramienta/Arma' && i.toolType !== 'Espada').map(i => i.id.toUpperCase())
  if (toolIds.length > 0) {
    creativeTabBlocks.push(`        ItemGroupEvents.modifyEntriesEvent(ItemGroups.TOOLS).register(content -> {
${toolIds.map(id => `            content.add(${id});`).join('\n')}
        });`)
  }

  const foodIds = items.filter(i => i.category === 'Comida').map(i => i.id.toUpperCase())
  if (foodIds.length > 0) {
    creativeTabBlocks.push(`        ItemGroupEvents.modifyEntriesEvent(ItemGroups.FOOD_AND_DRINK).register(content -> {
${foodIds.map(id => `            content.add(${id});`).join('\n')}
        });`)
  }

  const ingredientIds = items.filter(i => i.category !== 'Comida' && i.category !== 'Herramienta/Arma').map(i => i.id.toUpperCase())
  if (ingredientIds.length > 0) {
    creativeTabBlocks.push(`        ItemGroupEvents.modifyEntriesEvent(ItemGroups.INGREDIENTS).register(content -> {
${ingredientIds.map(id => `            content.add(${id});`).join('\n')}
        });`)
  }

  const creativeTabBlock = creativeTabBlocks.length > 0 ? '\n' + creativeTabBlocks.join('\n\n') : ''

  const javaContent = `package com.${modId};

import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.itemgroup.v1.ItemGroupEvents;
import net.minecraft.component.type.FoodComponent;
import net.minecraft.entity.effect.StatusEffectInstance;
import net.minecraft.entity.effect.StatusEffects;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroups;
import net.minecraft.item.ItemStack;
import net.minecraft.item.SwordItem;
import net.minecraft.item.PickaxeItem;
import net.minecraft.item.AxeItem;
import net.minecraft.item.ShovelItem;
import net.minecraft.item.HoeItem;
import net.minecraft.item.ToolMaterials;
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

public class ${javaClassName} implements ModInitializer {
    public static final String MOD_ID = "${modId}";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

${itemDeclarations}

    @Override
    public void onInitialize() {
        LOGGER.info("¡Mod de Minecraft Inicializado por Mcraft Studio con ${items.length} ítems!");${creativeTabBlock}
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
    const modelJson = {
      parent: 'item/generated',
      textures: {
        layer0: `${modId}:item/${item.id}`
      }
    }
    zip.file(`${modelsDir}${item.id}.json`, JSON.stringify(modelJson, null, 2))

    // 3.3 Add translation key
    langData[`item.${modId}.${item.id}`] = item.name

    // 3.4 Save crafting recipe if available
    const slots = item.recipe ? (Array.isArray(item.recipe) ? item.recipe : item.recipe.slots) : null
    if (slots && slots.length === 9) {
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
        key[letter] = { item: ingredient }
      })

      // Construct recipe JSON
      const recipeJson = {
        type: 'minecraft:crafting_shaped',
        pattern,
        key,
        result: {
          id: `${modId}:${item.id}`,
          count: (item.recipe && (item.recipe.cantidad != null ? item.recipe.cantidad : item.recipe.resultCount)) || 1
        }
      }

      const recipePath = `src/main/resources/data/${modId}/recipes/${item.id}.json`
      zip.file(recipePath, JSON.stringify(recipeJson, null, 2))
    }
  })

  // 4. Save English (US) lang file
  zip.file(`${langDir}en_us.json`, JSON.stringify(langData, null, 2))

  // 4.1 Save fabric.mod.json
  const fabricModJson = {
    "schemaVersion": 1,
    "id": modId,
    "version": "1.0.0",
    "name": modConfig.name,
    "description": "Generado con Mcraft Studio",
    "authors": ["Mcraft Studio User"],
    "contact": {},
    "license": "CC0-1.0",
    "environment": "*",
    "entrypoints": {
      "main": [`com.${modId}.${javaClassName}`]
    },
    "depends": {
      "fabricloader": ">=0.15.11",
      "minecraft": "~1.21.1",
      "java": ">=21",
      "fabric-api": "*"
    }
  }
  zip.file('src/main/resources/fabric.mod.json', JSON.stringify(fabricModJson, null, 2))

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
    'gradle/wrapper/gradle-wrapper.properties'
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
