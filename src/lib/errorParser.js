/**
 * Compiler & Execution Error Parser for NexgenCode
 * Analyzes compiler stderr, tracebacks, test results, and runtime logs across Python, C++, Java, C, and JavaScript.
 */

export function parseExecutionError(result, language = 'python') {
  if (!result) return null;

  // Gather all potential text sources
  let rawError = '';
  let stderr = '';
  let stdout = '';
  let testErrorMessages = [];

  if (typeof result === 'string') {
    rawError = result;
  } else if (typeof result === 'object') {
    if (typeof result.error_message === 'string') rawError = result.error_message;
    if (typeof result.error === 'string') rawError = rawError ? `${rawError}\n${result.error}` : result.error;
    else if (Array.isArray(result.error)) rawError = rawError ? `${rawError}\n${result.error.map(e => e.msg || JSON.stringify(e)).join('\n')}` : result.error.map(e => e.msg || JSON.stringify(e)).join('\n');

    if (typeof result.detail === 'string') rawError = rawError ? `${rawError}\n${result.detail}` : result.detail;
    else if (Array.isArray(result.detail)) rawError = rawError ? `${rawError}\n${result.detail.map(e => e.msg || JSON.stringify(e)).join('\n')}` : result.detail.map(e => e.msg || JSON.stringify(e)).join('\n');

    if (typeof result.stderr === 'string') stderr = result.stderr;
    if (typeof result.stdout === 'string') stdout = result.stdout;
    if (typeof result.compile_output === 'string') stderr = `${stderr}\n${result.compile_output}`.trim();

    // Check individual test results
    const tests = Array.isArray(result.test_results) ? result.test_results : (Array.isArray(result.test_case_results) ? result.test_case_results : []);
    tests.forEach((t) => {
      if (t.error_message) testErrorMessages.push(t.error_message);
      if (t.stderr) testErrorMessages.push(t.stderr);
      if (t.error) testErrorMessages.push(t.error);
    });
  }

  const combinedErrors = [rawError, stderr, ...testErrorMessages].filter(Boolean).join('\n');
  const combinedText = [combinedErrors, stdout].filter(Boolean).join('\n');

  const overallStatus = result?.overall_status || result?.status;

  // If there are no error strings and overall_status is Wrong Answer
  if (!combinedErrors.trim()) {
    if (overallStatus === 'Wrong Answer') {
      return {
        errorType: 'Wrong Answer',
        line: null,
        column: null,
        message: 'Your output did not match the expected output for the test cases.',
        snippet: '',
        hint: 'Compare your actual output with the expected output in the Test Case Evaluation below. Check for unexpected spaces, newlines, or algorithm logic errors.',
        rawText: ''
      };
    }

    if (overallStatus && overallStatus !== 'Accepted') {
      return {
        errorType: overallStatus,
        line: null,
        column: null,
        message: overallStatus,
        snippet: '',
        hint: getGenericHint(overallStatus),
        rawText: ''
      };
    }

    return null;
  }

  let errorType = overallStatus || 'Runtime Error';
  let line = null;
  let column = null;
  let message = '';
  let snippet = '';
  let hint = null;

  const lang = (language || '').toLowerCase();

  // 1. Python Parser (SyntaxError, IndentationError, TabError, Tracebacks)
  if (lang.includes('python') || lang.includes('py') || combinedText.includes('File "') || combinedText.includes('IndentationError') || combinedText.includes('SyntaxError')) {
    // Check for IndentationError / TabError explicitly
    const indentMatch = combinedText.match(/File\s+["']?([^"',\n]+)["']?,\s+line\s+(\d+)(?:,\s+in\s+[^\n]+)?\n([\s\S]*?)?(IndentationError|TabError):\s*([^\n]+)/i)
      || combinedText.match(/(IndentationError|TabError):\s*([^\n]+)(?:[\s\S]*?line\s+(\d+))?/i);

    if (indentMatch) {
      errorType = indentMatch[4] || indentMatch[1] || 'IndentationError';
      line = indentMatch[2] ? parseInt(indentMatch[2], 10) : (indentMatch[3] ? parseInt(indentMatch[3], 10) : null);
      message = (indentMatch[5] || indentMatch[2] || 'unexpected indentation').trim();
      snippet = indentMatch[3]?.trim() || '';
      hint = getPythonHint(errorType, message);
    } else {
      // Check for SyntaxError
      const syntaxMatch = combinedText.match(/File\s+["']?([^"',\n]+)["']?,\s+line\s+(\d+)(?:,\s+in\s+[^\n]+)?\n([\s\S]*?)?(SyntaxError):\s*([^\n]+)/i)
        || combinedText.match(/(SyntaxError):\s*([^\n]+)(?:[\s\S]*?line\s+(\d+))?/i);

      if (syntaxMatch) {
        errorType = 'SyntaxError';
        line = syntaxMatch[2] ? parseInt(syntaxMatch[2], 10) : (syntaxMatch[3] ? parseInt(syntaxMatch[3], 10) : null);
        message = (syntaxMatch[5] || syntaxMatch[2] || 'invalid syntax').trim();
        snippet = syntaxMatch[3]?.trim() || '';
        hint = getPythonHint(errorType, message);
      } else {
        // General Python Traceback: NameError, TypeError, IndexError, KeyError, ZeroDivisionError, RecursionError, etc.
        const traceMatch = combinedText.match(/File\s+["']?([^"',\n]+)["']?,\s+line\s+(\d+)(?:,\s+in\s+([^\n]+))?\n([\s\S]*?)?([A-Za-z0-9_]+(?:Error|Exception)):\s*([^\n]+)/i);
        if (traceMatch) {
          line = parseInt(traceMatch[2], 10);
          errorType = traceMatch[5];
          message = `${traceMatch[5]}: ${traceMatch[6].trim()}`;
          snippet = traceMatch[4]?.trim() || '';
          hint = getPythonHint(errorType, traceMatch[6]);
        } else {
          // Direct Exception match
          const directExMatch = combinedText.match(/([A-Za-z0-9_]+(?:Error|Exception)):\s*([^\n]+)/i);
          if (directExMatch) {
            errorType = directExMatch[1];
            message = directExMatch[2].trim();
            hint = getPythonHint(errorType, message);
          }
        }
      }
    }
  }

  // 2. C++ & C Parser (GCC / Clang)
  if (!line && (lang.includes('cpp') || lang.includes('c++') || lang === 'c')) {
    const gccMatch = combinedText.match(/(?:[a-zA-Z0-9_\-\\/.]+)\.(?:cpp|c|cc|h):(\d+):(\d+):\s*(?:fatal )?(error|warning):\s*([^\n]+)/i);
    if (gccMatch) {
      line = parseInt(gccMatch[1], 10);
      column = parseInt(gccMatch[2], 10);
      errorType = gccMatch[3].toLowerCase() === 'warning' ? 'Compilation Warning' : 'Compilation / Syntax Error';
      message = gccMatch[4].trim();
      hint = getCppHint(message);
    } else {
      const lineOnlyMatch = combinedText.match(/(?:[a-zA-Z0-9_\-\\/.]+)\.(?:cpp|c|cc|h):(\d+):\s*(?:fatal )?(error|warning):\s*([^\n]+)/i);
      if (lineOnlyMatch) {
        line = parseInt(lineOnlyMatch[1], 10);
        errorType = 'Compilation / Syntax Error';
        message = lineOnlyMatch[3].trim();
        hint = getCppHint(message);
      }
    }
  }

  // 3. Java Parser (javac / JVM)
  if (!line && lang.includes('java')) {
    const javaMatch = combinedText.match(/(?:[a-zA-Z0-9_\-\\/.]+)\.java:(\d+):\s*error:\s*([^\n]+)/i);
    if (javaMatch) {
      line = parseInt(javaMatch[1], 10);
      errorType = 'Java Compilation Error';
      message = javaMatch[2].trim();
      hint = getJavaHint(message);
    } else {
      const javaExMatch = combinedText.match(/Exception in thread "[^"]*"\s+([a-zA-Z0-9_.]+(?:Exception|Error))(?::\s*([^\n]+))?/i);
      if (javaExMatch) {
        errorType = javaExMatch[1].split('.').pop() || 'Java Runtime Exception';
        message = javaExMatch[2] ? `${errorType}: ${javaExMatch[2].trim()}` : errorType;
        const lineMatch = combinedText.match(/at (?:[a-zA-Z0-9_.]+)\.([a-zA-Z0-9_]+)\((?:[a-zA-Z0-9_.]+)\.java:(\d+)\)/);
        if (lineMatch) line = parseInt(lineMatch[2], 10);
        hint = getJavaHint(errorType);
      }
    }
  }

  // 4. JavaScript / Node.js Parser
  if (!line && (lang.includes('javascript') || lang.includes('js') || lang.includes('node'))) {
    const jsMatch = combinedText.match(/([A-Za-z0-9_]+Error):\s*([^\n]+)/i);
    if (jsMatch) {
      errorType = jsMatch[1];
      message = jsMatch[2].trim();
      const lineCol = combinedText.match(/(?:[a-zA-Z0-9_\-\\/.]+)\.js:(\d+):(\d+)/i) || combinedText.match(/:(\d+):(\d+)\)?/);
      if (lineCol) {
        line = parseInt(lineCol[1], 10);
        column = parseInt(lineCol[2], 10);
      }
      hint = getJsHint(errorType, message);
    }
  }

  // 5. Global checks for Time Limit, Memory Limit, Segmentation Fault
  if (combinedText.toLowerCase().includes('time limit exceeded') || combinedText.toLowerCase().includes('timed out') || combinedText.toLowerCase().includes('timeout') || overallStatus === 'Time Limit Exceeded') {
    errorType = 'Time Limit Exceeded (TLE)';
    message = 'Your solution exceeded the maximum allowable execution time limit.';
    hint = 'Check for infinite loops (e.g., while condition never reaches exit) or optimize your algorithm from O(N²) to O(N log N) or O(N).';
  } else if (combinedText.toLowerCase().includes('segmentation fault') || combinedText.toLowerCase().includes('sigsegv')) {
    errorType = 'Segmentation Fault (SIGSEGV)';
    message = 'Memory access violation occurred (accessing out-of-bounds array index or null pointer).';
    hint = 'Verify array bounds, ensure indices are within [0, size - 1], and check for recursion stack overflow.';
  } else if (combinedText.toLowerCase().includes('killed') || combinedText.toLowerCase().includes('out of memory')) {
    errorType = 'Memory Limit Exceeded';
    message = 'Your solution exceeded the allowable memory limit.';
    hint = 'Avoid creating excessively large arrays or deep recursive call stacks without memoization.';
  }

  // Fallback if message is still empty
  if (!message) {
    const firstLine = (combinedErrors || stdout || '').split('\n').filter(Boolean)[0] || overallStatus || 'Execution Failed';
    message = firstLine.slice(0, 200);
  }

  return {
    errorType: errorType || 'Error',
    line,
    column,
    message,
    snippet,
    hint,
    rawText: combinedText
  };
}

function getPythonHint(errorType, msg = '') {
  const m = msg.toLowerCase();
  if (errorType === 'SyntaxError') {
    if (m.includes("expected ':'") || m.includes("invalid syntax")) {
      return "Make sure every 'if', 'else', 'elif', 'for', 'while', 'def', and 'class' line ends with a colon (:) and parentheses match.";
    }
    if (m.includes("unterminated string literal")) {
      return "Check for unclosed single or double quotes in your string literals.";
    }
    return "Check for missing colons (:), unmatched brackets (), [], {}, or misspelled keywords.";
  }
  if (errorType === 'IndentationError' || errorType === 'TabError') {
    if (m.includes('unindent does not match')) {
      return "Unindent does not match any outer indentation level. Check line indentation alignment with previous block.";
    }
    if (m.includes('expected an indented block')) {
      return "Expected an indented block after 'if', 'for', 'while', or 'def'. Add at least 4 spaces of indentation for the code inside the block.";
    }
    return "Python relies on consistent indentation. Ensure you use consistent 4-space indentation across all code blocks and do not mix tabs and spaces.";
  }
  if (errorType === 'NameError') {
    return "You are using a variable or function name that has not been defined yet or is misspelled.";
  }
  if (errorType === 'TypeError') {
    return "An operation was attempted on incompatible data types (e.g. adding an integer to a string, or indexing a non-subscriptable object).";
  }
  if (errorType === 'IndexError') {
    return "You tried to access a list or array index that does not exist (index out of range). Ensure index < len(list).";
  }
  if (errorType === 'KeyError') {
    return "The specified key does not exist in the dictionary. Consider using dict.get(key, default) or checking 'key in dict'.";
  }
  if (errorType === 'ZeroDivisionError') {
    return "Division or modulo by zero occurred. Add a check `if denominator != 0:` before division.";
  }
  if (errorType === 'RecursionError') {
    return "Maximum recursion depth exceeded. Check your recursive base case condition.";
  }
  return null;
}

function getCppHint(msg = '') {
  const m = msg.toLowerCase();
  if (m.includes("was not declared in this scope")) {
    return "Ensure you included the necessary header file (e.g. #include <iostream>, #include <vector>, #include <algorithm>) and added 'using namespace std;'.";
  }
  if (m.includes("expected ';'") || m.includes("expected declaration")) {
    return "Check for a missing semicolon (;) at the end of the previous statement or struct definition.";
  }
  if (m.includes("expected '}'") || m.includes("expected ')'")) {
    return "Check for unclosed curly braces { } or parentheses ( ).";
  }
  if (m.includes("no matching function for call")) {
    return "Check the number and types of arguments passed to the function.";
  }
  return "Verify header includes, semicolons, and variable types.";
}

function getJavaHint(msg = '') {
  const m = msg.toLowerCase();
  if (m.includes("';' expected")) {
    return "Missing semicolon (;) at the end of the statement.";
  }
  if (m.includes("cannot find symbol")) {
    return "A variable, method, or class name was not found. Check spelling, imports, and variable scope.";
  }
  if (m.includes("class main is public") || m.includes("should be declared in a file named")) {
    return "Ensure the main class name matches 'Main' or is defined as `public class Main { ... }`.";
  }
  if (m.includes("nullpointerexception")) {
    return "Attempted to access a method or property of an object that is null.";
  }
  if (m.includes("arrayindexoutofboundsexception")) {
    return "Array index is negative or greater than or equal to array.length.";
  }
  return null;
}

function getJsHint(errorType, msg = '') {
  const m = msg.toLowerCase();
  if (errorType === 'ReferenceError') {
    return "A variable was referenced before being declared or the variable name is misspelled.";
  }
  if (errorType === 'TypeError') {
    return "Attempted to call a non-function or access a property of undefined/null.";
  }
  if (errorType === 'SyntaxError') {
    return "Check for missing commas, unclosed brackets, or invalid JavaScript syntax.";
  }
  return null;
}

function getGenericHint(status) {
  if (status === 'Time Limit Exceeded') return 'Optimize your algorithm complexity (e.g., avoid O(N²) nested loops on large inputs).';
  if (status === 'Wrong Answer') return 'Check edge cases such as empty inputs, single element, negative numbers, or large values.';
  if (status === 'Runtime Error') return 'An unhandled exception occurred during program execution. Check array bounds and null checks.';
  return null;
}
