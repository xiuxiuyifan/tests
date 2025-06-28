export const Input = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      style={{ width: '100%', border: '1px solid' }}
    />
  );
};
