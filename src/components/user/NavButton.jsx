function NavButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mapingo-nav-button ${active ? 'is-active' : ''}`}
    >
      {children}
    </button>
  );
}

export default NavButton;
