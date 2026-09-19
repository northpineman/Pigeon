# Iggy Meadow Wardrobe + Appearance v11

## Direction
Iggy Meadow treats seasonal outfits as **complete themed artworks**. The wardrobe no longer encourages mixing unrelated clothing pieces together. The deeper personalization layer is the Iggy's face and inherited appearance.

## Complete outfits
Current illustrated collections:
- Peppermint Holly
- Icy Snowflake
- Apple Harvest
- Golden Harvest
- Spring Blossom
- Dogwood Charm

Each is equipped as one `full` outfit. The individual art components remain archived as source assets so the original illustration can be maintained or revised without turning the player-facing wardrobe into a mix-and-match clothing system.

Legacy single-slot items remain in the data registry for backwards compatibility, but new wardrobe UI and equip logic only expose/allow the six complete themed sets.

## Appearance collection
Appearance is stored additively on each Iggy:

```js
appearance: {
  eyeColor: "hazel",
  eyeStyle: "classic"
}
```

Eye colors: Hazel, Amber, Chestnut, Meadow Blue, Willow Green, Violet, Moon Silver, Sunlit Gold.

Eye styles: Classic, Almond, Sparkle, Dreamy, Starlit, Mystic, Heartlight.

The first five starter traits are available by default. Additional traits cost seeds. A breeding result inherits eye color/style from its parents with small mutation chances; the child's resulting traits are added to the player's appearance collection as discoveries.

## Rendering
- Procedural Iggies render the chosen eye color/style directly.
- Painted complete-outfit artwork receives a subtle eye overlay so appearance customization remains visible without breaking the illustration.
- Outfits and facial appearance are independent systems.

## Save compatibility
No schema migration is required. Appearance is stored inside the existing `birds` JSON payload, and the appearance inventory is stored inside the existing `flags` JSON payload.
