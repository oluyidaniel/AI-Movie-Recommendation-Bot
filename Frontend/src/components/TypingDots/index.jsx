const TypingDots = () => (
  <div style={{ display: "flex", gap: 5, padding: "2px 0" }}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#c9a84c", display: "inline-block",
          animation: `dot 1.3s ease-in-out ${i * 0.18}s infinite`,
        }}
      />
    ))}
  </div>
);

export default TypingDots;
