# ThaiLingo

Survive Thailand in 30 phrases. ThaiLingo is an offline English-to-Thai phrasebook for iPhone, built with React Native and Expo. Team: Wai Yan Lynn and Pyae Sone.

## Run the app on your iPhone

1. Install Expo Go from the App Store.
2. Put the iPhone and the Mac on the same Wi-Fi network.
3. In this folder, run:

   ```bash
   npm install
   npx expo start
   ```

4. Scan the QR code in the terminal with the iPhone camera. The app opens in Expo Go.

If the audio is silent, turn off silent mode on the iPhone. If you see "Audio is not available", add a Thai voice in Settings > Accessibility > Spoken Content > Voices.

## Check the code

```bash
npm test            # unit and component tests (Jest)
npm run typecheck   # TypeScript strict mode
npx expo lint       # ESLint
```

## Project structure

| Folder | Content |
| --- | --- |
| `src/app/` | Screens. Each file is a route (Expo Router). |
| `src/components/` | Reusable UI: phrase row, topic card, buttons. |
| `src/context/` | Favorites, settings and speech state. |
| `src/data/` | `phrases.json` (all 30 phrases), types, helpers, validation. |
| `src/storage/` | Safe AsyncStorage read and write. |
| `src/theme/` | Design tokens and typography. |
| `__tests__/` | Jest tests. |

To change a phrase, edit `src/data/phrases.json` only. The tests check that there are 6 topics and 30 phrases.

## Requirement status

| ID | Feature | Status |
| --- | --- | --- |
| FR-01 | First-launch introduction | Built |
| FR-02 | Home grid of six topics | Built |
| FR-03 | Topic phrase list | Built |
| FR-04 | Phrase card content | Built |
| FR-05 | Audio, one phrase at a time | Built with text-to-speech |
| FR-06 | Phrase detail | Built |
| FR-07 | Show to local | Built |
| FR-08 | Favorites saved on the phone | Built |
| FR-09 | Favorites screen | Built |
| FR-10 | Search | Built |
| FR-11 | Settings | Built |
| FR-12 | Emergency numbers | Built, numbers not yet verified |
| FR-13 | Works offline | Needs a test on a real iPhone |
| FR-14 | Error handling | Built |

Nobody tested these features on a real iPhone yet.
