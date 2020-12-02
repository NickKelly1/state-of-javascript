
// extra safe guard used to block scripts, such as migrations, from running by accident
export const ScriptGuard = {
  canExecuteScripts: true,
  check: (): void => {
    if (!ScriptGuard.canExecuteScripts) {
      throw new Error('Critical error - cannot execute script...');
    }
  },
  setNo: () => { ScriptGuard.canExecuteScripts = false; },
  setYes: () => { ScriptGuard.canExecuteScripts = true; },
};

