'use strict'

/*
 * Generates a validation function for a given fields object
 * @param {Object} fields - Object where each key may have the 'required' property and an
 * optional 'validate' property
 * @returns {Function} Validation function
 */
exports.fieldValidation = function (fields) {
    var requiredFields = {}
    for (var key in fields) {
        if (fields[key].required) {
            requiredFields[key] = {validate: fields[key].validate}
        }
    }

    // returns an error string
    return function(queryParams) {
        var err = ''
        for (var key in requiredFields) {
            if (key in queryParams) {
                var validate  = requiredFields[key].validate
                if (validate && !validate(queryParams[key])) {
                    err = err.concat('Validation failed for field ' + key + ':')
                }
            } else {
                err = err.concat('Missing required field ' + key + ':')
            }
        }
        return err;
    }
};