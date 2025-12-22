interface Window {
  electronAPI: {
    openFile: () => Promise<string | undefined>
  }
}
