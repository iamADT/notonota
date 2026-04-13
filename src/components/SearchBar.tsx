type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search-shell">
      <span className="field-label">Search names or details</span>
      <input
        className="text-input"
        placeholder="Search names or details"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

