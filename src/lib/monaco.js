/**
 * Monaco Editor Anti-Cheating & Security Configuration
 * Strictly disables copy, paste, cut, drag-and-drop, and context menu actions in the editor.
 */

export const handleDisableCopyPaste = (editor, monaco, onViolation = null) => {
  if (!editor || !monaco) return;

  const triggerViolation = (actionType) => {
    if (typeof onViolation === 'function') {
      onViolation(actionType);
    }
  };

  // 1. Override Monaco keybindings for Copy, Paste, and Cut
  try {
    // Ctrl/Cmd + V (Paste)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      triggerViolation('paste');
    });

    // Ctrl/Cmd + Shift + V (Paste)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyV, () => {
      triggerViolation('paste');
    });

    // Shift + Insert (Windows Paste)
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Insert, () => {
      triggerViolation('paste');
    });

    // Ctrl/Cmd + C (Copy)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      triggerViolation('copy');
    });

    // Ctrl/Cmd + Insert (Windows Copy)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Insert, () => {
      triggerViolation('copy');
    });

    // Ctrl/Cmd + X (Cut)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => {
      triggerViolation('cut');
    });

    // Shift + Delete (Windows Cut)
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Delete, () => {
      triggerViolation('cut');
    });
  } catch (err) {
    console.warn('Monaco command override error:', err);
  }

  // 2. Intercept and nullify Monaco internal clipboard actions
  const actionsToDisable = [
    'editor.action.clipboardPasteAction',
    'editor.action.clipboardCopyAction',
    'editor.action.clipboardCutAction',
  ];

  actionsToDisable.forEach((actionId) => {
    try {
      const action = editor.getAction(actionId);
      if (action) {
        action.run = () => {
          triggerViolation(actionId);
          return Promise.resolve();
        };
      }
    } catch (e) {}
  });

  // 3. Prevent keyboard events via Monaco's onKeyDown listener
  editor.onKeyDown((e) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;

    // Paste checks: Ctrl+V, Cmd+V, Shift+Insert
    if (
      (isCtrlOrCmd && (e.keyCode === monaco.KeyCode.KeyV || e.code === 'KeyV')) ||
      (isShift && (e.keyCode === monaco.KeyCode.Insert || e.code === 'Insert'))
    ) {
      e.preventDefault();
      e.stopPropagation();
      triggerViolation('paste');
      return;
    }

    // Copy checks: Ctrl+C, Cmd+C, Ctrl+Insert
    if (
      (isCtrlOrCmd && (e.keyCode === monaco.KeyCode.KeyC || e.code === 'KeyC')) ||
      (isCtrlOrCmd && (e.keyCode === monaco.KeyCode.Insert || e.code === 'Insert'))
    ) {
      e.preventDefault();
      e.stopPropagation();
      triggerViolation('copy');
      return;
    }

    // Cut checks: Ctrl+X, Cmd+X, Shift+Delete
    if (
      (isCtrlOrCmd && (e.keyCode === monaco.KeyCode.KeyX || e.code === 'KeyX')) ||
      (isShift && (e.keyCode === monaco.KeyCode.Delete || e.code === 'Delete'))
    ) {
      e.preventDefault();
      e.stopPropagation();
      triggerViolation('cut');
      return;
    }
  });

  // 4. Intercept DOM level events on all editor container nodes and textarea elements
  const blockDomEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    triggerViolation(e.type);
    return false;
  };

  const domNode = editor.getDomNode();
  if (domNode) {
    const events = ['paste', 'copy', 'cut', 'contextmenu', 'dragstart', 'drop'];
    events.forEach((evt) => {
      domNode.addEventListener(evt, blockDomEvent, true);
    });

    // Also attach to hidden textarea inputs inside the editor
    const textareas = domNode.querySelectorAll('textarea');
    textareas.forEach((ta) => {
      events.forEach((evt) => {
        ta.addEventListener(evt, blockDomEvent, true);
      });
    });

    // MutationObserver to attach to dynamically created textarea elements
    const observer = new MutationObserver(() => {
      const inputs = domNode.querySelectorAll('textarea');
      inputs.forEach((ta) => {
        events.forEach((evt) => {
          ta.removeEventListener(evt, blockDomEvent, true);
          ta.addEventListener(evt, blockDomEvent, true);
        });
      });
    });

    observer.observe(domNode, { childList: true, subtree: true });
  }
};

export const MONACO_NO_COPY_OPTIONS = {
  fontSize: 14,
  fontFamily: 'Fira Code, monospace',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 4,
  contextmenu: false, // Disables right-click context menu entirely
  quickSuggestions: false,
  dragAndDrop: false,
  links: false,
};
