import createParser from './createParser';
import preset from './presets/defaults';

export const create = () => createParser(preset);
