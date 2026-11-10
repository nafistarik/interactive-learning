/**
 * Renders content text, showing spans wrapped in backticks as inline code.
 *
 * @param props.text - The text from the lesson data.
 */
export function InlineText({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <code key={index} className="code-inline">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
