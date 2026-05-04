function CoachingModeSelector({ modes, selectedModeId, onSelect }) {
  const icons = {
    vocabulary: '▣',
    grammar: '✎',
    conversation: '▤',
    mode_vocabulary: '▣',
    mode_grammar: '✎',
    mode_conversation: '▤',
    start_practice: '▶',
    show_evaluation: '✓',
    retry: '↻',
    go_map: '⌂',
  };

  return (
    <div className="coaching-mode-selector" aria-label="빠른 답장">
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          className={`coaching-mode-button ${selectedModeId === mode.id ? 'is-selected' : ''}`}
          onClick={() => onSelect(mode.id)}
        >
          <span aria-hidden="true">{icons[mode.modeId ?? mode.id] ?? '•'}</span>
          {mode.label}
        </button>
      ))}
    </div>
  );
}

export default CoachingModeSelector;
