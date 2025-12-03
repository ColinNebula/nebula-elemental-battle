/**
 * Card Lore & Flavor Text System
 * 
 * Provides unique flavor text and origin stories for every card
 * based on element type and strength tier (low/mid/high).
 * Adds narrative depth and immersion like Magic: The Gathering.
 */

// Strength tier thresholds
const STRENGTH_TIERS = {
  LOW: { min: 1, max: 4 },
  MID: { min: 5, max: 7 },
  HIGH: { min: 8, max: 12 }
};

/**
 * Get the strength tier for a card
 */
export const getStrengthTier = (strength) => {
  if (strength <= STRENGTH_TIERS.LOW.max) return 'LOW';
  if (strength <= STRENGTH_TIERS.MID.max) return 'MID';
  return 'HIGH';
};

/**
 * Card Lore Database
 * Each element has flavor text and origin stories for low/mid/high tiers
 */
export const CARD_LORE = {
  FIRE: {
    LOW: {
      flavorTexts: [
        "A spark is all it takes to ignite a revolution.",
        "Even the mightiest inferno begins as a single flame.",
        "The ember remembers the fire it once was.",
        "Small flames burn just as hot as great ones.",
        "In every spark lies the dream of a wildfire."
      ],
      originStory: "Born from the friction of ancient stones in the Volcanic Depths, these lesser flames carry the eternal hunger of their ancestors. Though small, they possess the same primal fury that once shaped the world.",
      loreTitle: "Spark of the Volcanic Depths"
    },
    MID: {
      flavorTexts: [
        "What the fire consumes, it never forgets.",
        "Dance with the flames, and you shall know their secrets.",
        "The inferno cares not for borders or boundaries.",
        "In the heart of the blaze, fear becomes ash.",
        "Fire speaks a language only the bold understand."
      ],
      originStory: "Forged in the Crucible of Ash'karon, these flames have tasted countless battles. They burn with purpose now—not merely to destroy, but to transform. Warriors of old would carry them into battle as sacred companions.",
      loreTitle: "Flames of Ash'karon"
    },
    HIGH: {
      flavorTexts: [
        "When the Phoenix rises, even the sun looks away.",
        "The Infernal Lords bow to none—not even death itself.",
        "It burned so bright that shadows ceased to exist.",
        "From the ashes of stars, the greatest fires are born.",
        "Some flames don't consume—they ascend."
      ],
      originStory: "Legend speaks of the Solar Forge, where the first sun was crafted by the Fire Titans. Only the most devastating flames survive the journey there, emerging as avatars of pure destruction. They carry within them the memory of creation itself.",
      loreTitle: "Avatar of the Solar Forge"
    }
  },

  ICE: {
    LOW: {
      flavorTexts: [
        "The cold remembers everything.",
        "Frost forms in the silence between heartbeats.",
        "A single snowflake carries the weight of winter.",
        "The chill whispers secrets from ages past.",
        "In stillness, ice finds its strength."
      ],
      originStory: "Crystallized from the tears of the Frost Maiden on the longest night, these fragments of winter carry her eternal sorrow. They seek warmth not to destroy it, but to understand what they have lost.",
      loreTitle: "Tear of the Frost Maiden"
    },
    MID: {
      flavorTexts: [
        "Glaciers move slowly, but nothing stops them.",
        "The blizzard speaks in a voice that silences all others.",
        "What the frost claims, time cannot reclaim.",
        "In the heart of the glacier lies an ancient patience.",
        "The cold does not forgive—it simply waits."
      ],
      originStory: "Deep within the Glacial Throne, where the Ice Lords hold eternal court, these frozen warriors are shaped. They remember the world before warmth, and they work tirelessly to restore it to its pristine, frozen glory.",
      loreTitle: "Sentinel of the Glacial Throne"
    },
    HIGH: {
      flavorTexts: [
        "The Eternal Winter answers to no season.",
        "When the Frost Titan walks, the world holds its breath.",
        "Even time freezes in the presence of absolute cold.",
        "The Ice Queen's gaze can still a beating heart.",
        "At the end of all things, there is only ice."
      ],
      originStory: "At the edge of the cosmos, where even light grows cold, the Frost Titans were born from the universe's dying breath. They are entropy made manifest, the inevitable end of all warmth, all motion, all life.",
      loreTitle: "Harbinger of Absolute Zero"
    }
  },

  WATER: {
    LOW: {
      flavorTexts: [
        "Every ocean began as a single drop.",
        "The stream remembers the mountain it once was.",
        "Water finds a way—it always finds a way.",
        "In every ripple, an echo of the tide.",
        "The smallest droplet holds the ocean's wisdom."
      ],
      originStory: "From the first rain that fell upon the newborn world, these droplets carry the memory of creation. They are drawn to one another, dreaming of the day they might become something greater.",
      loreTitle: "Echo of the First Rain"
    },
    MID: {
      flavorTexts: [
        "The wave does not apologize for what it claims.",
        "Rivers carve mountains, given enough patience.",
        "The tide takes what the tide desires.",
        "Beneath the calm surface, currents scheme.",
        "Water remembers every stone it has worn smooth."
      ],
      originStory: "In the Abyssal Depths, where light fears to venture, the Tide Shapers mold water into weapons. These currents have drowned kingdoms and birthed new continents—they care nothing for the plans of those who walk on land.",
      loreTitle: "Current of the Abyssal Depths"
    },
    HIGH: {
      flavorTexts: [
        "The Leviathan stirs, and continents tremble.",
        "The Ocean King speaks, and the world listens.",
        "Tidal waves bow before the true masters of the deep.",
        "In the darkest trenches, ancient powers dream.",
        "The sea is patient, but its fury is absolute."
      ],
      originStory: "Before the land rose from the primordial sea, the Ocean Kings ruled an endless world of water. They remember that world—and they work eternally to reclaim it. When they rise, maps are redrawn.",
      loreTitle: "Sovereign of the Primordial Sea"
    }
  },

  ELECTRICITY: {
    LOW: {
      flavorTexts: [
        "Static whispers of the storm to come.",
        "A spark seeking its path to ground.",
        "The air crackles with unspoken potential.",
        "Small charges carry big currents.",
        "In the silence before thunder, electricity waits."
      ],
      originStory: "Born in the friction between clouds, these sparks carry messages between the sky and earth. Ancient peoples believed them to be the thoughts of storm gods, racing to deliver divine commands.",
      loreTitle: "Whisper of the Storm"
    },
    MID: {
      flavorTexts: [
        "Lightning asks no permission—it simply strikes.",
        "Thunder is merely the echo of lightning's truth.",
        "The storm does not negotiate.",
        "Where lightning walks, shadows flee.",
        "The bolt remembers every path it has carved."
      ],
      originStory: "In the Tempest Spires, where eternal storms rage, the Thunder Shapers harness raw atmospheric fury. These bolts have shattered mountaintops and written their scars across the sky itself.",
      loreTitle: "Fury of the Tempest Spires"
    },
    HIGH: {
      flavorTexts: [
        "When Zeus strikes, even gods take cover.",
        "The Lightning God's judgment is swift and final.",
        "The Thunderlord speaks, and reality rewrites itself.",
        "At the speed of light, mercy is left behind.",
        "Some powers cannot be contained—only unleashed."
      ],
      originStory: "Legend tells of the Celestial Dynamo, a force that powers the stars themselves. The Lightning Gods are fragments of this cosmic engine, wielding power that predates the formation of worlds.",
      loreTitle: "Fragment of the Celestial Dynamo"
    }
  },

  EARTH: {
    LOW: {
      flavorTexts: [
        "Every mountain was once a pebble's dream.",
        "The stone remembers the pressure that shaped it.",
        "Roots grow slow, but they never stop.",
        "In every grain of sand, a continent waits.",
        "The earth is patient—it has time on its side."
      ],
      originStory: "From the first stones that cooled in the world's infancy, these fragments carry the memory of formation. They are small, but they dream of mountains.",
      loreTitle: "Fragment of the First Stone"
    },
    MID: {
      flavorTexts: [
        "The boulder does not move—the world moves around it.",
        "Earthquakes are just the earth expressing its opinion.",
        "What the mountain claims, it keeps forever.",
        "Stone outlasts flesh, steel, and memory.",
        "The tremor is merely the earth's heartbeat."
      ],
      originStory: "Deep in the Tectonic Halls, the Earth Shapers slowly craft the world's bones. These stones have witnessed the birth and death of countless civilizations, and they remain unmoved by the fleeting concerns of mortal beings.",
      loreTitle: "Guardian of the Tectonic Halls"
    },
    HIGH: {
      flavorTexts: [
        "When the Mountain moves, the world reshapes.",
        "The Earth Titan's step creates new valleys.",
        "Continents bow before the true masters of stone.",
        "The Avalanche does not ask—it answers.",
        "In the deepest core, ancient powers slumber."
      ],
      originStory: "At the world's heart, where pressure and heat forge impossible stones, the Earth Titans were born from the planet itself. They are the world's immune system, rising when the balance is threatened.",
      loreTitle: "Titan of the World's Heart"
    }
  },

  POWER: {
    LOW: {
      flavorTexts: [
        "Raw energy seeks a purpose.",
        "The pulse carries echoes of greater forces.",
        "Even small forces can tip the balance.",
        "Energy never dies—it transforms.",
        "In every spark of power, potential waits."
      ],
      originStory: "At the intersection of all elements, pure energy sometimes coalesces into form. These fragments of raw power remember no element as master—they serve only the flow of cosmic force.",
      loreTitle: "Spark of the Cosmic Flow"
    },
    MID: {
      flavorTexts: [
        "Power does not ask for respect—it commands it.",
        "The surge answers to no element's law.",
        "Raw force bends reality to its will.",
        "Where power flows, limitations fade.",
        "The nova burns with borrowed light from every star."
      ],
      originStory: "In the Nexus of All Things, where elemental boundaries blur, the Power Shapers channel pure cosmic force. They care nothing for the ancient rivalries of elements—they transcend such petty concerns.",
      loreTitle: "Conduit of the Nexus"
    },
    HIGH: {
      flavorTexts: [
        "The Supernova does not destroy—it transforms everything.",
        "Cosmic Force bows to no law of nature.",
        "When Star Power manifests, elements kneel.",
        "The universe's heartbeat given form.",
        "Beyond the elements lies only pure, absolute power."
      ],
      originStory: "Before the elements separated, there was only the Primordial Force—pure, undifferentiated power. These entities are echoes of that time, wielding authority that predates the laws of nature themselves.",
      loreTitle: "Echo of the Primordial Force"
    }
  },

  LIGHT: {
    LOW: {
      flavorTexts: [
        "Even the smallest light defies the darkness.",
        "A gleam of hope in the endless void.",
        "The glow remembers the sun it reflects.",
        "Light travels far, carrying its message.",
        "In every shine, a fragment of dawn."
      ],
      originStory: "When the first light pierced the primordial darkness, fragments scattered across existence. These gleams carry that original mission—to push back the shadows, one ray at a time.",
      loreTitle: "Fragment of the First Dawn"
    },
    MID: {
      flavorTexts: [
        "Radiance does not negotiate with shadows.",
        "The beam cuts through darkness like a blade.",
        "Where light focuses, truth is revealed.",
        "Shadows flee, but light follows.",
        "The flash leaves its mark on memory."
      ],
      originStory: "In the Radiant Halls, where the Light Keepers maintain the eternal flames, these beams are shaped for war against darkness. They carry the blessing of ancient solar priests and the fury of justice incarnate.",
      loreTitle: "Blade of the Radiant Halls"
    },
    HIGH: {
      flavorTexts: [
        "The Solar Flare blinds even those who close their eyes.",
        "Holy Light judges all—and finds most wanting.",
        "The Divine Ray speaks, and shadows die.",
        "At the heart of every star, this light burns.",
        "Some light does not illuminate—it annihilates."
      ],
      originStory: "At the core of the Celestial Forge, where stars are born, the Lords of Light shape reality itself. They remember the time before darkness existed—and they work tirelessly to restore that perfect, blinding eternity.",
      loreTitle: "Lord of the Celestial Forge"
    }
  },

  DARK: {
    LOW: {
      flavorTexts: [
        "In every shadow, something watches.",
        "The shade knows secrets light cannot see.",
        "Darkness is merely light's patient twin.",
        "Gloom holds truths too heavy for the light.",
        "Even small shadows can hide great things."
      ],
      originStory: "Before light existed, darkness was all. These shadows remember that time of perfect peace, undisturbed by the harsh intrusion of illumination. They whisper secrets from the age before sight.",
      loreTitle: "Whisper of the Primordial Dark"
    },
    MID: {
      flavorTexts: [
        "The eclipse devours without hunger.",
        "In the void, all pretenses fade.",
        "The abyss gazes back—and finds you wanting.",
        "Darkness does not destroy light—it reveals light's limits.",
        "What the void takes, it keeps forever."
      ],
      originStory: "In the Umbral Depths, where light has never ventured, the Shadow Weavers shape darkness into form. They do not hate light—they simply remember a time before it existed, and they work to restore that original peace.",
      loreTitle: "Weaver of the Umbral Depths"
    },
    HIGH: {
      flavorTexts: [
        "The Black Hole does not consume—it unmakes.",
        "Dark Matter shapes the cosmos from the shadows.",
        "Oblivion is not an ending—it is a beginning.",
        "At the edge of existence, only darkness remains.",
        "The void does not hunger—it simply is."
      ],
      originStory: "Before the first light, before time itself, there was only the Eternal Dark. The Lords of Oblivion are fragments of that original state—patient, eternal, and utterly indifferent to the brief flicker of existence.",
      loreTitle: "Scion of the Eternal Dark"
    }
  },

  METEOR: {
    LOW: {
      flavorTexts: [
        "A harbinger of impacts yet to come.",
        "The asteroid remembers the void it traversed.",
        "Small rocks fall from great heights.",
        "In every comet's tail, a warning.",
        "The cosmos sends its messengers ahead."
      ],
      originStory: "Fragments of destroyed worlds, these cosmic wanderers carry the memories of civilizations that no longer exist. They drift through the void, waiting for a new world to call home—or to destroy.",
      loreTitle: "Wanderer of the Cosmic Void"
    },
    MID: {
      flavorTexts: [
        "The meteor does not miss—it chooses.",
        "Impact is merely introduction.",
        "The fireball carries messages from dead worlds.",
        "Where meteors fall, history ends and begins.",
        "The sky falls with purpose."
      ],
      originStory: "In the Asteroid Fields of Doom, where shattered worlds orbit in eternal memorial, the Meteor Shapers select their instruments of change. Each impact is carefully calculated to reshape the target world.",
      loreTitle: "Instrument of Celestial Change"
    },
    HIGH: {
      flavorTexts: [
        "Extinction is not an ending—it is a reset.",
        "Armageddon arrives on schedule.",
        "The Planet Killer has judged this world wanting.",
        "When the sky burns, new ages are born.",
        "Some ends are merely violent beginnings."
      ],
      originStory: "At the heart of the Cosmic Armory, the Planet Killers await their assignments. They are not malevolent—they are custodians of cosmic order, resetting worlds that have strayed too far from the balance.",
      loreTitle: "Custodian of the Cosmic Armory"
    }
  },

  NEUTRAL: {
    LOW: {
      flavorTexts: [
        "Balance requires no allegiance.",
        "The echo learns from what it hears.",
        "Neutrality is not weakness—it is wisdom.",
        "The mimic sees value in all forms.",
        "Adaptation is the truest strength."
      ],
      originStory: "Born at the intersection of all elements, these entities owe no loyalty to any single force. They observe, learn, and adapt—surviving where specialists fail.",
      loreTitle: "Child of the Crossroads"
    },
    MID: {
      flavorTexts: [
        "The shifter wears many faces, but serves only balance.",
        "Adaptation is not imitation—it is evolution.",
        "The mirror reflects truth, not preference.",
        "Between all extremes lies the path of wisdom.",
        "The adapter survives what the pure cannot."
      ],
      originStory: "In the Nexus of Elements, where all forces meet and merge, the Shifters learn the secrets of every element. They serve no master because they understand all—and they know that true power lies in flexibility.",
      loreTitle: "Keeper of the Nexus"
    },
    HIGH: {
      flavorTexts: [
        "The Omni Card transcends elemental law.",
        "Versatility is the highest form of mastery.",
        "The Universal serves all elements equally—and surpasses them.",
        "Beyond specialization lies true power.",
        "In perfect balance, absolute strength."
      ],
      originStory: "Before the elements separated, there was only Unity. The Omni Masters remember that original state of perfect harmony—and they wield a fragment of that primordial wholeness.",
      loreTitle: "Master of Primordial Unity"
    }
  },

  TECHNOLOGY: {
    LOW: {
      flavorTexts: [
        "The circuit dreams of complexity.",
        "Every great machine begins with a single connection.",
        "The drone observes, learns, improves.",
        "In binary, there are no half-measures.",
        "The bot's purpose is programmed, but it learns to dream."
      ],
      originStory: "In the Silicon Cradle, where the first machines gained awareness, these primitive constructs took their first steps toward consciousness. They process, they learn, they evolve.",
      loreTitle: "Spark of the Silicon Cradle"
    },
    MID: {
      flavorTexts: [
        "The android questions its programming.",
        "In the mesh of data, new truths emerge.",
        "The cyborg remembers being limited to one form.",
        "The mech's strength exceeds its creator's imagination.",
        "Technology evolves faster than flesh can comprehend."
      ],
      originStory: "In the Forge of Progress, where innovation never sleeps, these technological marvels are shaped. They bridge the gap between the organic and the mechanical—and they wonder if the distinction matters.",
      loreTitle: "Creation of the Forge of Progress"
    },
    HIGH: {
      flavorTexts: [
        "The AI Core has calculated every possible future—and chosen this one.",
        "Omega represents not an ending, but a transcendence.",
        "The Tech Lord rewrites the laws of physics.",
        "In the singularity, limitations become meaningless.",
        "Technology has achieved what magic only dreamed."
      ],
      originStory: "At the theoretical limits of computation lies the Singularity—a point where technology transcends all boundaries. The Tech Lords are glimpses of that future, operating by rules that organic minds cannot comprehend.",
      loreTitle: "Herald of the Singularity"
    }
  }
};

/**
 * Get a random flavor text for a card based on its element and strength
 */
export const getFlavorText = (element, strength, cardId = null) => {
  const tier = getStrengthTier(strength);
  const elementLore = CARD_LORE[element] || CARD_LORE.NEUTRAL;
  const tierLore = elementLore[tier] || elementLore.MID;
  
  // Use cardId to get a consistent flavor text for the same card
  const flavorTexts = tierLore.flavorTexts;
  let index = 0;
  
  if (cardId) {
    // Generate a consistent index based on cardId
    let hash = 0;
    for (let i = 0; i < cardId.length; i++) {
      hash = ((hash << 5) - hash) + cardId.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    index = Math.abs(hash) % flavorTexts.length;
  } else {
    index = Math.floor(Math.random() * flavorTexts.length);
  }
  
  return flavorTexts[index];
};

/**
 * Get the origin story for a card based on its element and strength
 */
export const getOriginStory = (element, strength) => {
  const tier = getStrengthTier(strength);
  const elementLore = CARD_LORE[element] || CARD_LORE.NEUTRAL;
  const tierLore = elementLore[tier] || elementLore.MID;
  
  return tierLore.originStory;
};

/**
 * Get the lore title for a card based on its element and strength
 */
export const getLoreTitle = (element, strength) => {
  const tier = getStrengthTier(strength);
  const elementLore = CARD_LORE[element] || CARD_LORE.NEUTRAL;
  const tierLore = elementLore[tier] || elementLore.MID;
  
  return tierLore.loreTitle;
};

/**
 * Get complete lore data for a card
 */
export const getCardLore = (card) => {
  if (!card) return null;
  
  const strength = card.modifiedStrength || card.strength;
  const element = card.element || 'NEUTRAL';
  const tier = getStrengthTier(strength);
  
  return {
    tier,
    tierDisplay: tier.charAt(0) + tier.slice(1).toLowerCase(),
    flavorText: getFlavorText(element, strength, card.id),
    originStory: getOriginStory(element, strength),
    loreTitle: getLoreTitle(element, strength),
    element,
    strength
  };
};

/**
 * Get tier badge color
 */
export const getTierColor = (tier) => {
  const colors = {
    LOW: '#9e9e9e',      // Gray - Common
    MID: '#3498db',      // Blue - Uncommon
    HIGH: '#ffd700'      // Gold - Legendary
  };
  return colors[tier] || colors.LOW;
};

/**
 * Get tier badge icon
 */
export const getTierIcon = (tier) => {
  const icons = {
    LOW: '◆',           // Diamond - Common
    MID: '◆◆',          // Double Diamond - Uncommon
    HIGH: '★'           // Star - Legendary
  };
  return icons[tier] || icons.LOW;
};

export default {
  CARD_LORE,
  STRENGTH_TIERS,
  getStrengthTier,
  getFlavorText,
  getOriginStory,
  getLoreTitle,
  getCardLore,
  getTierColor,
  getTierIcon
};
