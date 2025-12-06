"use client";

/**
 * AnimatedText component
 *
 * This component displays a large heading with a moving background image clipped
 * to the text. The background slides horizontally to create a subtle animation
 * effect, inspired by a CSS trick where the text itself reveals the image
 * underneath. It defaults to showing the site name "8JJCRICKET".
 */
export default function AnimatedText({
  text = "8JJCRICKET",
}: {
  /**
   * The text to display inside the animation. If not provided it defaults
   * to "8JJCRICKET".
   */
  text?: string;
}) {
  return (
    <h2 className="animated-text">
      {text}
    </h2>
  );
}