export function getItemLabel(item, dataLabel) {
    if (!item) {
        return '';
    }
    return dataLabel ? item[dataLabel] : item;
}
export function getItemValue(item, dataId) {
    return dataId ? item[dataId] : item;
}
//# sourceMappingURL=item.helpers.js.map
