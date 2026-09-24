/**
 * Monaco Editor Anti-Cheating & Security Configuration
 * Disables copy, paste, cut, drag-and-drop, and context menu actions in the editor.
 */
export const handleDisableCopyPaste = (editor, monaco) => {
  if (!editor || !monaco) return;

  // Prevent keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+X, Cmd+C, Cmd+V, Cmd+X)
  editor.onKeyDown((e) => {
    const isControlOrCmd = e.ctrlKey || e.metaKey;
    if (
      isControlOrCmd &&
      (e.keyCode === monaco.KeyCode.KeyV ||
       e.keyCode === monaco.KeyCode.KeyC ||
       e.keyCode === monaco.KeyCode.KeyX)
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // Intercept DOM level events on editor container
  const domNode = editor.getDomNode();
  if (domNode) {
    const blockEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    domNode.addEventListener('paste', blockEvent, true);
    domNode.addEventListener('copy', blockEvent, true);
    domNode.addEventListener('cut', blockEvent, true);
    domNode.addEventListener('contextmenu', blockEvent, true);
    domNode.addEventListener('drop', blockEvent, true);
  }
};

export const MONACO_NO_COPY_OPTIONS = {
  fontSize: 14,
  fontFamily: 'Fira Code, monospace',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 4,
  contextmenu: false, // Disables right-click context menu (which includes copy/paste options)
};
