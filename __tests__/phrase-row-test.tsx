import { fireEvent, render, screen } from '@testing-library/react-native';

import { PhraseRow } from '@/components/PhraseRow';
import { getPhrase } from '@/data/content';
import { scaledSizes } from '@/theme/typography';

const phrase = getPhrase('taxi_meter')!;

async function setup(showRomanization = true) {
  const handlers = { onOpen: jest.fn(), onPlay: jest.fn(), onToggleFavorite: jest.fn() };
  await render(
    <PhraseRow
      phrase={phrase}
      sizes={scaledSizes('normal')}
      showRomanization={showRomanization}
      playing={false}
      favorite={false}
      {...handlers}
    />,
  );
  return handlers;
}

describe('PhraseRow', () => {
  it('shows English, Thai and romanization', async () => {
    await setup();
    expect(await screen.findByText('Please use the meter')).toBeTruthy();
    expect(screen.getByText('เปิดมิเตอร์ด้วย')).toBeTruthy();
    expect(screen.getByText('poet mi-ter duai')).toBeTruthy();
  });

  it('hides romanization when the setting is off', async () => {
    await setup(false);
    await screen.findByText('Please use the meter');
    expect(screen.queryByText('poet mi-ter duai')).toBeNull();
  });

  it('calls the right handler for each tap area', async () => {
    const h = await setup();
    await fireEvent.press(await screen.findByLabelText('Play audio: Please use the meter'));
    await fireEvent.press(screen.getByLabelText('Add to favorites: Please use the meter'));
    await fireEvent.press(screen.getByTestId('phrase-open-taxi_meter'));
    expect(h.onPlay).toHaveBeenCalledTimes(1);
    expect(h.onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(h.onOpen).toHaveBeenCalledTimes(1);
  });
});
