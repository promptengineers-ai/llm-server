export function getHighlighter(languages: any, item: string) {
    const language = languages.find((language: { key: string, name: string, highlighter: string, ext: string }) => language.key === item);
    return language ? language.key : null;
}
  
export function getFileExtension(languages: any, filename: string) {
    if (filename === 'Dockerfile') {
        return 'dockerfile'
    } else {
        const ext = filename.split('.')
        const language = languages.find((language: { key: string, name: string, highlighter: string, ext: string }) => language.ext === ext[1]);
        return language ? language.key : null;
    }
}