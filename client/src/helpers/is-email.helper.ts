
/**
 * Is the value a valid email address format?
 * 
 * @see https://www.w3resource.com/javascript/form/email-validation.php
 * 
 * @param email 
 */
export const isEmail = (email: string): boolean => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);