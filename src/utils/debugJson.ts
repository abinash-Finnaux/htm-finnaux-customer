import RNFetchBlob from 'react-native-blob-util';

const DEFAULT_MAX = 120;

export function redactLongStrings(
  value: unknown,
  maxLength: number = DEFAULT_MAX,
): unknown {
  if (typeof value === 'string') {
    return value.length > maxLength ? `<${value.length} chars>` : value;
  }
  if (Array.isArray(value)) {
    return value.map(item => redactLongStrings(item, maxLength));
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(
      value as Record<string, unknown>,
    )) {
      out[key] = redactLongStrings(item, maxLength);
    }
    return out;
  }
  return value;
}

export async function writeJsonFile(
  name: string,
  value: unknown,
): Promise<string | null> {
  try {
    const text = JSON.stringify(value, null, 2) ?? '';
    const path = `${RNFetchBlob.fs.dirs.DocumentDir}/${name}.json`;
    await RNFetchBlob.fs.writeFile(path, text, 'utf8');
    console.log('[writeJsonFile] saved', path);
    return path;
  } catch (error) {
    console.log('[writeJsonFile] failed', error);
    return null;
  }
}
