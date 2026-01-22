import { onCleanup, onMount } from "solid-js";
import { TypebotLogo } from "./icons/TypebotLogo";

type Props = {
  botContainer: HTMLDivElement | undefined;
};

export const LiteBadge = (props: Props) => {
  let liteBadge: HTMLAnchorElement | undefined;
  let elementObserver: MutationObserver | undefined;
  let attributeObserver: MutationObserver | undefined;

  const defaultStyles = {
    display: "flex",
    opacity: "1",
    visibility: "visible",
    "pointer-events": "auto",
    transform: "none",
    "clip-path": "none",
    width: "auto",
    height: "auto",
    position: "absolute",
    padding: "4px 8px",
    "background-color": "white",
    "z-index": "50",
    "border-radius": "4px",
    color: "rgb(17 24 39)",
    gap: "8px",
    "font-size": "14px",
    "line-height": "20px",
    "font-weight": "600",
    "border-width": "1px",
    "border-color": "#cecece",
    top: "auto",
    right: "auto",
    left: "auto",
    bottom: "20px",
    transition: "background-color 0.2s ease-in-out",
    "text-decoration": "none",
  } as const;

  onMount(() => {
    if (!props.botContainer || !liteBadge) return;

    // Watch for badge removal
    elementObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const removedNode of mutation.removedNodes) {
          if (
            removedNode instanceof HTMLElement &&
            removedNode.id === "lite-badge"
          ) {
            console.log("Sorry, you can't remove the brand 😅");
            props.botContainer.append(liteBadge);
          }
        }
      }
    });

    elementObserver.observe(props.botContainer, {
      childList: true,
      subtree: true,
    });

    // Watch for attribute tampering
    attributeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (!liteBadge) return;

        if (mutation.type === "attributes") {
          switch (mutation.attributeName) {
            case "style":
              Object.assign(liteBadge.style, defaultStyles);
              break;
            case "class":
              liteBadge.className = "lite-badge";
              break;
            case "href":
              liteBadge.href = "https://chatly-landing.vercel.app";
              break;
            case "id":
              liteBadge.id = "lite-badge";
              break;
          }
        }
      }
    });

    attributeObserver.observe(liteBadge, {
      attributes: true,
      attributeFilter: ["style", "class", "href", "id"],
    });
  });

  onCleanup(() => {
    elementObserver?.disconnect();
    attributeObserver?.disconnect();
  });

  return (
    <a
      ref={(el) => (liteBadge = el)}
      href="https://chatly-landing.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      class="lite-badge"
      id="lite-badge"
      style={defaultStyles}
    >
      <TypebotLogo />
      <span>Made With Chatly</span>
    </a>
  );
};
