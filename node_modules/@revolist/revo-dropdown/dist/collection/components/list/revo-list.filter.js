import { h } from "@stencil/core";
import { getItemLabel } from "../../utils/item.helpers";
function doFilter(p, val) {
    var _a;
    let newSource = [];
    const filterValue = (_a = val === null || val === void 0 ? void 0 : val.trim()) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase();
    if (!filterValue) {
        newSource = p.source;
    }
    else {
        for (let item of p.source) {
            let val = getItemLabel(item, p.dataLabel);
            if (typeof val === 'string') {
                val = val.toLocaleLowerCase();
                switch (p.filter) {
                    case 'start':
                        if (val.indexOf(filterValue) === 0) {
                            newSource.push(item);
                        }
                        break;
                    default:
                        if (val.indexOf(filterValue) > -1) {
                            newSource.push(item);
                        }
                        break;
                }
            }
        }
    }
    return newSource;
}
export const DropdownListFilter = (p) => {
    const filterChange = (value) => {
        const items = doFilter(p, value);
        p.onFilterChange({ value, items });
    };
    if (!p.filter) {
        p.filter = 'contains';
    }
    filterChange(p.filterValue);
    if (p.autocomplete) {
        p.value = p.filterValue;
    }
    return (h("input", Object.assign({ class: { 'filter-box': true, }, type: "text" }, p, { onClick: e => {
            e.preventDefault();
            p.onClick && p.onClick(e);
        }, onInput: e => {
            var _a;
            p.onInput && p.onInput();
            const value = (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.value;
            filterChange(value);
        } })));
};
//# sourceMappingURL=revo-list.filter.js.map
