import type { Components, JSX } from "../dist/types/components";

interface RevoDropdown extends Components.RevoDropdown, HTMLElement {}
export const RevoDropdown: {
    prototype: RevoDropdown;
    new (): RevoDropdown;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
