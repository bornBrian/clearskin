import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Footer, LocalNav, useSmoothScroll } from "./chrome";
import privacy from "./content/privacy.html?raw";
import terms from "./content/terms.html?raw";
import deletion from "./content/delete-account.html?raw";
import "./styles.css";

// The published policy and terms, word for word (last updated 29 October
// 2026). Edit the text in content/; keep it in step with the app's Data
// safety form.
const pages: Record<string, string> = { terms, delete: deletion };
const page = pages[document.body.dataset.page ?? ""] ?? privacy;

function Legal() {
  useSmoothScroll();
  return (
    <>
      <LocalNav home={false} />
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
