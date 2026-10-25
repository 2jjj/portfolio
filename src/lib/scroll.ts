import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function scrollToHash(hash: string) {
  const target = document.querySelector(hash);
  if (!(target instanceof HTMLElement)) return false;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -80 });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return true;
}
