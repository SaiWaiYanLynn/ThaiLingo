# Decisions

Changes from the original build specification, and the reason for each.

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-11-12 | Audio uses the iPhone's Thai text-to-speech voice (`expo-speech`) instead of recordings. There is no `assets/audio/` folder and no audio map. | The team has no native Thai speaker to record audio. |
| 2026-11-12 | Phrases are cross-checked with two trusted sources instead of a native Thai reviewer. | No native Thai speaker is available. |
| 2026-11-12 | The app targets iPhone only and runs in Expo Go from a QR code. No APK, no store release. | Both test phones are iPhones (iPhone 15, iPhone 12 Pro Max). |
| 2026-11-12 | Routes live in `src/app/`, not `app/`. | This is the layout of the current Expo template (SDK 58). |
| 2026-11-12 | Bottom tabs use Expo Router native tabs. Topic, Phrase detail and Show to local are pushed on the root stack, above the tabs. | Native tabs have no header, so the root stack gives the back button and title. |
| 2026-11-12 | Icons use SF Symbols (`expo-symbols`) instead of `@expo/vector-icons`. | The app targets iPhone only, and `expo-symbols` comes with the template. |
| 2026-11-12 | English text uses the iOS system font instead of Inter. Thai uses Noto Sans Thai. | One less font to load. The system font is readable and correct for English. |
| 2026-11-12 | Cloudflare is not used in the MVP. | The proposal lists it as a later option, and its use is not decided yet. |
