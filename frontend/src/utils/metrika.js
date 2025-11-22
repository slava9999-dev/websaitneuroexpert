const METRIKA_ID = 105459977;

const canTrack = () => typeof window !== 'undefined' && typeof window.ym === 'function';

export const trackGoal = (goal, params = {}) => {
  try {
    if (canTrack()) {
      window.ym(METRIKA_ID, 'reachGoal', goal, params);
    } else {
      console.debug('[Metrika] (buffered goal)', goal, params);
    }
  } catch (error) {
    console.warn('[Metrika] goal tracking failed', goal, error);
  }
};

export const sendHit = (url, title = (typeof document !== 'undefined' ? document.title : '')) => {
  try {
    if (canTrack()) {
      window.ym(METRIKA_ID, 'hit', url, { title });
    }
  } catch (error) {
    console.warn('[Metrika] hit failed', url, error);
  }
};

export const getMetrikaId = () => METRIKA_ID;
