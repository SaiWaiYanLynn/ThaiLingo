export type TopicId = 'greetings' | 'taxi' | 'food' | 'market' | 'directions' | 'emergency';

export interface Topic {
  id: TopicId;
  name: string;
  icon: string; // SF Symbol name
  order: number;
}

export interface Phrase {
  id: string; // unique, for example 'taxi_meter'
  topicId: TopicId;
  thai: string;
  romanization: string;
  meaning: { en: string }; // keyed by language so more can be added later
  order: number;
}

export type TextSize = 'small' | 'normal' | 'large';

export interface Settings {
  showRomanization: boolean;
  textSize: TextSize;
}

export interface ContentFile {
  topics: Topic[];
  phrases: Phrase[];
}
