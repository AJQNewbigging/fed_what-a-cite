function createFormInput(type, name, value) {
    var input = document.createElement("input");
    input.name = name;
    input.value = value;
    input.type = type;
    return input;
}