# Iggy Meadow Genetics & Lineage — v9

The breeding system now records an additive genetic identity for every newly bred Iggy.

## Compatibility

Legacy saves continue to work. Existing Iggies without `genetics` or `lineage` are treated as **Foundation** animals with no special inherited traits.

No SQL migration is required: these records live inside the existing `birds` JSON save payload.

## Genetic record

```js
{
  generation: 1,
  traits: ["silky"],
  mutation: null,
  speciesKey: "rock",
  colorKey: "slate"
}
```

## Lineage record

```js
{
  motherId: "...",
  fatherId: "...",
  bredAt: 1730000000000
}
```

## Current rules

- Only adult Iggies can breed.
- Parents must be opposite genders.
- Parents cannot already be nesting.
- A bred Iggy becomes generation `max(parent generations) + 1`.
- Traits can be inherited from either parent, with stronger odds when both parents carry a trait.
- Small mutation rolls can create Starlit Flecks, Moon Mark, or Meadow Kiss.
- Species and coat color continue to use the existing compatibility-safe random inheritance model.

## Why this is additive

The existing `birds` database column remains unchanged. This deliberately avoids a migration while giving the game a durable foundation for future family trees, trait discovery, collection milestones, and genetics UI.
