export function Message({ children, type }) {
  return (
    <div className={`message-${type}`}>
      <p>
        <b>{type}: </b>
        {children}
      </p>
    </div>
  );
}
