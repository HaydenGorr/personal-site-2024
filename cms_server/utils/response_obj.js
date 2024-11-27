/**
 * 
 * @param {*} data - Any data you want to include
 * @param {Number} code - The status code of the response
 * @param {String} error_msg - Error message
 */
export default function Response(data, code=200, error_msg="") {
    this.data = data;
    this.code = code;
    this.error_msg = error_msg;
}
