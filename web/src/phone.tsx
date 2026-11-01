import { forwardRef, type ReactNode } from "react";

/** An Android phone drawn in CSS: flat sides, thin bezel, a punch-hole camera.
 *  The screen is exactly the app's 1080×2338 recordings. */
export const Phone = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(function Phone({ children, className = "" }, ref) {
  return (
    <div className={`phone ${className}`} ref={ref}>
      <div className="phone-screen">{children}</div>
      <i className="phone-cam" aria-hidden="true" />
    </div>
  );
});

/** Frames of one recording, loaded on demand and drawn to a canvas. */
export class Frames {
  imgs: HTMLImageElement[] = [];
  started = false;
  constructor(readonly urls: string[]) {}
  load() {
    if (this.started) return;
    this.started = true;
    this.imgs = this.urls.map((u) => {
      const im = new Image();
      im.decoding = "async";
      im.src = u;
      return im;
    });
  }
  /** Draws frame i, or the nearest earlier frame that has arrived. */
  draw(ctx: CanvasRenderingContext2D, i: number) {
    for (let k = Math.round(i); k >= 0; k--) {
      const im = this.imgs[k];
      if (im?.complete && im.naturalWidth) {
        ctx.drawImage(im, 0, 0, ctx.canvas.width, ctx.canvas.height);
        return;
      }
    }
  }
}

export const seq = (name: string, n: number) => new Frames(Array.from({ length: n }, (_, i) => `seq/${name}/${String(i).padStart(3, "0")}.webp`));
