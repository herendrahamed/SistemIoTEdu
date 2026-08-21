export function EditableText({ isAdmin, value, onChange, className = "", multiline = false, rows = 3, placeholder, "data-testid": testId, as: Tag = "span" }) {
  if (!isAdmin) {
    return <Tag className={className} data-testid={testId}>{value}</Tag>;
  }
  if (multiline) {
    return (
      <textarea
        className={`admin-editable admin-editable-textarea ${className}`}
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        data-testid={testId}
      />
    );
  }
  return (
    <input
      type="text"
      className={`admin-editable admin-editable-input ${className}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      data-testid={testId}
    />
  );
}
