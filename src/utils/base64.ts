import RNFetchBlob from 'react-native-blob-util';
import type { UploadedDocument } from '../screens/applyLoans/types';

const toPath = (uri: string) => {
  const withoutScheme = uri.replace(/^file:\/\//, '');
  try {
    return decodeURIComponent(withoutScheme);
  } catch {
    return withoutScheme;
  }
};

export async function readFileAsBase64(uri: string): Promise<string> {
  if (!uri) {
    return '';
  }
  try {
    const base64 = await RNFetchBlob.fs.readFile(toPath(uri), 'base64');
    return base64 ?? '';
  } catch {
    return '';
  }
}

export async function readDocumentsAsBase64(
  documents: UploadedDocument[],
): Promise<Record<string, string>> {
  const entries: Record<string, string> = {};
  for (const doc of documents) {
    entries[doc.key] = await readFileAsBase64(doc.uri);
  }
  return entries;
}
