import { useRef, useState, type ButtonHTMLAttributes, type PointerEvent as RPointerEvent, type MouseEvent as RMouseEvent } from 'react';

/**
 * A button that can also be dragged (mouse, finger or pen) onto any element marked `data-drop="<id>"`.
 * A press without moving stays a normal tap, so every drag has a tap alternative (required by the spec).
 */
export function DragButton({
  onDropOn,
  className = '',
  style,
  onClick,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { onDropOn: (targetId: string) => void }) {
  const start = useRef<{ x: number; y: number; id: number; dragging: boolean; scrollY: number } | null>(null);
  const suppressClick = useRef(false);
  const [offset, setOffset] = useState<{ x: number; y: number } | null>(null);

  const end = () => {
    start.current = null;
    setOffset(null);
    document.body.classList.remove('is-dragging');
  };
  const onPointerDown = (e: RPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || rest.disabled) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId, dragging: false, scrollY: window.scrollY };
  };
  const onPointerMove = (e: RPointerEvent<HTMLButtonElement>) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (!s.dragging && Math.hypot(dx, dy) > 8) {
      s.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      document.body.classList.add('is-dragging'); // outlines every place you can drop
    }
    if (s.dragging) {
      // Near the top/bottom edge, scroll so a target further down/up can be reached with one finger.
      const edge = 70;
      if (e.clientY > window.innerHeight - edge) window.scrollBy(0, 14);
      else if (e.clientY < edge) window.scrollBy(0, -14);
      // Keep the item under the finger even while the page scrolls.
      setOffset({ x: dx, y: dy + (window.scrollY - s.scrollY) });
    }
  };
  const onPointerUp = (e: RPointerEvent<HTMLButtonElement>) => {
    const s = start.current;
    end();
    if (!s?.dragging) return; // a plain tap: the click handler does the work
    suppressClick.current = true;
    const self = e.currentTarget;
    const target = document
      .elementsFromPoint(e.clientX, e.clientY)
      .filter((n) => !self.contains(n))
      .map((n) => n.closest('[data-drop]'))
      .find(Boolean);
    const id = target?.getAttribute('data-drop');
    if (id) onDropOn(id);
  };
  const handleClick = (e: RMouseEvent<HTMLButtonElement>) => {
    if (suppressClick.current) {
      suppressClick.current = false; // the drag already happened; do not also count it as a tap
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      {...rest}
      className={`${className} draggable ${offset ? 'dragging' : ''}`}
      style={{ ...style, touchAction: 'none', ...(offset ? { transform: `translate(${offset.x}px, ${offset.y}px)` } : {}) }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={end}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
