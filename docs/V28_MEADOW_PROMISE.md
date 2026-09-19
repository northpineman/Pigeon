# Iggy Meadow v28 — The Meadow Promise

This release establishes the game's family-friendly design contract in both code and UI.

## Added
- Optional Gentle Guide (enabled by default) that gives one clear, contextual next step without hiding advanced systems.
- The Meadow Promise on the home screen: breaks are safe, mistakes are repairable, kindness matters, and spooky content stays cozy/family-friendly.
- Guidance routes players toward adoption, care, collecting kennel income, claiming a completed task, or exploration.
- Guidance state persists in the existing `flags` JSON, so no database migration is required.

## Design boundary
The guide is advisory, not a restricted/kids mode. Experienced players retain access to the full game. It does not collect age or child-profile information.
