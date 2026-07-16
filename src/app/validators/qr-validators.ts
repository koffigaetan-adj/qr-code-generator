import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const URL_PATTERN = /^([a-z][a-z0-9+.-]*:\/\/)?[^\s]+\.[^\s]{2,}$/i;
const PHONE_PATTERN = /^[+\d][\d\s().-]{5,}$/;

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').trim();
    if (!value) return null;
    return URL_PATTERN.test(value) ? null : { pattern: true };
  };
}

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').trim();
    if (!value) return null;
    return PHONE_PATTERN.test(value) ? null : { phone: true };
  };
}

export function vcardAtLeastOneValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const lastName = (group.get('lastName')?.value ?? '').trim();
    const firstName = (group.get('firstName')?.value ?? '').trim();
    const phone = (group.get('phone')?.value ?? '').trim();
    return lastName || firstName || phone ? null : { atLeastOne: true };
  };
}

export function wifiPasswordValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const encryption = group.get('encryption')?.value;
    const password = (group.get('password')?.value ?? '').trim();
    if (encryption === 'nopass') return null;
    return password ? null : { passwordRequired: true };
  };
}

export function socialAtLeastOneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const links = (control.value ?? []) as { url: string }[];
    const hasOne = links.some((link) => link.url?.trim());
    return hasOne ? null : { atLeastOne: true };
  };
}

export function appPlatformValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const platform = group.get('platform')?.value;
    const iosUrl = (group.get('iosUrl')?.value ?? '').trim();
    const androidUrl = (group.get('androidUrl')?.value ?? '').trim();
    if (platform === 'ios') return iosUrl ? null : { iosRequired: true };
    if (platform === 'android') return androidUrl ? null : { androidRequired: true };
    return iosUrl || androidUrl ? null : { required: true };
  };
}
