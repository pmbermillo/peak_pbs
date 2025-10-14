import { isDate, isValid, parse } from "date-fns";

const objFormValidator = {
  errors: {},
  default: {},
  fields: {},

  hasError(field) {
    return Boolean(this.fields[field]?.error);
  },

  setFieldProp(field, prop, value) {
    if (!this.fields[field]) this.fields[field] = {};
    this.fields[field][prop] = value;
  },

  getFieldProp(field) {
    return this.fields[field] || {};
  },

  getFieldsKeyWithError() {
    return Object.keys(this.fields).filter((key) => this.fields[key]?.error);
  },

  getFieldsValueWithError() {
    return Object.values(this.fields).filter((value) => value.error);
  },

  getErrorType(field) {
    return this.fields[field]?.error;
  },

  getError(field) {
    const errorType = this.getErrorType(field);
    const errorMsg =
      this.errors[field]?.[errorType] || this.default[errorType] || "";
    return typeof errorMsg === "function"
      ? errorMsg(field, this.fields[field])
      : errorMsg;
  },

  setError(field, type) {
    if (!this.fields[field]) this.fields[field] = {};
    this.fields[field].error = type;
  },

  addError(field, value) {
    this.default[field] = value;
  },

  removeError(field) {
    if (this.fields[field]) this.fields[field].error = "";
  },

  validateFields(objFields) {
    let hasError = false;
    for (const field in this.fields) {
      if (this.checkField(field, objFields[field])) {
        hasError = true;
      }
    }
    return hasError;
  },

  checkField(field, value) {
    if (!this.fields[field]) return false;
    this.removeError(field);
    this.setFieldProp(field, "prev", value);

    for (const [type, typeValue] of Object.entries(this.fields[field])) {
      if (this.validator(type, typeValue, field, value)) {
        if (!this.getErrorType(field)) {
          this.setError(field, type);
        }
        return true;
      }
    }
    return false;
  },

  validator(type, typeValue, field, testValue) {
    switch (type) {
      case "required":
        return typeValue === true && !testValue;
      case "numeric":
        return typeValue === true && isNaN(Number(testValue));
      case "email":
        return (
          typeValue === true && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testValue)
        );
      case "file":
        return typeValue && !this.validateFile(testValue, typeValue);
      case "pattern":
        return !new RegExp(typeValue).test(testValue);
      case "minlength":
        return testValue && (testValue + "").length < Number(typeValue);
      case "maxlength":
        return testValue && (testValue + "").length > Number(typeValue);
      case "minnumber":
        return !this.checkNumber(typeValue, testValue, field);
      case "maxnumber":
        return !this.checkNumber(typeValue, testValue, field, true);
      case "url":
        return (
          typeValue === true &&
          !/^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/[a-zA-Z0-9.-]*)*$/.test(
            testValue
          )
        );
      case "date":
        return testValue && !isDate(new Date(testValue));
      case "maxfilelength":
        return testValue && testValue.length > typeValue;
      case "minfilelength":
        return testValue && testValue.length < typeValue;
      case "maxfilesize":
        if (Array.isArray(testValue)) {
          return testValue.some((file) => file.size > typeValue * 1024 * 1024); // Convert MB to bytes
        }
        return (
          typeValue && testValue && testValue.size > typeValue * 1024 * 1024
        ); // Convert MB to bytes
      case "custom":
        return typeValue && !typeValue(testValue);
      default:
        return false;
    }
  },

  validateFile(file, constraints) {
    if (!file) return false;
    const { size, types } = constraints;
    if (size && file.size > size) return true;
    if (types && !types.includes(file.type)) return true;
    return false;
  },

  checkNumber(typeValue, testValue, field, isMax = false) {
    if (isNaN(Number(testValue))) {
      this.setError(field, "internal");
      this.addError("internal", "Number is required.");
      return true;
    }
    return isMax
      ? Number(testValue) > Number(typeValue)
      : Number(testValue) < Number(typeValue);
  },

  clearErrors() {
    Object.keys(this.fields).forEach((field) => this.removeError(field));
  },
};

export default objFormValidator;
