import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Footer, Nav, useSmoothScroll } from "./shell";
import privacy from "./content/privacy.html?raw";
import terms from "./content/terms.html?raw";
import "./styles.css";

// The published policy and terms, word for word (last updated 29 October
// 2026). Edit the text in content/; keep it in step with the app's Data
// safety form.
const page = document.body.dataset.page === "terms" ? terms : privacy;

function Legal() {
  useSmoothScroll();
  return (
    <>
      <Nav home={false} />
      <main className="legal">
        <div className="wrap">
          <article dangerouslySetInnerHTML={{ __html: page }} />
        </div>
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Legal />
  </StrictMode>,
);
