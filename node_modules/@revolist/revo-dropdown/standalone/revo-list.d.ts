import type { Components, JSX } from "../dist/types/components";

interface RevoList extends Components.RevoList, HTMLElement {}
export const RevoList: {
    prototype: RevoList;
    new (): RevoList;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
