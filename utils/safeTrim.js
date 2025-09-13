
function safeTrim(value, defaultValue = "") {
    return typeof value === "string" ? value.trim() : defaultValue;
}

module.exports = safeTrim;
